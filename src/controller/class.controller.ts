import { Request, Response } from "express";
import Class from "../models/class.model";
import Department from "../models/department.model";
import Setting from "../models/setting.model";
/* =========================
   Get All Classes
========================= */
export const getClasses = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await Class.findAll();

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
   Get Class By ID
========================= */
export const getClassById = async (
  req: Request,
  res: Response
) => {
  try {
    const class_id = Number(req.params.id);

    const data = await Class.findByPk(class_id,
      {
        include:[
          {model: Department}
        ]
      }
    );

    if (!data) {
      return res.status(404).json({
        message: "Class not found"
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
   Create Class
========================= */
export const createClass = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      class_name,
      // semester,
      year,
      schedule,
      department_id
    } = req.body;
    if(!class_name || !year || !department_id){
      res.status(400).json({
        message: "Data is required !"
      })
    }
    if (
      !["morning", "afternoon", "night"].includes(
        schedule
      )
    ) {
      return res.status(400).json({
        message:
          "Schedule must be morning, afternoon or night"
      });
    }

    const setting = await Setting.findOne();
    if (!setting) {
      return res.status(404).json({
        message: "Semester not found!"
      });
    }

    const data = await Class.create({
      class_name,
      semester: setting.current_semester,
      year,
      schedule,
      department_id
    });

    return res.status(201).json({
      message: "Class created successfully",
      data
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};

/* =========================
   Update Class
========================= */
export const updateClass = async (
  req: Request,
  res: Response
) => {
  try {
    const class_id = Number(req.params.id);

    const data = await Class.findByPk(
      class_id
    );

    if (!data) {
      return res.status(404).json({
        message: "Class not found"
      });
    }

    const {
      class_name,
      year,
      schedule,
    } = req.body;

    if (
      schedule &&
      !["morning", "afternoon", "night"].includes(
        schedule
      )
    ) {
      return res.status(400).json({
        message:
          "Schedule must be morning, afternoon or night"
      });
    }

    await data.update({
      class_name,
      year,
      schedule
    });

    return res.status(200).json({
      message: "Class updated successfully",
      data
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};

/* =========================
   Delete Class
========================= */
export const deleteClass = async (
  req: Request,
  res: Response
) => {
  try {
    const class_id = Number(req.params.id);

    const data = await Class.findByPk(class_id);

    if (!data) {
      return res.status(404).json({
        message: "Class not found"
      });
    }

    await data.destroy();

    return res.status(200).json({
      message: "Class deleted successfully"
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};