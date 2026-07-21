import { Request, Response } from "express";
import Student from "../models/student.model";
import Enrollment from "../models/enrollment.model";
import Setting from "../models/setting.model";

const toOptionalInteger = (value: unknown) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  return Number(value);
};

export const createStudent = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      student_code,
      first_name,
      last_name,
      gender,
      date_of_birth,
      email,
      phone,
      address,
      customer_id
    } = req.body;

    if (
      !student_code ||
      !first_name ||
      !last_name ||
      !gender ||
      !email
    ) {
      return res.status(400).json({
        message: "Please fill all required fields."
      });
    }

    if (!["Male", "Female"].includes(gender)) {
      return res.status(400).json({
        message: "Gender must be Male or Female."
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingStudentCode =
      await Student.findOne({
        where: { student_code }
      });

    if (existingStudentCode) {
      return res.status(400).json({
        message: "Student code already exists."
      });
    }

    const existingEmail =
      await Student.findOne({
        where: { email: cleanEmail }
      });

    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists."
      });
    }
    
    const photo = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const student = await Student.create({
      student_code,
      first_name,
      last_name,
      gender,
      date_of_birth,
      email: cleanEmail,
      phone,
      address,
      customer_id: toOptionalInteger(customer_id),
      photo
    });

    return res.status(201).json({
      message: "Student created successfully",
      data: student
    });

  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};

export const getStudents = async (
  req: Request,
  res: Response
) => {
  try {
    const { class_id } = req.query;

    const data = await Student.findAll({
      include: [
        {
          model: Enrollment,
          where: class_id
            ? {
                class_id: Number(class_id)
              }
            : undefined,
          required: !!class_id
        }
      ]
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

import fs from "fs";
import path from "path";

export const updateStudent = async (
  req: Request,
  res: Response
) => {
  try {
    const student_id = Number(req.params.id);

    const student =
      await Student.findByPk(student_id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found."
      });
    }

    const {
      student_code,
      first_name,
      last_name,
      gender,
      date_of_birth,
      email,
      phone,
      address,
      customer_id
    } = req.body;

    if (
      gender &&
      !["Male", "Female"].includes(gender)
    ) {
      return res.status(400).json({
        message: "Gender must be Male or Female."
      });
    }

    let photo = student.photo;

    if (req.file) {

      if (student.photo) {

        const oldPhoto = path.join(
          process.cwd(),
          student.photo.replace(/^\//, "")
        );

        if (fs.existsSync(oldPhoto)) {
          fs.unlinkSync(oldPhoto);
        }
      }

      photo = `/uploads/${req.file.filename}`;
    }

    if (email) {

      const cleanEmail =
        email.trim().toLowerCase();

      const emailExists =
        await Student.findOne({
          where: { email: cleanEmail }
        });

      if (
        emailExists &&
        emailExists.student_id !==
          student.student_id
      ) {
        return res.status(400).json({
          message: "Email already exists."
        });
      }

      student.email = cleanEmail;
    }

    await student.update({
      student_code,
      first_name,
      last_name,
      gender,
      date_of_birth,
      phone,
      address,
      customer_id:
        toOptionalInteger(customer_id),
      photo
    });

    return res.status(200).json({
      message: "Student updated successfully",
      data: student
    });

  } catch (error: any) {

    return res.status(500).json({
      message: error.message
    });

  }
};

export const deleteStudent = async (
  req: Request,
  res: Response
) => {
  try{
    const student_id = Number(req.params.id);
    const student = await Student.findByPk(student_id);
    if(!student){
      return res.status(404).json({message: "Student not found !"})
    }

    await student.destroy();
    return res.json({message : "Student deleted "})

  }catch(err){
    console.log("Error:", err);
    res.status(500).json({message: "Can't delete student !"})
  }
}

export const getStudentProfile = async (
  req: Request,
  res: Response
) => {
  try{
    const student_id = Number(req.params.id);
    const student = await Student.findByPk(student_id);
    if(!student){
      res.status(404).json({message: "Student not found !"})
    }else{
      res.json({student})
    }

  }catch(err){
    console.log("Error:", err);
    res.status(500).json({message: "Can't get student profile !"})
  }
}

