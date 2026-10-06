import rateLimit from "express-rate-limit";

// Allows 60 payment generation requests per 15 minutes
export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: {
    success: false,
    message: "Too many payment requests. Please try again shortly."
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Allows 120 status checks per minute for frontend polling
export const checkPaymentLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: {
    success: false,
    message: "Too many check requests."
  },
  standardHeaders: true,
  legacyHeaders: false
});
