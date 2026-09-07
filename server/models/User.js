import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    img: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    age: {
      type: Number,
      min: 1,
      max: 120,
    },
    height: { type: Number, min: 0, max: 300 },
    weight: { type: Number, min: 0, max: 500 },
    goal: { type: String, trim: true, maxlength: 80 },
    targetWeight: { type: Number, min: 0, max: 500 },
    weeklyWorkoutGoal: { type: Number, min: 0, max: 50, default: 5 },
    dailyCalories: { type: Number, min: 0, max: 20000, default: 2500 },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
