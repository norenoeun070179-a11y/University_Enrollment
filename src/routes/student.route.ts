import  express  from "express";
import { createStudent, deleteStudent, getStudentProfile, getStudents, updateStudent } from "../controller/student.controller";
import { uploadStudentPhoto } from "../middleware/upload";
import { authMiddleware,allowAdminOnly,allowNormal } from "../middleware/auth.user";
import {customerAuth} from "../middleware/customerAuth"
import { globalLimiter } from "../middleware/rateLimit";
import { checkRegistration } from "../middleware/checkRegistration";

export const Student = (app : express.Application) =>{
    app.post('/student',checkRegistration,authMiddleware,allowNormal,uploadStudentPhoto, createStudent);
    app.post('/student/cus',checkRegistration,customerAuth,uploadStudentPhoto,globalLimiter, createStudent);
    app.put('/student/:id',authMiddleware,allowNormal,uploadStudentPhoto, updateStudent)
    app.delete('/student/:id',authMiddleware,allowNormal,deleteStudent)
    
    app.get('/student',authMiddleware,allowNormal, getStudents);
    app.get('/student/cus:id',customerAuth,getStudentProfile)
    app.get('/student/:id',authMiddleware,allowNormal,getStudentProfile)
};
