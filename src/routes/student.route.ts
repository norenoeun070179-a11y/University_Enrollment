import  express  from "express";
import { createStudent, deleteStudent, getStudentProfile, getStudents, updateStudent } from "../controller/student.controller";
import { uploadStudentPhoto } from "../middleware/upload";
import { authMiddleware,allowAdminOnly,allowNormal } from "../middleware/auth.user";
import {customerAuth} from "../middleware/customerAuth"
import { globalLimiter } from "../middleware/rateLimit";
import { checkRegistration } from "../middleware/checkRegistration";

export const Student = (app : express.Application) =>{
    app.post('/student',checkRegistration,authMiddleware,allowNormal,uploadStudentPhoto, createStudent);
    app.post('/student/cus',checkRegistration,uploadStudentPhoto,globalLimiter, createStudent);

    app.put('/student/:id',uploadStudentPhoto, updateStudent);
    app.patch('/student/:id',uploadStudentPhoto, updateStudent);
    app.put('/student/cus/:id',uploadStudentPhoto, updateStudent);
    app.patch('/student/cus/:id',uploadStudentPhoto, updateStudent);

    app.delete('/student/:id',authMiddleware,allowNormal,deleteStudent);
    
    app.get('/student',authMiddleware,allowNormal, getStudents);
    app.get('/student/cus/:id',getStudentProfile);
    app.get('/student/:id',getStudentProfile);
};
