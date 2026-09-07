import mongoose from "mongoose";

const UserSettingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    weeklyWorkoutGoal: { type: Number, min: 0, max: 50, default: 5 },
    dailyCalories: { type: Number, min: 0, max: 20000, default: 2500 },
  },
  { timestamps: true }
);

export default mongoose.model("UserSettings", UserSettingsSchema, "settings");
