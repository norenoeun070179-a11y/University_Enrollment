  import { Request, Response } from "express";
  import { sequelize } from "../migrations";
  import Enrollment from "../models/enrollment.model";
  import Student from "../models/student.model";
  import Class from "../models/class.model";
  import Department from "../models/department.model";
  import Payment from "../models/payment.model";
  import Setting from "../models/setting.model";

export const createEnrollment = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      student_id,
      class_id,
      department_id,
      payment_id,
      enrollment_date,
      status
    } = req.body;

    // =========================
    // Student
    // =========================
    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found."
      });
    }

    // =========================
    // Class
    // =========================
    const classRecord = await Class.findByPk(class_id);

    if (!classRecord) {
      return res.status(404).json({
        message: "Class not found."
      });
    }

    // =========================
    // Department
    // =========================
    const department = await Department.findByPk(
      department_id
    );

    if (!department) {
      return res.status(404).json({
        message: "Department not found."
      });
    }

    // =========================
    // Payment
    // =========================
    const payment = await Payment.findByPk(
      payment_id
    );

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found."
      });
    }

    if (payment.status !== "paid") {
      return res.status(400).json({
        message:
          "Payment must be completed first."
      });
    }

    // =========================
    // Setting
    // =========================
    const setting = await Setting.findOne();

    if (!setting) {
      return res.status(404).json({
        message: "System setting not found."
      });
    }

    // =========================
    // Payment already used?
    // =========================
    const usedPayment =
      await Enrollment.findOne({
        where: {
          payment_id
        }
      });

    if (usedPayment) {
      return res.status(400).json({
        message:
          "This payment has already been used."
      });
    }

    // =========================
    // Already enrolled in this department?
    // =========================
    const existingDepartmentEnrollment =
      await Enrollment.findOne({
        where: {
          student_id,
          department_id
        }
      });

    if (
      existingDepartmentEnrollment
    ) {
      return res.status(400).json({
        message:
          "Student is already enrolled in this department."
      });
    }

    // =========================
    // Maximum enrollments
    // =========================
    const totalEnrollments =
      await Enrollment.count({
        where: {
          student_id
        }
      });

    if (
      totalEnrollments >=
      setting.max_enrollment_per_student
    ) {
      return res.status(400).json({
        message: `A student can enroll in only ${setting.max_enrollment_per_student} department(s).`
      });
    }

    // =========================
    // Class capacity
    // =========================
    const classCount =
      await Enrollment.count({
        where: {
          class_id
        }
      });

    if (
      classCount >=
      setting.max_student_per_class
    ) {
      return res.status(400).json({
        message: "This class is full."
      });
    }

    // =========================
    // Department capacity
    // =========================
    const departmentCount =
      await Enrollment.count({
        where: {
          department_id
        }
      });

    if (
      departmentCount >=
      setting.max_student_per_department
    ) {
      return res.status(400).json({
        message:
          "This department has reached its maximum capacity."
      });
    }

    // =========================
    // Create Enrollment
    // =========================
    const enrollment =
      await Enrollment.create({
        student_id,
        class_id,
        department_id,
        payment_id,
        year: setting.academic_year,
        enrollment_date,
        status
      });

    return res.status(201).json({
      message:
        "Enrollment created successfully.",
      data: enrollment
    });

  } catch (error: any) {

    console.error(error);

    return res.status(500).json({
      message: error.message
    });

  }
};

  export const getEnrollments = async (
    req: Request,
    res: Response
  ) => {
    try {
      const data = await Enrollment.findAll();

      return res.status(200).json({
        data
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message
      });
    }
  };

  export const getEnrollmentById = async (
    req: Request,
    res: Response
  ) => {
    try {
      const enrollment_id = Number(
        req.params.id
      );

      const data =
        await Enrollment.findByPk(
          enrollment_id,
          {
            include: [
              Student,
              Class,
              Department,
              Payment
            ]
          }
        );

      if (!data) {
        return res.status(404).json({
          message: "Enrollment not found"
        });
      }

      return res.status(200).json({
        data
      });
    } catch (error: any) {
      return res.status(500).json({
        message: error.message
      });
    }
  };

export const updateEnrollment = async (
  req: Request,
  res: Response
) => {
  try {
    const enrollment_id = Number(req.params.id);

    const {
      student_id,
      class_id,
      department_id,
      payment_id,
      enrollment_date,
      status
    } = req.body;

    // =========================
    // Enrollment
    // =========================
    const enrollment = await Enrollment.findByPk(
      enrollment_id
    );

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found."
      });
    }

    // =========================
    // Student
    // =========================
    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(404).json({
        message: "Student not found."
      });
    }

    // =========================
    // Class
    // =========================
    const classRecord = await Class.findByPk(
      class_id
    );

    if (!classRecord) {
      return res.status(404).json({
        message: "Class not found."
      });
    }

    // =========================
    // Department
    // =========================
    const department =
      await Department.findByPk(
        department_id
      );

    if (!department) {
      return res.status(404).json({
        message: "Department not found."
      });
    }

    // =========================
    // Payment
    // =========================
    const payment = await Payment.findByPk(
      payment_id
    );

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found."
      });
    }

    if (payment.status !== "paid") {
      return res.status(400).json({
        message:
          "Payment must be completed first."
      });
    }

    // =========================
    // Setting
    // =========================
    const setting = await Setting.findOne();

    if (!setting) {
      return res.status(404).json({
        message: "System setting not found."
      });
    }

    // =========================
    // Payment already used?
    // =========================
    const usedPayment =
      await Enrollment.findOne({
        where: {
          payment_id
        }
      });

    if (
      usedPayment &&
      usedPayment.enrollment_id !==
        enrollment_id
    ) {
      return res.status(400).json({
        message:
          "This payment has already been used."
      });
    }

    // =========================
    // Already enrolled in this department?
    // =========================
    const existingDepartmentEnrollment =
      await Enrollment.findOne({
        where: {
          student_id,
          department_id
        }
      });

    if (
      existingDepartmentEnrollment &&
      existingDepartmentEnrollment.enrollment_id !==
        enrollment_id
    ) {
      return res.status(400).json({
        message:
          "Student is already enrolled in this department."
      });
    }

    // =========================
    // Max enrollment per student
    // =========================
    const totalEnrollments =
      await Enrollment.count({
        where: {
          student_id
        }
      });

    if (
      totalEnrollments >
      setting.max_enrollment_per_student
    ) {
      return res.status(400).json({
        message: `A student can enroll in only ${setting.max_enrollment_per_student} department(s).`
      });
    }

    // =========================
    // Class capacity
    // =========================
    const classCount =
      await Enrollment.count({
        where: {
          class_id
        }
      });

    if (
      classCount >
      setting.max_student_per_class
    ) {
      return res.status(400).json({
        message: "This class is full."
      });
    }

    // =========================
    // Department capacity
    // =========================
    const departmentCount =
      await Enrollment.count({
        where: {
          department_id
        }
      });

    if (
      departmentCount >
      setting.max_student_per_department
    ) {
      return res.status(400).json({
        message:
          "This department has reached its maximum capacity."
      });
    }

    // =========================
    // Update
    // =========================
    await enrollment.update({
      student_id,
      class_id,
      department_id,
      payment_id,
      year: setting.academic_year,
      enrollment_date,
      status
    });

    return res.status(200).json({
      message:
        "Enrollment updated successfully.",
      data: enrollment
    });

  } catch (error: any) {
    console.error(error);

    return res.status(500).json({
      message: error.message
    });
  }
};
  export const deleteEnrollment = async (
  req: Request,
  res: Response
) => {
  const transaction = await sequelize.transaction();

  try {
    const enrollment_id = Number(req.params.id);

    const enrollment = await Enrollment.findByPk(
      enrollment_id,
      { transaction }
    );

    if (!enrollment) {
      await transaction.rollback();

      return res.status(404).json({
        message: "Enrollment not found"
      });
    }

    // Delete payment if it exists
    if (enrollment.payment_id) {
      await Payment.destroy({
        where: {
          payment_id: enrollment.payment_id
        },
        transaction
      });
    }

    // Delete enrollment
    await enrollment.destroy({
      transaction
    });

    await transaction.commit();

    return res.status(200).json({
      message: "Enrollment and payment deleted successfully"
    });

  } catch (error: any) {
    await transaction.rollback();

    return res.status(500).json({
      message: error.message
    });
  }
};

