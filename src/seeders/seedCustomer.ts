import "dotenv/config";
import Customer from "../models/customer.model";
import Student from "../models/student.model";
import { sequelize } from "../migrations/index";

async function seedCustomer() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    // 1. Create or update Default General Customer for direct student enrollments
    const defaultCustomerData = {
      first_name: "Student",
      last_name: "Enrollment",
      email: "student.enrollment@university.edu",
      google_id: "default_student_enrollment_id",
      is_active: true
    };

    let defaultCustomer = await Customer.findOne({
      where: { email: defaultCustomerData.email }
    });

    if (!defaultCustomer) {
      defaultCustomer = await Customer.create(defaultCustomerData);
      console.log(`✅ Default enrollment customer created with ID: ${defaultCustomer.customer_id}`);
    } else {
      console.log(`ℹ️ Default enrollment customer already exists with ID: ${defaultCustomer.customer_id}`);
    }

    // 2. Also create customer for Oeun Noren if not exists
    const adminCustomerData = {
      first_name: "Oeun",
      last_name: "Noren",
      email: "norenoeun@gmail.com",
      google_id: "google_oeun_noren_07011979",
      is_active: true
    };

    let adminCustomer = await Customer.findOne({
      where: { email: adminCustomerData.email }
    });

    if (!adminCustomer) {
      adminCustomer = await Customer.create(adminCustomerData);
      console.log(`✅ Customer for Oeun Noren created with ID: ${adminCustomer.customer_id}`);
    } else {
      console.log(`ℹ️ Customer for Oeun Noren already exists with ID: ${adminCustomer.customer_id}`);
    }

    // 3. Link any students without customer_id to the default customer (optional fallback)
    const [updatedCount] = await Student.update(
      { customer_id: defaultCustomer.customer_id },
      { where: { customer_id: null } }
    );

    if (updatedCount > 0) {
      console.log(`✅ Linked ${updatedCount} existing student(s) to default customer ID ${defaultCustomer.customer_id}`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding customer:", error);
    process.exit(1);
  }
}

seedCustomer();
