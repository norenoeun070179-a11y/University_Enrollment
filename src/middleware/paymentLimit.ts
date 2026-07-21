import rateLimit from "express-rate-limit";

export const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max: 5,

  message: {
    message:
      "Too many payment requests."
  }
});

export const checkPaymentLimiter = rateLimit({
  windowMs: 60 * 1000,

  max: 3
});

