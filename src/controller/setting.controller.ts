import { Request, Response } from "express";
import Setting from "../models/setting.model";
import fs from "fs";
import path from "path";

/* =========================
   Get Setting
========================= */
export const getSetting = async (
  req: Request,
  res: Response
) => {
  try {
    const setting = await Setting.findOne();

    if (!setting) {
      return res.status(404).json({
        message: "Setting not found"
      });
    }

    return res.status(200).json({
      data: setting
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};

/* =========================
   Create Setting
========================= */
export const createSetting = async (
  req: Request,
  res: Response
) => {
  try {
    const exist = await Setting.findOne();

    if (exist) {
      return res.status(400).json({
        message: "Setting already exists"
      });
    }

    const data = await Setting.create({
      ...req.body,
      university_logo: req.file
        ? `/uploads/${req.file.filename}`
        : null
    });

    return res.status(201).json({
      message: "Setting created successfully",
      data
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};

/* =========================
   Update Setting
========================= */
export const updateSetting = async (
  req: Request,
  res: Response
) => {
  try {
    const setting = await Setting.findOne();

    if (!setting) {
      return res.status(404).json({
        message: "Setting not found"
      });
    }

    await setting.update({
      ...req.body,
      university_logo: req.file
        ? `/uploads/${req.file.filename}`
        : setting.university_logo
    });

    return res.status(200).json({
      message: "Setting updated successfully",
      data: setting
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};

export const updateUserSetting = async (
  req: Request,
  res: Response
) => {
  try {
    const setting = await Setting.findOne();

    if (!setting) {
      return res.status(404).json({
        message: "Setting not found"
      });
    }

    const {
      timezone,
      language,
      maintenance_mode
    } = req.body;

    let university_logo = setting.university_logo;

    if (req.file) {
      // Delete old logo
      if (setting.university_logo) {
        const oldLogoPath = path.join(
          process.cwd(),
          setting.university_logo.replace(/^\//, "")
        );

        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath);
        }
      }

      // Save new logo
      university_logo = `/uploads/${req.file.filename}`;
    }

    await setting.update({
      timezone,
      language,
      maintenance_mode,
      university_logo
    });

    return res.status(200).json({
      message: "Setting updated successfully",
      data: setting
    });

  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};



/* =========================
   Delete Setting
========================= */
export const deleteSetting = async (
  req: Request,
  res: Response
) => {
  try {
    const setting = await Setting.findOne();

    if (!setting) {
      return res.status(404).json({
        message: "Setting not found"
      });
    }

    await setting.destroy();

    return res.status(200).json({
      message: "Setting deleted successfully"
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};