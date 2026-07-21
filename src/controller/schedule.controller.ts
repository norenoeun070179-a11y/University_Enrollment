import { Request, Response } from "express";
import Schedule from "../models/schedule.model";
import Lecturer from "../models/lecturer.model";
import Course from "../models/course.model";
import Class from "../models/class.model";
import Classroom from "../models/classroom.model";

/* =========================
   Get All Schedules
========================= */
export const getSchedules = async (
  req: Request,
  res: Response
) => {
  try {
    const { class_id } = req.query;

    const where = class_id
      ? { class_id: Number(class_id) }
      : {};

    const data = await Schedule.findAll({
      where
    });

    return res.status(200).json({
      data
    });

  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};

/* =========================
   Get Schedule By ID
========================= */
export const getScheduleById = async (
  req: Request,
  res: Response
) => {
  try {
    const schedule_id = Number(req.params.id);

    const data = await Schedule.findByPk(schedule_id,{
      include:[
        {model: Class},
        {model:Classroom},
        {model:Course},
        {model:Lecturer}
      ]
    });

    if (!data) {
      return res.status(404).json({
        message: "Schedule not found"
      });
    }

    return res.status(200).json({
      data
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};

/* =========================
   Create Schedule
========================= */
export const createSchedule = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      class_id,
      day_of_week,
      start_time,
      end_time,
      classroom_id,
      course_id,
      lecturer_id
    } = req.body;

    // Count schedules in this class
    const totalSchedule = await Schedule.count({
      where: {
        class_id
      }
    });

    if (totalSchedule >= 5) {
      return res.status(400).json({
        success: false,
        message: "This class already has 5 schedules."
      });
    }

    const data = await Schedule.create({
      class_id,
      day_of_week,
      start_time,
      end_time,
      classroom_id,
      course_id,
      lecturer_id
    });

    return res.status(201).json({
      success: true,
      message: "Schedule created successfully",
      data
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
/* =========================
   Update Schedule
========================= */
export const updateSchedule = async (
  req: Request,
  res: Response
) => {
  try {
    const schedule_id = Number(req.params.id);

    const schedule = await Schedule.findByPk(schedule_id);

    if (!schedule) {
      return res.status(404).json({
        message: "Schedule not found"
      });
    }

    const {
      class_id,
      day_of_week,
      start_time,
      end_time,
      classroom_id,
      course_id,
      lecturer_id
    } = req.body;

    await schedule.update({
      class_id,
      day_of_week,
      start_time,
      end_time,
      classroom_id,
      course_id,
      lecturer_id
    });

    return res.status(200).json({
      message: "Schedule updated successfully",
      data: schedule
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};

/* =========================
   Delete Schedule
========================= */
export const deleteSchedule = async (
  req: Request,
  res: Response
) => {
  try {
    const schedule_id = Number(req.params.id);

    const schedule = await Schedule.findByPk(schedule_id);

    if (!schedule) {
      return res.status(404).json({
        message: "Schedule not found"
      });
    }

    await schedule.destroy();

    return res.status(200).json({
      message: "Schedule deleted successfully"
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};