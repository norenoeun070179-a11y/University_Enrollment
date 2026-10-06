import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";

import { sequelize } from "../migrations/index";

class Enrollment extends Model<
  InferAttributes<Enrollment>,
  InferCreationAttributes<Enrollment>
> {
  declare enrollment_id: CreationOptional<number>;
  declare student_id: number ;
  declare class_id: number | null;
  declare department_id: number;
  declare year: CreationOptional<number>;
  declare enrollment_date: string;
  declare status: string | null;
  declare payment_id: number ;
}

Enrollment.init(
  {
    enrollment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    class_id: {
      type: DataTypes.INTEGER
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payment_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: () => new Date().getFullYear()
    },

    enrollment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },

    status: {
      type: DataTypes.STRING(20)
    }
  },
  {
    sequelize,
    timestamps: false,
    tableName: "enrollments",
    underscored: true
  }
);

export default Enrollment;