import { createEnrollment , deleteEnrollment , getEnrollmentById , getEnrollments , updateEnrollment } from "../controller/enrollment.controller";
import express from "express";
import {customerAuth} from "../middleware/customerAuth"
import { allowNormal,authMiddleware } from "../middleware/auth.user";
import { checkRegistration } from "../middleware/checkRegistration";
import { validateEnrollment } from "../middleware/enroll.limit";

export const Enrollment = (app : express.Application) => {
    app.get('/enroll',getEnrollments)
    app.get('/enroll/:id',getEnrollmentById)

    app.post('/enroll/cus',validateEnrollment,checkRegistration,createEnrollment)
    app.post('/enroll',checkRegistration,createEnrollment)
    app.put('/enroll/:id',authMiddleware,allowNormal,updateEnrollment)
    app.delete('/enroll/:id',authMiddleware,allowNormal,deleteEnrollment)

}