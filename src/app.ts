import express from "express";
import "dotenv/config";
import "./auth/studentCleanup.auth";
import "./auth/paymentCleanup"
import path from "path";
// import cokie from "cookie-parser"
const cokie = require('cookie-parser')
import  migrate from "./migrations/index";
const cors = require("cors");
import passport from "./config/passport";

const app = express();
app.set("trust proxy", 1);
app.use(
  cors({   
    origin: true, // no wildcard
    credentials: true,
  })
);          
app.use(cokie()) 
app.use(express.json());  
app.use(passport.initialize());

import Department from './routes/department.route'
import User from './routes/user.route'
import Lecturer from "./routes/lecturer.route"; 
import { Student } from "./routes/student.route";
import { Enrollment } from "./routes/enrollment.route";
import { Class } from "./routes/class.route";    
import { Classroom } from "./routes/classroom.route";  
import { Course } from "./routes/course.route";
import { Schedule } from "./routes/schedule.route";
import customerAuthRoute from "./routes/customerAuth.route";
import { Customer } from "./routes/customer.route";
import generate_khqr_routes from "./routes/generatekhqr.routes";
import check_khqr_routes from "./routes/checkpayment.routes";
import { Payment } from "./routes/generatekhqr.routes";
import  Setting  from "./routes/setting.route";

// Serve static files from the 'public' folder (or wherever you put your HTML files)
app.use(express.static(path.join(__dirname, 'public')));

app.use("/auth", customerAuthRoute);
app.use('/api',generate_khqr_routes);
app.use('/api',check_khqr_routes);
// const app = express();
const port = Number(process.env.PORT) || 3000;

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
Department(app)
User(app) 
Lecturer(app)
Student(app)
Enrollment(app)
Class(app)  
Classroom(app)  
Course(app)
Schedule(app)  
Customer(app)
Payment(app)
Setting(app)

      
    app.listen(port,async () => {
  try {    
    console.log(`Server running on port ${port}`); 
    await migrate();          
    console.log("Database connected");
  } catch (error) {
    console.error(error);
  }
});
  
