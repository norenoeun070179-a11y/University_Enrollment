import express from "express";
import { paymentLimiter } from "../middleware/paymentLimit";
import {
  generateKHQR
} from "../controller/generateKhqr.controller";
import { checkRegistration } from "../middleware/checkRegistration";

const router =
  express.Router();

router.post(
  "/khqr",paymentLimiter,checkRegistration,
  generateKHQR
);

export default router;


import {getPayments , deletePayment ,getPaymentByid, createCashPayment} from "../controller/payment.controller"
import { authMiddleware,allowAdminOnly,allowNormal } from "../middleware/auth.user";
import { customerAuth } from "../middleware/customerAuth";

export const Payment = (app : express.Application) => {
  app.get("/payment/:id", getPaymentByid)

  app.post("/payment",checkRegistration,authMiddleware,allowNormal,createCashPayment)
  app.get('/payment',authMiddleware,allowNormal,getPayments)
  app.delete("/payment/:id",authMiddleware,allowAdminOnly, deletePayment);
  // app.delete("/payment", deleteAllPayments);
  
}