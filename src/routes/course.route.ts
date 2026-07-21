import { createCourse, getCourseById, getCourses, updateCourse, deleteCourse } from "../controller/course.controller";
import express from "express";
import { authMiddleware,allowNormal } from "../middleware/auth.user";


export const Course = (app : express.Application) => {
    app.get('/course',getCourses)
    app.get('/course/:id',getCourseById)

    app.post('/course',authMiddleware,allowNormal,createCourse)
    app.put('/course/:id',authMiddleware,allowNormal,updateCourse)
    app.delete('/course/:id',authMiddleware,allowNormal,deleteCourse)


}