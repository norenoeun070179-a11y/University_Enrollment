import express from "express";
import passport from "../config/passport";
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false
  }),
  (req: any, res) => {
    const customer = req.user;

    const token = jwt.sign(
      {
        customer_id: customer.customer_id,
        email: customer.email,
        google_id: customer.google_id
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d"
      }
    );

    res.cookie("token" , token,{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.redirect(`process.env.FRONTEND_URL}/`)
  }
);

export default router;