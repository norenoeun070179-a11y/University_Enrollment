import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional
} from "sequelize";

import { sequelize } from "../migrations/index";

class Schedule extends Model<
  InferAttributes<Schedule>,
  InferCreationAttributes<Schedule>
> {
  declare schedule_id: CreationOptional<number>;

  declare class_id: number;

  declare day_of_week: string;

  declare start_time: string;
  declare end_time: string;
  declare lecturer_id : number;
  declare course_id : number;
  declare classroom_id: number ;
}

Schedule.init(
  {
    schedule_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    day_of_week: {
      type: DataTypes.STRING(20),
      allowNull: false
    },

    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },

    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },

    classroom_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lecturer_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "schedules",
    timestamps: false,
    underscored: true
  }
);

export default Schedule;