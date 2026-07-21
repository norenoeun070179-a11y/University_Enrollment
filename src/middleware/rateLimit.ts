import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 3,

  message: {
    success: false,
    message: "Too many requests. Please try again in 15 minutes."
  },

  standardHeaders: true,

  legacyHeaders: false,
}); 