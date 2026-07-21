import {getCustomers,getCustomerById, getCustomerById_admin} from '../controller/customer.controller'
import express from "express";
import {customerAuth} from '../middleware/customerAuth'
import { authMiddleware,allowAdminOnly } from '../middleware/auth.user';


export const Customer = (app : express.Application) => {
    app.get('/customer',authMiddleware,allowAdminOnly,getCustomers)
    app.get('/customer/:id',customerAuth,getCustomerById)    
    app.get('/customer/use/:id',authMiddleware,allowAdminOnly,getCustomerById_admin)    
    // app.get('/customer/profile',getProfile)
}