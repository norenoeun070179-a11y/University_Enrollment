import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";

import { sequelize } from "../migrations/index";

class Lecturer extends Model<
  InferAttributes<Lecturer>,
  InferCreationAttributes<Lecturer>
> {
  declare lecturer_id: CreationOptional<number>;
  declare first_name: string;
  declare last_name: string;
  declare email: string;
  declare phone: string | null;
  declare hire_date: string;
  declare course_id: number | null;
  // declare department_id: number | null;
}

Lecturer.init(
  {
    lecturer_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },

    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },

    phone: {
      type: DataTypes.STRING(20)
    },

    hire_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    course_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    // department_id: {
    //   type: DataTypes.INTEGER
    // }
  },
  {
    sequelize,
    timestamps: false,
    tableName: "lecturers",
    underscored: true
  }
);

export default Lecturer;