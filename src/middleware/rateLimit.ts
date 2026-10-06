import rateLimit from "express-rate-limit";

// Allows 100 requests per 15 minutes per IP
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});