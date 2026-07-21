import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";

import { sequelize } from "../migrations/index";

class Department extends Model<
  InferAttributes<Department>,
  InferCreationAttributes<Department>
> {
  declare department_id: CreationOptional<number>;
  declare department_name: string;
  declare office_location: string | null;
  declare phone: string | null;
  declare price_semester : number;
}

Department.init(
  {
    department_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    department_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    office_location: {
      type: DataTypes.STRING(100)
    },

    phone: {
      type: DataTypes.STRING(20)
    },
    price_semester: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
  },
  {
    sequelize,
    timestamps: false,
    tableName: "departments",
    underscored: true
  }
);

export default Department;