import { Request, Response } from "express";
import Customer from "../models/customer.model";

export const getCustomers = async (
  req: Request,
  res: Response
) => {
  try {
    const data = await Customer.findAll();

    return res.status(200).json({
      data
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};
interface AuthRequest extends Request {
  user?: any;
}

export const getCustomerById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const customer_id = Number(req.params.id);

    const data = await Customer.findByPk(customer_id);

    if (!data) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }
    if (req.user?.customer_id !== customer_id) {
      return res.status(403).json({
        message: "Customer not found"
      });
    }
    return res.status(200).json({
      data
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};
export const getCustomerById_admin = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const customer_id = Number(req.params.id);

    const data = await Customer.findByPk(customer_id);

    if (!data) {
      return res.status(404).json({
        message: "Customer not found"
      });
    }
    if (data.customer_id !== customer_id) {
      return res.status(403).json({
        message: "Customer not found"
      });
    }
    return res.status(200).json({
      data
    });
  } catch (error: any) {
    return res.status(500).json({
      message: error.message
    });
  }
};

// export const getProfile = async (
//   req: any,
//   res: Response
// ) => {
//   try {
//     const customer = await Customer.findByPk(
//       req.user.customer_id
//     );

//     return res.json(customer);
//   } catch (error: any) {
//     return res.status(500).json({
//       message: error.message
//     });
//   }
// };

