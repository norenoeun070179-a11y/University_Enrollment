import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");



interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  
   try {

  const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const allowAdminOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const role = req.user?.role;

  if (!role) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  if (role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};

export const allowNormal = (req: AuthRequest, res: Response, next: NextFunction) => {
  const role = req.user?.role;

  if (!role) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};