import { Request, Response } from "express";
import Payment from "../models/payment.model";
import Customer from "../models/customer.model";
import Student from "../models/student.model";
import Department from "../models/department.model";
import Setting from "../models/setting.model";
import QRCode from "qrcode";
import cron from "node-cron";
import { Op } from "sequelize";

import {
  BakongKHQR,
  khqrData,
  IndividualInfo
} from "bakong-khqr";

export const generateKHQR = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      customer_id: bodyCustomerId,
      student_id,
      department_id
      // amount
    } = req.body;

    const customer_id = Number(bodyCustomerId);
    const studentId = Number(student_id);
    const departmentId = Number(department_id);

    const setting = await Setting.findOne();

    if (!customer_id || Number.isNaN(customer_id)) {
      return res.status(400).json({
        success: false,
        message: "Customer id is required"
      });
    }

    if (!studentId || Number.isNaN(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Student id is required"
      });
    }

    if (!departmentId || Number.isNaN(departmentId)) {
      return res.status(400).json({
        success: false,
        message: "Department id is required"
      });
    }

    const customer =
      await Customer.findByPk(customer_id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });
    }

    const student =
      await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }
    const department =
      await Department.findByPk(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    const payment = await Payment.create({
      customer_id,
      student_id: studentId,
      department_id: departmentId,
      amount:Number(department.price_semester),
      currency: "USD",
      payment_method: "khqr",
      status: "pending"
    });

    const expirationTimestamp =
      Date.now() + 5 * 60 * 1000;

    const optionalData = {
      currency: khqrData.currency.usd,
      amount: Number(department.price_semester),
      expirationTimestamp
    };

    const individualInfo =
      new IndividualInfo(
        process.env.BAKONG_ACCOUNT_USERNAME!,
        process.env.BAKONG_ACCOUNT_NAME!,
        "PHNOM PENH",
        optionalData
      );

    const KHQR = new BakongKHQR();

    const qrData =
      KHQR.generateIndividual(
        individualInfo
      );

    if (
      !qrData ||
      !qrData.data ||
      !qrData.data.qr
    ) {
      throw new Error(
        "KHQR generation failed"
      );
    }

    const qrImage =
      await QRCode.toDataURL(
        qrData.data.qr
      );

        await payment.update({
          qr_code: qrData.data.qr,
          qr_md5: qrData.data.md5,
          qr_expiration:
            expirationTimestamp
        });
        cron.schedule("* * * * *", async () => {
      try {
        await Payment.destroy({
          where: {
            status: "pending",
            qr_expiration: {
              [Op.lt]: Date.now()
            }
          }
        });
      } catch (error) {
        console.log(error);
      }
    });

    return res.status(201).json({
      success: true,
      message:
        "KHQR generated successfully",
      data: {
        payment_id:
          payment.payment_id,
        student_id: studentId,
        customer_id,
        department_id: departmentId,
        amount: payment.amount,
        qr_code:
          payment.qr_code,
        qr_image:
          qrImage,
        qr_md5:
          payment.qr_md5,
        expires_at: new Date(
          expirationTimestamp
        )
      }
    });
  }  catch (error: any) {
  console.error("🔥 KHQR generation error:", error.message);
  console.error("Stack:", error.stack);
  return res.status(500).json({
    success: false,
    message: "Failed to generate KHQR",
    error: error.message,      // <-- send this to frontend for debugging
  });
}
};
