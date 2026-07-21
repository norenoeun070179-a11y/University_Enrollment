import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";

import { sequelize } from "../migrations/index";

class Setting extends Model<
  InferAttributes<Setting>,
  InferCreationAttributes<Setting>
> {
  declare setting_id: CreationOptional<number>;

  // University Information
  declare university_name: string;
  declare university_logo: string | null;
  declare university_email: string | null;
  declare university_phone: string | null;
  declare university_address: string | null;
  declare university_website: string | null;

  // Academic
  declare academic_year: string;
  declare current_semester: string;

  declare enrollment_open_date: string;
  declare enrollment_close_date: string;

  declare registration_open: CreationOptional<boolean>;

  // Class Rules
  declare max_student_per_class: CreationOptional<number>;
  declare max_student_per_department: CreationOptional<number>;
  declare max_enrollment_per_student: CreationOptional<number>;

  // Payment
  declare currency: CreationOptional<string>;
  declare registration_fee: CreationOptional<number>;
  declare qr_expire_minutes: CreationOptional<number>;

  declare allow_cash_payment: CreationOptional<boolean>;
  declare allow_khqr_payment: CreationOptional<boolean>;

  // System
  declare timezone: CreationOptional<string>;
  declare language: CreationOptional<string>;

  declare maintenance_mode: CreationOptional<boolean>;

  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

Setting.init(
  {
    setting_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    // University Information
    university_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },

    university_logo: {
      type: DataTypes.STRING(255)
    },

    university_email: {
      type: DataTypes.STRING(100)
    },

    university_phone: {
      type: DataTypes.STRING(20)
    },

    university_address: {
      type: DataTypes.TEXT
    },

    university_website: {
      type: DataTypes.STRING(150)
    },

    // Academic
    academic_year: {
      type: DataTypes.STRING(20),
      allowNull: false
    },

    current_semester: {
      type: DataTypes.STRING(20),
      allowNull: false
    },

    enrollment_open_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    enrollment_close_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    registration_open: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    // Class Rules
    max_student_per_class: {
      type: DataTypes.INTEGER,
      defaultValue: 50
    },

    max_student_per_department: {
      type: DataTypes.INTEGER,
      defaultValue: 500
    },

    max_enrollment_per_student: {
      type: DataTypes.INTEGER,
      defaultValue: 2
    },

    // Payment
    currency: {
      type: DataTypes.STRING(10),
      defaultValue: "USD"
    },

    registration_fee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },

    qr_expire_minutes: {
      type: DataTypes.INTEGER,
      defaultValue: 5
    },

    allow_cash_payment: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    allow_khqr_payment: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    // System
    timezone: {
      type: DataTypes.STRING(50),
      defaultValue: "Asia/Phnom_Penh"
    },

    language: {
      type: DataTypes.STRING(20),
      defaultValue: "English"
    },

    maintenance_mode: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: "settings",
    timestamps: false,
    underscored: true
  }
);

export default Setting;