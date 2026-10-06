import Payment from "../models/payment.model";
import { Request, Response } from "express";
import { Student } from "../models/relationship.model";
import Customer from "../models/customer.model";
import {Department} from "../models/relationship.model";
import Setting from "../models/setting.model";

export const getPayments = async (
  req: Request,
  res: Response
) => {
    try{
        const data = await Payment.findAll();
        res.json({data})
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Failed to get payments" });
    }
};
export const getPaymentByid = async (
  req: Request,
  res: Response
) => {
  try {
    const payment_id = Number(req.params.id);
    const data = await Payment.findByPk(payment_id);
    
    if (!data) {
      return res.status(404).json({
        message: "Payment not found!"
      });
    }

    return res.json({
      data
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get payments" });
  }
};

export const deletePayment = async (
  req: Request,
  res: Response
) => {
  try {
    const payment_id = Number(req.params.id);

    const payment = await Payment.findByPk(
      payment_id
    );

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found"
      });
    }

    await payment.destroy();

    return res.status(200).json({
      message:
        "Payment deleted successfully"
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Failed to delete payment"
    });
  }
};

export const createCashPayment = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      customer_id,
      student_id,
      department_id,
      description
    } = req.body;

    // Load system setting
    const setting = await Setting.findOne();

    if (!setting) {
      return res.status(404).json({
        message: "System setting not found."
      });
    }

    // Check cash payment
    if (!setting.allow_cash_payment) {
      return res.status(403).json({
        message: "Cash payment is currently disabled."
      });
    }

    // Check student
    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found."
      });
    }

    // Check department
    const department = await Department.findByPk(
      department_id
    );

    if (!department) {
      return res.status(404).json({
        message: "Department not found."
      });
    }

    // Customer is optional
    if (customer_id) {
      const customer = await Customer.findByPk(
        customer_id
      );

      if (!customer) {
        return res.status(404).json({
          message: "Customer not found."
        });
      }
    }

    // Student already paid for this department?
    const existingPayment =
      await Payment.findOne({
        where: {
          student_id,
          department_id
        }
      });

    if (existingPayment) {
      return res.status(409).json({
        message:
          "This student has already paid for this department."
      });
    }

    // Total payment count
    const totalPayments =
      await Payment.count({
        where: {
          student_id
        }
      });

    if (
      totalPayments >=
      setting.max_enrollment_per_student
    ) {
      return res.status(400).json({
        message: `A student can only enroll in ${setting.max_enrollment_per_student} department(s).`
      });
    }

    // Create payment
    const payment = await Payment.create({
      customer_id: customer_id || null,

      student_id,

      department_id,

      amount: Number(
        department.price_semester
      ),

      currency: setting.currency,

      payment_method: "cash",

      status: "paid",

      paid_at: new Date(),

      description:
        description ??
        "Cash payment at university cashier"
    });

    return res.status(201).json({
      success: true,
      message:
        "Cash payment created successfully.",
      data: payment
    });

  } catch (error: any) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};