import { Request, Response, NextFunction } from "express";
import Setting from "../models/setting.model";

export const checkRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const setting = await Setting.findOne();

    if (!setting) {
      return res.status(404).json({
        message: "System setting not found."
      });
    }

    if (!setting.registration_open) {
      return res.status(403).json({
        message:
          " Please wait until registration opens."
      });
    }

    next();
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
}; 