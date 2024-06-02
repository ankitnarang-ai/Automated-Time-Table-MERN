import { Router } from "express";
import { signup, login } from "../controller/authController";
import { addTeachers,addClassrooms,addCourses,generateTimetable } from "../controller/addDetails";

const router = Router();

router.route("/signup").post(signup)
router.route("/login").post(login)
router.route("/teachers").post(addTeachers)
router.route("/courses").post(addCourses)
router.route("/classrooms").post(addClassrooms)
router.route("/generate-timetable").post(generateTimetable)


export default router