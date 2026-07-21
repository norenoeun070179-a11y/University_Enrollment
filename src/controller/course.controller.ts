import { Request, Response } from "express";
import Course from "../models/course.model";
import  Department  from "../models/department.model";

/* =========================
   Get All Courses
========================= */
export const getCourses = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await Course.findAll();

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
   Get Course By ID
========================= */
export const getCourseById = async (
  req: Request,
  res: Response
) => {
  try {
    const course_id = Number(req.params.id);

    const data = await Course.findByPk(course_id,{
      include: [
        {
          model: Department
        }
      ]
    });

    if (!data) {
      return res.status(404).json({
        message: "Course not found"
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
   Create Course
========================= */
export const createCourse = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      course_code,
      course_title,
      credits,
      description,
      department_id
    } = req.body;

    const exists = await Course.findOne({
      where: { course_code }
    });

    if (exists) {
      return res.status(409).json({
        message: "Course code already exists"
      });
    }

    const data = await Course.create({
      course_code,
      course_title,
      credits,
      description,
      department_id
    });

    return res.status(201).json({
      message: "Course created successfully",
      data
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};

/* =========================
   Update Course
========================= */
export const updateCourse = async (
  req: Request,
  res: Response
) => {
  try {
    const course_id = Number(req.params.id);

    const course = await Course.findByPk(course_id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    const { course_code } = req.body;

    if (
      course_code &&
      course_code !== course.course_code
    ) {
      const exists = await Course.findOne({
        where: { course_code }
      });

      if (exists) {
        return res.status(409).json({
          message: "Course code already exists"
        });
      }
    }

    await course.update(req.body);

    return res.status(200).json({
      message: "Course updated successfully",
      data: course
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};

/* =========================
   Delete Course
========================= */
export const deleteCourse = async (
  req: Request,
  res: Response
) => {
  try {
    const course_id = Number(req.params.id);

    const course = await Course.findByPk(course_id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    await course.destroy();

    return res.status(200).json({
      message: "Course deleted successfully"
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};