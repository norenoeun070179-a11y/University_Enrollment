import express from "express";
import {
  checkPayment
} from "../controller/checkpayment.controller";

const router = express.Router();

router.post(
  "/check/:id",
  checkPayment
);

export default router;