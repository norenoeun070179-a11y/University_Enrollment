import { createSchedule, getScheduleById, getSchedules, updateSchedule, deleteSchedule } from "../controller/schedule.controller";
import express from "express";
import { authMiddleware,allowNormal } from "../middleware/auth.user";

export const Schedule = (app : express.Application) => {
    app.get('/schedule',getSchedules)
    // app.get('/schedule/:id',getScheduleById)

    app.post('/schedule',authMiddleware,allowNormal,createSchedule)
    app.put('/schedule/:id',authMiddleware,allowNormal,updateSchedule)
    app.delete('/schedule/:id',authMiddleware,allowNormal,deleteSchedule)

}