import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";

import { sequelize } from "../migrations/index";

class Class extends Model<
  InferAttributes<Class>,
  InferCreationAttributes<Class>
> {
  declare class_id: CreationOptional<number>;
  declare class_name: string;
  declare semester: string;
  declare year: number;
  declare schedule: "morning" | "afternoon" | "night";
  declare department_id :   number;
}

Class.init(
  {
    class_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    class_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },

    semester: {
      type: DataTypes.STRING(20),
      allowNull: false
    },

    year: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    schedule: {
      type: DataTypes.ENUM(
        "morning",
        "afternoon",
        "night"
      ),
      allowNull: false
    },
    department_id: {
      type: DataTypes.INTEGER
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: "classes",
    underscored: true
  }
);

export default Class;