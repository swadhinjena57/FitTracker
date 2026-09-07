import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    age: { type: Number, min: 1, max: 120 },
    height: { type: Number, min: 0, max: 300 },
    weight: { type: Number, min: 0, max: 500 },
    goal: { type: String, trim: true, maxlength: 80 },
    targetWeight: { type: Number, min: 0, max: 500 },
    weeklyWorkoutGoal: { type: Number, min: 0, max: 50, default: 5 },
    dailyCalories: { type: Number, min: 0, max: 20000, default: 2500 },
  },
  { timestamps: true }
);

export default mongoose.model("Profile", ProfileSchema);
