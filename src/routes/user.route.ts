import { adminLogin, createUser, deleteUser, getProfile, getUsers, loginUser, logoutUser, updateUser } from "../controller/user.controller";
import express from "express";
import { globalLimiter } from "../middleware/rateLimit";
import { authMiddleware ,allowAdminOnly, allowNormal  } from "../middleware/auth.user";

const User = (app: express.Application) => {

    app.get('/users',authMiddleware,allowAdminOnly, getUsers)

    app.post('/admin/log', globalLimiter, adminLogin)
    app.post('/user/log',globalLimiter, loginUser)
    app.post('/logout',logoutUser)
    app.post('/user',authMiddleware,allowAdminOnly, createUser)
    app.put('/user/:id',authMiddleware,allowAdminOnly,updateUser)
    app.delete('/user/:id',authMiddleware,allowAdminOnly,deleteUser)
    app.get('/user',authMiddleware,allowNormal,getProfile)
}

export default   User ;  