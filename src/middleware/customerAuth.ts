import {
  Request,
  Response,
  NextFunction
} from "express";
import { read } from "node:fs";

const jwt = require("jsonwebtoken");

interface AuthRequest extends Request {
  user?: any;
}

export const customerAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.token ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null);

    if (!token) {
      return res.status(401).json({
        message: "Authentication token required"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    req.user = decoded;
    if (!req.user.google_id) {
      return res.status(403).json({
        message: "Login with google required!"
      });
    }

    next();
  } catch {
    return res.status(401).json({
      message: "Unauthorized"
    });
  }
};