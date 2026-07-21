import { createClass, getClassById , getClasses, updateClass, deleteClass } from "../controller/class.controller";
import express from "express";
import { authMiddleware, allowAdminOnly,allowNormal } from "../middleware/auth.user";

export const Class = (app : express.Application)=> {
    app.get('/class',getClasses)
    app.get('/class/:id',getClassById)

    app.post('/class',authMiddleware,allowNormal,createClass)
    app.put('/class/:id',authMiddleware,allowNormal,updateClass)
    app.delete('/class/:id',authMiddleware,allowNormal,deleteClass)

}