import { createLecturer, deleteLecturer, getAllLecturers, getLecturerProfile, updateLecturer } from "../controller/lecturer.controller";
import express  from "express";
import { authMiddleware,allowAdminOnly,allowNormal } from "../middleware/auth.user";

const Lecturer = (app: express.Application) => {
    app.get('/lecturer',getAllLecturers)
    app.get('/lecturer/:id',getLecturerProfile)

    app.post('/lecturer',authMiddleware,allowNormal,createLecturer)
    app.delete('/lecturer/:id',authMiddleware,allowNormal,deleteLecturer)
    app.put('/lecturer/:id',authMiddleware,allowNormal,updateLecturer)
}

export default Lecturer;