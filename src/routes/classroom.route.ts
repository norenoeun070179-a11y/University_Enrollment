import { createClassroom, getClassroomById, getClassrooms , updateClassroom, deleteClassroom } from "../controller/classroom.controller";
import express from "express";
import { authMiddleware, allowAdminOnly,allowNormal } from "../middleware/auth.user";


export const Classroom = (app : express.Application) => {   
    app.get('/room',getClassrooms)
    app.get('/room/:id',getClassroomById)

    app.post('/room',authMiddleware,allowNormal,createClassroom)
    app.put('/room/:id',authMiddleware,allowNormal,updateClassroom)
    app.delete('/room/:id',authMiddleware,allowNormal,deleteClassroom)

}