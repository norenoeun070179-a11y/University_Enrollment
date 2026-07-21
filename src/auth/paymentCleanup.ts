import cron from "node-cron";
import { Op } from "sequelize";

import Payment from "../models/payment.model";

// Run every minute
cron.schedule("* * * * *", async () => {
  try {
    console.log("🧹 Checking expired KHQR payments...");

    const [updated] = await Payment.update(
      {
        status: "expired"
      },
      {
        where: {
          status: "pending",
          qr_expiration: {
            [Op.lt]: Date.now()
          }
        }
      }
    );

    if (updated > 0) {
      console.log(
        `✅ ${updated} payment(s) marked as expired.`
      );
    }

  } catch (error) {
    console.error(
      "❌ Payment Cleanup Error:",
      error
    );
  }
});

console.log("🚀 Payment Cleanup Cron Started");