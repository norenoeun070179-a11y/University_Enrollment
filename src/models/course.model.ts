import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";

import { sequelize } from "../migrations/index";

class Course extends Model<
  InferAttributes<Course>,
  InferCreationAttributes<Course>
> {
  declare course_id: CreationOptional<number>;
  declare course_code: string;
  declare course_title: string;
  declare credits: number;
  declare description: string | null;
  declare department_id: number | null;
}

Course.init(
  {
    course_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    course_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    },

    course_title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },

    credits: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    description: {
      type: DataTypes.TEXT
    },

    department_id: {
      type: DataTypes.INTEGER
    }
  },
  {
    sequelize,
    timestamps: false,
    tableName: "courses",
    underscored: true
  }
);

export default Course;