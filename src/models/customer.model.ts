import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";

import { sequelize } from "../migrations/index";

class Customer extends Model<
  InferAttributes<Customer>,
  InferCreationAttributes<Customer>
> {
  declare customer_id: CreationOptional<number>;

  declare first_name: string;
  declare last_name: string;

  declare email: string;

  declare google_id: string;

  declare profile_picture: string | null;

  declare phone: string | null;

  declare address: string | null;
  
  declare is_active: CreationOptional<boolean>;
}

Customer.init(
  {
    customer_id: {
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

    google_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },

    profile_picture: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    phone: {
      type: DataTypes.STRING(20),
      allowNull: true
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    sequelize,
    tableName: "customers",
    timestamps: true,
    underscored: true
  }
);

export default Customer;