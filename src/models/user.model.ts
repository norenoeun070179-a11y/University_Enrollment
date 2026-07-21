import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";

import { sequelize } from "../migrations/index";

class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare user_id: CreationOptional<number>;
  declare username: string;
  declare email: string;
  declare password: string;
  declare role: string;
  declare is_active: boolean;
  declare created_at: CreationOptional<Date>;
}

User.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },

    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "staff"
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    timestamps: false,
    tableName: "users",
    underscored: true
  }
);

export default User;