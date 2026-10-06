import { Request, Response } from "express";
import crypto from "crypto";
import QRCode from "qrcode";
import Payment from "../models/payment.model";
import Customer from "../models/customer.model";
import Student from "../models/student.model";
import Department from "../models/department.model";
import Setting from "../models/setting.model";

export const generateKHQR = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      customer_id: bodyCustomerId,
      student_id,
      department_id
    } = req.body;

    const customer_id = bodyCustomerId ? Number(bodyCustomerId) : null;
    const studentId = Number(student_id);
    const departmentId = Number(department_id);

    const setting = await Setting.findOne();

    if (bodyCustomerId !== undefined && bodyCustomerId !== null && Number.isNaN(customer_id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer id"
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

    if (customer_id) {
      const customer = await Customer.findByPk(customer_id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not found"
        });
      }
    }

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const department = await Department.findByPk(departmentId);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found"
      });
    }

    // Expiration timestamp (30 minutes default)
    const expireMinutes = setting?.qr_expire_minutes || 30;
    const expirationTimestamp = Date.now() + expireMinutes * 60 * 1000;

    // Generate unique MD5 hash for payment verification
    const md5Hash = crypto
      .createHash("md5")
      .update(`payment_${studentId}_${departmentId}_${Date.now()}_${Math.random()}`)
      .digest("hex");

    const amount = Number(department.price_semester);
    const currency = setting?.currency || "USD";

    // Create payment record
    const payment = await Payment.create({
      customer_id,
      student_id: studentId,
      department_id: departmentId,
      amount,
      currency,
      payment_method: "khqr",
      status: "pending",
      qr_md5: md5Hash,
      qr_expiration: expirationTimestamp
    });

    // Generate QR payload string
    const qrPayload = JSON.stringify({
      payment_id: payment.payment_id,
      student_id: studentId,
      department_id: departmentId,
      amount,
      currency,
      md5: md5Hash,
      expires_at: expirationTimestamp
    });

    const qrImage = await QRCode.toDataURL(qrPayload);

    await payment.update({
      qr_code: qrPayload
    });

    return res.status(201).json({
      success: true,
      message: "Payment QR generated successfully",
      data: {
        payment_id: payment.payment_id,
        student_id: studentId,
        customer_id,
        department_id: departmentId,
        amount: payment.amount,
        currency,
        qr_code: qrPayload,
        qr_image: qrImage,
        qr_md5: md5Hash,
        expires_at: new Date(expirationTimestamp)
      }
    });
  } catch (error: any) {
    console.error("🔥 QR generation error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate QR code",
      error: error.message
    });
  }
};
