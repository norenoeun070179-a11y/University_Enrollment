import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";

import { sequelize } from "../migrations/index";

class Student extends Model<
  InferAttributes<Student>,
  InferCreationAttributes<Student>
> {
  declare student_id: CreationOptional<number>;
  declare student_code: string;

  declare first_name: string;
  declare last_name: string;

  declare gender: "Male" | "Female";

  declare date_of_birth: string | null;

  declare email: string;
  declare phone: string | null;

  declare address: string | null;

  declare enrollment_date: CreationOptional<Date>;

  declare customer_id: number | null;

  declare photo: string | null;
}

Student.init(
  {
    student_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    student_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },

    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },

    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },

    gender: {
      type: DataTypes.ENUM("Male", "Female"),
      allowNull: false
    },

    date_of_birth: {
      type: DataTypes.DATEONLY
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },

    phone: {
      type: DataTypes.STRING(20)
    },

    address: {
      type: DataTypes.TEXT
    },

    enrollment_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },

    customer_id: {
      type: DataTypes.INTEGER
    },

    photo: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  },
  {
    sequelize,
    timestamps: false,
    tableName: "students",
    underscored: true
  }
);

export default Student;