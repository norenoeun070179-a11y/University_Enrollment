import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";

import { sequelize } from "../migrations/index";

class Classroom extends Model<
  InferAttributes<Classroom>,
  InferCreationAttributes<Classroom>
> {
  declare room_id: CreationOptional<number>;
  declare building_name: string;
  declare room_number: string;
  declare capacity: number | null;
  declare room_type: string | null;
}

Classroom.init(
  {
    room_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    building_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },

    room_number: {
      type: DataTypes.STRING(10),
      allowNull: false
    },

    capacity: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    room_type: {
      type: DataTypes.STRING(50)
    }
  },
  {
    sequelize,
    timestamps: false,
    tableName: "classrooms",
    underscored: true
  }
);

export default Classroom;