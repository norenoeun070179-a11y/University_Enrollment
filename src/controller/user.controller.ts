import { Op } from "sequelize";
import {  Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
const jwt = require("jsonwebtoken");

interface AuthRequest extends Request {
  user?: any;
}

const DEFAULT_USER_ROLE = "staff";
const ALLOWED_CREATE_USER_ROLES = ["staff", "user"] as const;
const MIN_PASSWORD_LENGTH = 8;

const isCreateUserRole = (role: unknown): role is typeof ALLOWED_CREATE_USER_ROLES[number] => {
  return typeof role === "string" && ALLOWED_CREATE_USER_ROLES.includes(role as typeof ALLOWED_CREATE_USER_ROLES[number]);
};

const isBoolean = (value: unknown): value is boolean => typeof value === "boolean";

export const getUsers = async (req: Request, res: Response) => {
    try {

        const data = await User.findAll({
            attributes: {
                exclude: ["password"]
            },
            where: {
                role: {
                    [Op.ne]: "admin"
                }
            }
        });

        res.json({ data });

    } catch (err) {

        console.log("Error:", err);

        res.status(500).json({
            message: "Failed to get users"
        });

    }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role, is_active } = req.body;
    const cleanUsername = typeof username === "string" ? username.trim() : "";
    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!cleanUsername || !cleanEmail || typeof password !== "string" || !password) {
      return res.status(400).json({ message: "Username, email and password are required" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({ message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` });
    }

    if (role === "admin") {
      return res.status(403).json({ message: "Admin role cannot be created from this endpoint" });
    }

    if (role !== undefined && !isCreateUserRole(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (is_active !== undefined && !isBoolean(is_active)) {
      return res.status(400).json({ message: "is_active must be boolean" });
    }

    const existingUser = await User.findOne({
      where: { email: cleanEmail }
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const safeRole = role ?? DEFAULT_USER_ROLE;

    const user = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      role: safeRole,
      is_active: is_active ?? true
    });
  
    return res.status(201).json({
      message: "User created",
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        is_active: user.is_active
      }
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({ message: "Can't create user" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. check user exists
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2. check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });
    return res.json({
      message: "Login success",
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check user exists
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    // Check admin role
    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin only."
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user.user_id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d"
      }  
    );
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.status(200).json({
      message: "Admin login successful",
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Server error"
    });
  }
};

export const updateUser = async (req:Request , res:Response) => {
  try{
    const { username, email, password, role, is_active } = req.body;
    const user_id  = Number(req.params.id);
    const cleanUsername = typeof username === "string" ? username.trim() : "";
    const cleanEmail = typeof email === "string" ? email.trim().toLocaleLowerCase() : "";
 
    const user = await User.findByPk(user_id)
    if(!user){
      return res.status(404).json({message:"User not found !"});
    }

    if(!cleanUsername || !cleanEmail || typeof password !== "string" || !password){
      res.status(400).json({message:"Username , email and passwoed are required"})
    };

    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({message:"Invalid email format"})
    };

    if(password.length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({message:`password must be at least ${MIN_PASSWORD_LENGTH}`})
    }
    
    if(role === "admin"){
      return res.status(400).json({message:"Invalid role"});
    }

    if (is_active !== undefined && !isBoolean(is_active)) {
      return res.status(400).json({ message: "is_active must be boolean" });
    }

    const existingUser = await User.findOne({
      where:{email: cleanEmail}
    });

    if(!user.email){
      return res.status(404).json({message:"Email already exists!"})
    }
    let hashedPassword = user.password;
    if(password){
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const safeRole = role ?? DEFAULT_USER_ROLE;
    
     await user.update({
      username : cleanUsername ?? user.username,
      email : cleanEmail ?? user.email,
      password : hashedPassword ?? user.password,
      role : safeRole ?? user.role,
      is_active : is_active ?? true ,
    })

      return res.status(201).json({
      message: "User created",
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        is_active: user.is_active
      }
    });
    
  }catch(err){
    console.log("Error:", err);
    res.status(500).json({message:"Can't update user !"})
  }
}

export const deleteUser = async (req:Request , res:Response) => {
  try{
    const user_id = Number(req.params.id)
    
    const user = await User.findByPk(user_id);
    if(!user){
      return res.status(404).json({message: "User not found !"})
    };

    if(user.role == "admin"){
      return res.status(403).json({message: "Cat't delete this role !"})
    }

    await user.destroy();
    return res.json({message : "User deleted "})
  }catch(err){
    console.log("Error:", err);
    res.status(500).json({message: "Can't delete user !"})
  }
}

export const getProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user_id = Number(req.user.id);

    // Only admin can view other users
    if (
      req.user?.role !== "admin" &&
      req.user?.id !== user_id
    ) {
      return res.status(403).json({
        message: "You can only view your own profile",
      });
    }

    const data = await User.findByPk(user_id, {
      attributes: {
        exclude: ["password"],
      },
    });

    if (!data) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.log("Error:", err);

    return res.status(500).json({
      message: "Can't get profile user!",
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};