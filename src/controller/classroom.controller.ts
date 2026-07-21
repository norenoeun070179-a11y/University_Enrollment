import { Request, Response } from "express";
import Classroom from "../models/classroom.model";

/* =========================
   Get All Classrooms
========================= */
export const getClassrooms = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await Classroom.findAll();

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
   Get Classroom By ID
========================= */
export const getClassroomById = async (
  req: Request,
  res: Response
) => {
  try {
    const room_id = Number(req.params.id);

    const data = await Classroom.findByPk(room_id);

    if (!data) {
      return res.status(404).json({
        message: "Classroom not found"
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
   Create Classroom
========================= */
export const createClassroom = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      building_name,
      room_number,
      capacity,
      room_type
    } = req.body;

    if(!building_name || !room_number){
      res.status(400).json({
        message: "Data is required !"
      })
    }
    const data = await Classroom.create({
      building_name,
      room_number,
      capacity,
      room_type
    });

    return res.status(201).json({
      message: "Classroom created successfully",
      data
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};

/* =========================
   Update Classroom
========================= */
export const updateClassroom = async (
  req: Request,
  res: Response
) => {
  try {
    const room_id = Number(req.params.id);
    

    const data = await Classroom.findByPk(room_id);

    if (!data) {
      return res.status(404).json({
        message: "Classroom not found"
      });
    }
    if(!req.body){
      res.status(400).json({
        message: "Data is required !"
      })
    }
    await data.update(req.body);

    return res.status(200).json({
      message: "Classroom updated successfully",
      data
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};

/* =========================
   Delete Classroom
========================= */
export const deleteClassroom = async (
  req: Request,
  res: Response
) => {
  try {
    const room_id = Number(req.params.id);

    const data = await Classroom.findByPk(room_id);

    if (!data) {
      return res.status(404).json({
        message: "Classroom not found"
      });
    }

    await data.destroy();

    return res.status(200).json({
      message: "Classroom deleted successfully"
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};