import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DATABASE_URL as string,
  {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

const optionalForeignKeys = [
  {
    table: 'lecturers',
    column: 'course_id',
    referencedTable: 'courses',
    referencedColumn: 'course_id'
  },
  {
    table: 'courses',
    column: 'department_id',
    referencedTable: 'departments',
    referencedColumn: 'department_id'
  },
  {
    table: 'enrollments',
    column: 'student_id',
    referencedTable: 'students',
    referencedColumn: 'student_id'
  },
  {
    table: 'enrollments',
    column: 'class_id',
    referencedTable: 'classes',
    referencedColumn: 'class_id'
  }
] as const;

const cleanupOptionalForeignKeys = async (): Promise<void> => {
  for (const fk of optionalForeignKeys) {
    await sequelize.query(`
      DO $$
      BEGIN
        IF to_regclass('public.${fk.table}') IS NOT NULL
          AND to_regclass('public.${fk.referencedTable}') IS NOT NULL
        THEN
          UPDATE "${fk.table}" AS child
          SET "${fk.column}" = NULL
          WHERE child."${fk.column}" IS NOT NULL
            AND NOT EXISTS (
              SELECT 1
              FROM "${fk.referencedTable}" AS parent
              WHERE parent."${fk.referencedColumn}" = child."${fk.column}"
            );
        END IF;
      END $$;
    `);
  }
};

const integerColumns = [
  {
    table: 'enrollments',
    column: 'year'
  },
  {
    table: 'classes',
    column: 'year'
  }
] as const;

const normalizeIntegerColumns = async (): Promise<void> => {
  for (const column of integerColumns) {
    await sequelize.query(`
      DO $$
      BEGIN
        IF to_regclass('public.${column.table}') IS NOT NULL
          AND EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = '${column.table}'
              AND column_name = '${column.column}'
              AND data_type <> 'integer'
          )
        THEN
          IF EXISTS (
            SELECT 1
            FROM "${column.table}"
            WHERE "${column.column}" IS NOT NULL
              AND BTRIM("${column.column}"::text) !~ '^[0-9]+$'
          )
          THEN
            RAISE EXCEPTION 'Cannot convert %.% to integer because it contains non-numeric values',
              '${column.table}',
              '${column.column}';
          END IF;

          ALTER TABLE "${column.table}"
          ALTER COLUMN "${column.column}" TYPE INTEGER
          USING "${column.column}"::integer;
        END IF;
      END $$;
    `);
  }
};

const ensurePaymentDepartmentColumn = async (): Promise<void> => {
  await sequelize.query(`
    DO $$
    DECLARE
      fallback_department_id INTEGER;
    BEGIN
      IF to_regclass('public.payments') IS NOT NULL
        AND to_regclass('public.departments') IS NOT NULL
        AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'payments'
            AND column_name = 'department_id'
        )
      THEN
        ALTER TABLE "payments"
        ADD COLUMN "department_id" INTEGER;

        SELECT "department_id"
        INTO fallback_department_id
        FROM "departments"
        ORDER BY "department_id"
        LIMIT 1;

        IF fallback_department_id IS NOT NULL THEN
          UPDATE "payments"
          SET "department_id" = fallback_department_id
          WHERE "department_id" IS NULL;
        END IF;
      END IF;
    END $$;
  `);
};

const ensureScheduleCourseColumn = async (): Promise<void> => {
  await sequelize.query(`
    DO $$
    DECLARE
      fallback_course_id INTEGER;
      has_class_course_id BOOLEAN;
    BEGIN
      IF to_regclass('public.schedules') IS NOT NULL
        AND NOT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'schedules'
            AND column_name = 'course_id'
        )
      THEN
        ALTER TABLE "schedules"
        ADD COLUMN "course_id" INTEGER;
      END IF;

      IF to_regclass('public.schedules') IS NOT NULL
        AND EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'schedules'
            AND column_name = 'course_id'
        )
      THEN
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'classes'
            AND column_name = 'course_id'
        )
        INTO has_class_course_id;

        IF to_regclass('public.classes') IS NOT NULL AND has_class_course_id THEN
          UPDATE "schedules" AS schedule
          SET "course_id" = class."course_id"
          FROM "classes" AS class
          WHERE schedule."course_id" IS NULL
            AND schedule."class_id" = class."class_id"
            AND class."course_id" IS NOT NULL;
        END IF;

        IF to_regclass('public.courses') IS NOT NULL THEN
          SELECT "course_id"
          INTO fallback_course_id
          FROM "courses"
          ORDER BY "course_id"
          LIMIT 1;

          IF fallback_course_id IS NOT NULL THEN
            UPDATE "schedules"
            SET "course_id" = fallback_course_id
            WHERE "course_id" IS NULL;
          END IF;
        END IF;

        IF EXISTS (
          SELECT 1
          FROM "schedules"
          WHERE "course_id" IS NULL
        )
        THEN
          RAISE EXCEPTION 'Cannot set schedules.course_id to NOT NULL because existing schedules could not be matched to a course';
        END IF;

        ALTER TABLE "schedules"
        ALTER COLUMN "course_id" SET NOT NULL;
      END IF;
    END $$;
  `);
};

const migrate = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully!');
    await import("../models/department.model"); 
    await import("../models/student.model"); 
    await import("../models/lecturer.model"); 
    await import("../models/course.model"); 
    await import("../models/classroom.model"); 
    await import("../models/class.model"); 
    await import("../models/enrollment.model"); 
    await import("../models/user.model"); 
    await import("../models/relationship.model");
    await import("../models/schedule.model");
    await import("../models/customer.model");
    await import("../models/payment.model");
    await import("../models/setting.model");

    await cleanupOptionalForeignKeys();
    await normalizeIntegerColumns();
    await ensurePaymentDepartmentColumn();
    await ensureScheduleCourseColumn();
    
    await sequelize.sync({ alter: true });

    console.log('Database synchronized successfully!');
  } catch (error) {
    console.error('Failed to run migrate:', error);
  }
};

export default migrate;
