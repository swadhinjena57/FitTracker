import mongoose from "mongoose";

const ExerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sets: { type: Number, required: true, min: 1 },
    reps: { type: String, required: true, trim: true },
    weight: { type: String, default: "Bodyweight", trim: true },
    rest: { type: String, default: "60 sec", trim: true },
    duration: { type: String, default: "", trim: true },
    comments: { type: String, default: "", trim: true },
  },
  { _id: true }
);

const PlanDaySchema = new mongoose.Schema(
  {
    day: { type: Number, required: true, min: 1, max: 7 },
    name: { type: String, required: true, trim: true },
    focus: { type: String, default: "", trim: true },
    exercises: { type: [ExerciseSchema], default: [] },
  },
  { _id: true }
);

const WorkoutPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    goal: { type: String, default: "General fitness", trim: true, maxlength: 200 },
    days: { type: [PlanDaySchema], required: true, validate: (days) => days.length > 0 },
  },
  { timestamps: true }
);

WorkoutPlanSchema.index({ user: 1, updatedAt: -1 });

export default mongoose.model("WorkoutPlan", WorkoutPlanSchema);