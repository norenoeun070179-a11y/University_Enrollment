import express from "express";
import {
  getSetting,
  createSetting,
  updateSetting,
  deleteSetting,
  updateUserSetting
} from "../controller/setting.controller";
import { allowAdminOnly,authMiddleware,allowNormal } from "../middleware/auth.user";
import {uploadStudentPhoto} from '../middleware/upload'

const Setting = (app:express .Application) => {
app.get("/setting",authMiddleware,allowNormal, getSetting);

app.post("/setting",uploadStudentPhoto,authMiddleware,allowAdminOnly, createSetting);

app.put("/setting",uploadStudentPhoto,authMiddleware,allowAdminOnly, updateSetting);
app.put("/setting_user",authMiddleware,allowNormal,updateUserSetting );

app.delete("/setting",authMiddleware,allowAdminOnly, deleteSetting);
}



export default Setting;