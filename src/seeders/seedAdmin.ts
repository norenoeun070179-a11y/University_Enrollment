import "dotenv/config";
import bcrypt from "bcrypt";
import User from "../models/user.model";
import { sequelize } from "../migrations/index";

async function seedAdmin() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    const username = process.env.ADMIN_USERNAME || "Oeun Noren";
    const email = process.env.ADMIN_EMAIL || "norenoeun@gmail.com";
    const plainPassword = process.env.ADMIN_PASSWORD || "07011979";
    const role = "admin";

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      await existingUser.update({
        username,
        password: hashedPassword,
        role,
        is_active: true
      });
      console.log(`✅ Admin user with email "${email}" has been updated successfully!`);
    } else {
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
        is_active: true
      });
      console.log(`✅ Admin user created successfully with ID: ${user.user_id}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
    process.exit(1);
  }
}

seedAdmin();
