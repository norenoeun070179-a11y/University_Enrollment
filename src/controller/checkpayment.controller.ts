import { Request, Response } from "express";
import axios from "axios";

import Payment from "../models/payment.model";

export const checkPayment = async (
  req: Request,
  res: Response
) => {
  try {
    const  payment_id  = Number(req.params.id);
    const { qr_md5 } = req.body;

    const payment = await Payment.findByPk(
      payment_id
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    if (
      payment.status === "paid" 
    ) {
      return res.status(200).json({
        success: true,
        message:
          "Payment already confirmed",
        data: payment
      });
    }


    if (
      payment.qr_expiration &&
      Date.now() >
        Number(payment.qr_expiration)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "QR code has expired"
      });
    }

    if (payment.qr_md5 !== qr_md5) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid QR code"
      });
    }

    if (
        payment.status === "pending" &&
        payment.qr_expiration &&
        Date.now() > Number(payment.qr_expiration)
      ) {
        await payment.destroy();

        return res.status(400).json({
          success: false,
          message:
            "QR expired. Payment deleted automatically."
        });
      }

    const bakongBaseUrl =
      process.env.BAKONG_PROD_BASE_API_URL;

    const bakongAccessToken =
      process.env.BAKONG_ACCESS_TOKEN;

    if (!bakongBaseUrl || !bakongAccessToken) {
      return res.status(500).json({
        success: false,
        message:
          "Bakong configuration missing"
      });
    }

    const response =
  await axios.post(
    `${bakongBaseUrl}/check_transaction_by_md5`,
    {
      md5: payment.qr_md5
    },
    {
      headers: {
        Authorization: `Bearer ${bakongAccessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    }
  );

console.log(response.data);
      
    const data = response.data;

    if (
      data.responseCode === 0 &&
      data.data?.hash
    ) {
      await payment.update({
        bakong_hash:
          data.data.hash,

        transaction_id:
          data.data.hash,

        amount:
          data.data.amount,

        currency:
          data.data.currency,

        description:
          data.data.description,

        paid_at: new Date(),

        status: "paid"
      });


      
      return res.status(200).json({
        success: true,
        message:
          "Payment confirmed",
        data: {
          payment_id:
            payment.payment_id,

          student_id:
            payment.student_id,

          customer_id:
            payment.customer_id,

          amount:
            payment.amount,

          transaction_id:
            payment.transaction_id,

          paid_at:
            payment.paid_at
        }
      });
    }

    return res.status(404).json({
      success: false,
      message:
        "Please Pay",
      bakong_response: data
    });
  } catch (error: any) {
    console.log(
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message:
        error.response?.data?.responseMessage ||
        error.response?.data?.message ||
        error.message,
      bakong_status:
        error.response?.status,
      bakong_response:
        error.response?.data
    });
  }
};
