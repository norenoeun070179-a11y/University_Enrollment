import Department from "./department.model";
import Student from "./student.model";
import Lecturer from "./lecturer.model";
import Course from "./course.model";
import Classroom from "./classroom.model";
import Class from "./class.model";
import Enrollment from "./enrollment.model";
import User from "./user.model";
import Customer from "./customer.model";
import Payment from "./payment.model";
import Schedule from "./schedule.model";

Class.belongsTo(Department, {
  foreignKey: "department_id"
});

Department.hasMany(Class, {
  foreignKey: "department_id"
});

Department.hasMany(Course, {
  foreignKey: "department_id"
});

Course.belongsTo(Department, {
  foreignKey: "department_id"
});

Student.hasMany(Enrollment, {
  foreignKey: "student_id"
});

Enrollment.belongsTo(Student, {
  foreignKey: "student_id"
});

Class.hasMany(Enrollment, {
  foreignKey: "class_id"
});

Enrollment.belongsTo(Class, {
  foreignKey: "class_id"
});

// Department 1 -> Many Enrollment
Department.hasMany(Enrollment, {
  foreignKey: "department_id"
});

Enrollment.belongsTo(Department, {
  foreignKey: "department_id"
});

// Payment 1 -> 1 Enrollment
Payment.hasOne(Enrollment, {
  foreignKey: "payment_id"
});

Enrollment.hasOne(Payment, {
  foreignKey: "payment_id"
});

Student.hasMany(Enrollment, {
  foreignKey: "student_id"
});

Enrollment.belongsTo(Student, {
  foreignKey: "student_id"
});

Class.hasMany(Enrollment, {
  foreignKey: "class_id"
});

Enrollment.belongsTo(Class, {
  foreignKey: "class_id"
});

Course.hasMany(Lecturer, {
  foreignKey: "course_id",
});

Lecturer.belongsTo(Course, {
  foreignKey: "course_id",
});

Customer.hasMany(Payment, {
  foreignKey: "customer_id"
});

Payment.belongsTo(Customer, {
  foreignKey: "customer_id"
});

Student.hasMany(Payment, {
  foreignKey: "student_id",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE"
});

Payment.belongsTo(Student, {
  foreignKey: "student_id",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE"
});

Class.hasMany(Schedule ,{
  foreignKey: "class_id"
});
Schedule.belongsTo(Class,{
  foreignKey: "class_id"
})
Classroom.hasMany(Schedule ,{
  foreignKey: "classroom_id"
});
Schedule.belongsTo(Classroom,{
  foreignKey: "classroom_id"
})
Course.hasMany(Schedule ,{
  foreignKey: "course_id"
});
Schedule.belongsTo(Course,{
  foreignKey: "course_id"
})
Lecturer.hasMany(Schedule ,{
  foreignKey: "lecturer_id"
});
Schedule.belongsTo(Lecturer,{
  foreignKey: "lecturer_id"
})

export {
  Department,
  Student,
  Lecturer,
  Course,
  Classroom,
  Class,
  Enrollment,
  User
};
