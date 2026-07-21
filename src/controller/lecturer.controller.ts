import { Request, Response } from "express";
import Lecturer from "../models/lecturer.model";
import {Course} from "../models/relationship.model";

const toOptionalInteger = (value: unknown) => {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  return Number(value);
};

export const createLecturer = async (req:Request , res:Response) => {
    try{
        if(!req.body || Object.keys(req.body).length === 0){
            return res.status(400).json({message: "Data is required !"})
        }
        const {first_name, last_name, email , phone , hire_date, course_id} = req.body;
        const cleanFirst_name : string = String(first_name).trim()
        const cleanLast_name : string = String(last_name).trim()
        const cleanEmail : string = String(email).trim().toLocaleLowerCase();

        if(!cleanFirst_name || !cleanLast_name || !cleanEmail ){
            return res.status(400).json({message: "Email is required !"})
        }

        const lecturer = await Lecturer.findOne({where:{email}})
        if(lecturer){
            return res.status(409).json({message: "Email already exists !"})
        }

        const data = await Lecturer.create({
            first_name:cleanFirst_name,
            last_name:cleanLast_name,
            email:cleanEmail,
            phone,
            hire_date,
            course_id: toOptionalInteger(course_id),
        })

        return res.status(201).json({
          data
        });
    }catch(err){
        console.log("Error:", err);
        res.status(500).json({message: "Can't create lecturer !"})
    }
}

export const getAllLecturers = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await Lecturer.findAll();

    return res.status(200).json({data});

  } catch (err) {
    console.log("Error:", err);

    return res.status(500).json({
      message: "Can't get lecturers!"
    });
  }
};

export const deleteLecturer = async (
  req: Request,
  res: Response
) => {
  try {
    const lecturer_id = Number(req.params.id);

    const lecturer = await Lecturer.findByPk(
      lecturer_id
    );

    if (!lecturer) {
      return res.status(404).json({
        message: "Lecturer not found"
      });
    }

    await lecturer.destroy();

    return res.status(200).json({
      message: "Lecturer deleted successfully"
    });

  } catch (err) {
    console.log("Error:", err);

    return res.status(500).json({
      message: "Can't delete lecturer"
    });
  }
};


export const updateLecturer = async (
  req: Request,
  res: Response
) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "Data is required!"
      });
    }

    const lecturer_id = Number(req.params.id);

    const lecturer = await Lecturer.findByPk(lecturer_id);

    if (!lecturer) {
      return res.status(404).json({
        message: "Lecturer not found!"
      });
    }

    const {
      first_name,
      last_name,
      email,
      phone,
      hire_date,
      course_id
    } = req.body;

    const cleanEmail =
      typeof email === "string"
        ? email.trim().toLowerCase()
        : undefined;

    // Check duplicate email (excluding current lecturer)
    if (cleanEmail) {
      const existingEmail = await Lecturer.findOne({
        where: {
          email: cleanEmail
        }
      });

      if (
        existingEmail &&
        existingEmail.lecturer_id !== lecturer.lecturer_id
      ) {
        return res.status(409).json({
          message: "Email already exists!"
        });
      }
    }

    await lecturer.update({
      first_name:
        first_name?.trim() ?? lecturer.first_name,

      last_name:
        last_name?.trim() ?? lecturer.last_name,

      email:
        cleanEmail ?? lecturer.email,

      phone:
        phone ?? lecturer.phone,

      hire_date:
        hire_date ?? lecturer.hire_date,

      course_id:
        toOptionalInteger(course_id) ?? lecturer.course_id
    });

    return res.status(200).json({
      message: "Lecturer updated successfully",
      data: lecturer
    });

  } catch (err) {
    console.log("Error:", err);

    return res.status(500).json({
      message: "Can't update lecturer!"
    });
  }
};

export const getLecturerProfile = async (
  req: Request,
  res: Response
) => {
  try {
    const lecturer_id = Number(req.params.id);

    const data = await Lecturer.findByPk(
      lecturer_id,
      {
        include: [
          {
            model: Course
          }
        ]
      }
    );

    if (!data) {
      return res.status(404).json({
        message: "Lecturer not found!"
      });
    }

    return res.status(200).json({data});

  } catch (err) {
    console.log("Error:", err);

    return res.status(500).json({
      message: "Can't get lecturer profile!"
    });
  }
};
