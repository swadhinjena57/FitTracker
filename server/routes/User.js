import express from "express";
import {
  UserLogin,
  UserRegister,
  addWorkout,
  changePassword,
  deleteWorkout,
  getUserDashboard,
  getCurrentUser,
  getWorkoutsByDate,
  getWorkoutPlans,
  createWorkoutPlan,
  updateWorkoutPlan,
  deleteWorkoutPlan,
  updateProfile,
  updateWorkout,
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
router.patch("/workout/:id", verifyToken, updateWorkout);
router.delete("/workout/:id", verifyToken, deleteWorkout);
router.get("/workout-plan", verifyToken, getWorkoutPlans);
router.post("/workout-plan", verifyToken, createWorkoutPlan);
router.patch("/workout-plan/:id", verifyToken, updateWorkoutPlan);
router.delete("/workout-plan/:id", verifyToken, deleteWorkoutPlan);

export default router;
