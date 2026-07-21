import cron from "node-cron";
import { Op } from "sequelize";

import Student from "../models/student.model";
import Enrollment from "../models/enrollment.model";
import Payment from "../models/payment.model";

cron.schedule("* * * * *", async () => {
  try {
    console.log("Checking students...");

    // Student created more than 15 minutes ago
    const fifteenMinutesAgo = new Date(
      Date.now() - 15 * 60 * 1000
    );

    const students = await Student.findAll({
      where: {
        enrollment_date: {
          [Op.lt]: fifteenMinutesAgo
        }
      }
    });

    for (const student of students) {
      const enrolled = await Enrollment.findOne({
        where: {
          student_id: student.student_id
        }
      });

      const payment = await Payment.findOne({
        where: {
          student_id: student.student_id
        }
      });

      // Keep students with payment records. In particular, a completed payment
      // must remain linked to its student until the enrollment is created.
      if (!enrolled && !payment) {
        await student.destroy();

        console.log(
          `Deleted Student ${student.student_code}`
        );
      }
    }
  } catch (err) {
    console.error("Student Cleanup Error:", err);
  }
});
