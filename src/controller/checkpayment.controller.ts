import { Request, Response } from "express";
import Payment from "../models/payment.model";

export const checkPayment = async (
  req: Request,
  res: Response
) => {
  try {
    const payment_id = Number(req.params.id);
    const { qr_md5 } = req.body;

    const payment = await Payment.findByPk(payment_id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    // If already paid
    if (payment.status === "paid") {
      return res.status(200).json({
        success: true,
        message: "Payment already confirmed",
        data: payment
      });
    }

    // Optional MD5 check if provided
    if (qr_md5 && payment.qr_md5 && payment.qr_md5 !== qr_md5) {
      return res.status(400).json({
        success: false,
        message: "Invalid QR code"
      });
    }

    // Confirm payment directly (No external Bakong API required)
    const transactionId = "TXN_" + Date.now();
    await payment.update({
      transaction_id: transactionId,
      bakong_hash: transactionId,
      paid_at: new Date(),
      status: "paid"
    });

    return res.status(200).json({
      success: true,
      message: "Payment confirmed successfully",
      data: {
        payment_id: payment.payment_id,
        student_id: payment.student_id,
        customer_id: payment.customer_id,
        amount: payment.amount,
        currency: payment.currency,
        transaction_id: transactionId,
        paid_at: payment.paid_at,
        status: "paid"
      }
    });
  } catch (error: any) {
    console.error("Check payment error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to check payment"
    });
  }
};
