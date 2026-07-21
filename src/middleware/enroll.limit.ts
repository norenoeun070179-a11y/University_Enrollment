import { Request, Response, NextFunction } from "express";
import Enrollment from "../models/enrollment.model";
import Setting from "../models/setting.model";
import Class from "../models/class.model";

export const validateEnrollment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      student_id,
      class_id,
      department_id
    } = req.body;

    const setting = await Setting.findOne();

    if (!setting) {
      return res.status(404).json({
        message: "Setting not found."
      });
    }

    // Maximum enrollment
    const total = await Enrollment.count({
      where: { student_id }
    });

    if (
      total >= setting.max_enrollment_per_student
    ) {
      return res.status(400).json({
        message: `Maximum ${setting.max_enrollment_per_student} enrollment(s).`
      });
    }

    // Same department
    const sameDepartment =
      await Enrollment.findOne({
        where: {
          student_id,
          department_id
        }
      });

    if (sameDepartment) {
      return res.status(400).json({
        message:
          "Student already enrolled in this departments."
      });
    }

    // Same class
    const sameClass =
      await Enrollment.findOne({
        where: {
          student_id,
          class_id
        }
      });

    if (sameClass) {
      return res.status(400).json({
        message:
          "Student already enrolled in this class."
      });
    }

    // Class belongs to department
    const classData = await Class.findByPk(class_id);

    if (!classData) {
      return res.status(404).json({
        message: "Class not found."
      });
    }

    if (
      classData.department_id !== department_id
    ) {
      return res.status(400).json({
        message:
          "Class does not belong to this department."
      });
    }

    next();
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};