import express from "express";
import { updateDepartment, getDepartment, createDepartment, deleteDepartment, getIdDepartment } from "../controller/department.controller";

import { authMiddleware, allowAdminOnly,allowNormal } from "../middleware/auth.user";
const Department = (app: express.Application) => {
    app.get("/department", getDepartment);
    app.get("/department/:id", getIdDepartment)
    app.post("/department",authMiddleware,allowAdminOnly, createDepartment)
    app.delete("/department/:id",authMiddleware,allowAdminOnly, deleteDepartment)
    app.put("/department/:id",authMiddleware,allowAdminOnly, updateDepartment)
}
export default Department;

