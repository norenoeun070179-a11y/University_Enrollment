import { Request, Response } from "express";
import Student from "../models/student.model";
import Enrollment from "../models/enrollment.model";
import Payment from "../models/payment.model";
import Setting from "../models/setting.model";
import { sequelize } from "../migrations/index";

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
    const rawId = req.params.id;
    const student_id = Number(rawId);

    if (!student_id || Number.isNaN(student_id)) {
      return res.status(400).json({
        message: "Invalid student id."
      });
    }

    const student = await Student.findByPk(student_id);

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

    let cleanGender = student.gender;
    if (gender !== undefined && gender !== null && gender !== "") {
      const g = String(gender).trim().toLowerCase();
      if (g === "male" || g === "m") {
        cleanGender = "Male";
      } else if (g === "female" || g === "f") {
        cleanGender = "Female";
      } else {
        return res.status(400).json({
          message: "Gender must be Male or Female."
        });
      }
    }

    let photo = student.photo;

    if (req.file) {
      if (student.photo) {
        const oldPhoto = path.join(
          process.cwd(),
          student.photo.replace(/^\//, "")
        );

        if (fs.existsSync(oldPhoto)) {
          try {
            fs.unlinkSync(oldPhoto);
          } catch (e) {
            console.error("Error removing old photo:", e);
          }
        }
      }

      photo = `/uploads/${req.file.filename}`;
    }

    if (email) {
      const cleanEmail = email.trim().toLowerCase();

      if (cleanEmail !== student.email) {
        const emailExists = await Student.findOne({
          where: { email: cleanEmail }
        });

        if (emailExists && emailExists.student_id !== student.student_id) {
          return res.status(400).json({
            message: "Email already exists."
          });
        }
      }
    }

    if (student_code && student_code !== student.student_code) {
      const existingCode = await Student.findOne({
        where: { student_code }
      });

      if (existingCode && existingCode.student_id !== student.student_id) {
        return res.status(400).json({
          message: "Student code already exists."
        });
      }
    }

    await student.update({
      student_code: student_code !== undefined && student_code !== null && student_code !== "" ? String(student_code).trim() : student.student_code,
      first_name: first_name !== undefined && first_name !== null && first_name !== "" ? String(first_name).trim() : student.first_name,
      last_name: last_name !== undefined && last_name !== null && last_name !== "" ? String(last_name).trim() : student.last_name,
      gender: cleanGender,
      date_of_birth: date_of_birth !== undefined ? (date_of_birth || null) : student.date_of_birth,
      email: email ? email.trim().toLowerCase() : student.email,
      phone: phone !== undefined ? (phone ? String(phone).trim() : null) : student.phone,
      address: address !== undefined ? (address ? String(address).trim() : null) : student.address,
      customer_id: customer_id !== undefined ? (customer_id ? Number(customer_id) : null) : student.customer_id,
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
  const transaction = await sequelize.transaction();
  try {
    const student_id = Number(req.params.id);
    const student = await Student.findByPk(student_id, { transaction });
    if (!student) {
      await transaction.rollback();
      return res.status(404).json({ message: "Student not found !" });
    }

    await Enrollment.destroy({ where: { student_id }, transaction });
    await Payment.destroy({ where: { student_id }, transaction });
    await student.destroy({ transaction });

    await transaction.commit();
    return res.json({ message: "Student deleted successfully" });
  } catch (err: any) {
    await transaction.rollback();
    console.log("Error:", err);
    return res.status(500).json({ message: "Can't delete student !", error: err.message });
  }
};

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

