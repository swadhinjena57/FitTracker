import express from "express";
import {
  UserLogin,
  UserRegister,
  addWorkout,
  changePassword,
  getUserDashboard,
  getCurrentUser,
  getWorkoutsByDate,
  updateProfile,
} from "../controllers/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", UserRegister);
router.post("/signin", UserLogin);
router.get("/me", verifyToken, getCurrentUser);
router.patch("/profile", verifyToken, updateProfile);
router.patch("/password", verifyToken, changePassword);

router.get("/dashboard", verifyToken, getUserDashboard);
router.get("/workout", verifyToken, getWorkoutsByDate);
router.post("/workout", verifyToken, addWorkout);

export default router;
