import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../error.js";
import User from "../models/User.js";
import Profile from "../models/Profile.js";
import ProfileImage from "../models/ProfileImage.js";
import UserSettings from "../models/UserSettings.js";
import Workout from "../models/Workout.js";

const createToken = (userId) =>
  jwt.sign({ id: userId.toString() }, process.env.JWT, { expiresIn: "7d" });

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  img: user.img,
  age: user.age,
  height: user.height,
  weight: user.weight,
  goal: user.goal,
  targetWeight: user.targetWeight,
  weeklyWorkoutGoal: user.weeklyWorkoutGoal,
  dailyCalories: user.dailyCalories,
  theme: user.theme || "light",
});

const syncUserCollections = async (user) => {
  const profileData = {
    name: user.name,
    email: user.email,
    age: user.age,
    height: user.height,
    weight: user.weight,
    goal: user.goal,
    targetWeight: user.targetWeight,
    weeklyWorkoutGoal: user.weeklyWorkoutGoal ?? 5,
    dailyCalories: user.dailyCalories ?? 2500,
  };

  await Promise.all([
    Profile.findOneAndUpdate(
      { user: user._id },
      { $set: profileData, $setOnInsert: { user: user._id } },
      { upsert: true, returnDocument: "after", runValidators: true }
    ),
    UserSettings.findOneAndUpdate(
      { user: user._id },
      {
        $set: {
          theme: user.theme || "light",
          weeklyWorkoutGoal: user.weeklyWorkoutGoal ?? 5,
          dailyCalories: user.dailyCalories ?? 2500,
        },
        $setOnInsert: { user: user._id },
      },
      { upsert: true, returnDocument: "after", runValidators: true }
    ),
    user.img
      ? ProfileImage.findOneAndUpdate(
          { user: user._id },
          {
            $set: {
              imageData: user.img,
              contentType: user.img.match(/^data:(image\/[^;]+);/)?.[1] || "image/url",
            },
            $setOnInsert: { user: user._id },
          },
          { upsert: true, returnDocument: "after" }
        )
      : ProfileImage.deleteOne({ user: user._id }),
  ]);
};

export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return next(createError(400, "Name, email and password are required."));
    }

    if (password.length < 6) {
      return next(createError(400, "Password must be at least 6 characters."));
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail }).lean();

    if (existingUser) {
      return next(createError(409, "Email is already in use."));
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      img: img || null,
    });

    await syncUserCollections(user);

    return res.status(201).json({
      token: createToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(createError(409, "Email is already in use."));
    }
    return next(error);
  }
};

export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return next(createError(400, "Email and password are required."));
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user) {
      return next(createError(401, "Invalid email or password."));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return next(createError(401, "Invalid email or password."));
    }

    await syncUserCollections(user);

    return res.status(200).json({
      token: createToken(user._id),
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).lean();

    if (!user) {
      return next(createError(404, "User not found"));
    }

    await syncUserCollections(user);

    return res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = [
      "name",
      "img",
      "age",
      "height",
      "weight",
      "goal",
      "targetWeight",
      "weeklyWorkoutGoal",
      "dailyCalories",
      "theme",
    ];
    const updates = Object.fromEntries(
      allowedFields.filter((field) => req.body[field] !== undefined).map((field) => [field, req.body[field]])
    );

    if (updates.name !== undefined && !String(updates.name).trim()) {
      return next(createError(400, "Name is required."));
    }

    if (updates.img) {
      const isImageData = /^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=]+$/.test(
        updates.img
      );
      const isImageUrl = /^https?:\/\//i.test(updates.img);
      if ((!isImageData && !isImageUrl) || updates.img.length > 7 * 1024 * 1024) {
        return next(createError(400, "Please upload a valid image smaller than 5 MB."));
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { returnDocument: "after", runValidators: true }
    ).lean();

    if (!user) return next(createError(404, "User not found"));
    await syncUserCollections(user);
    return res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return next(createError(400, "Current and new passwords are required."));
    }
    if (newPassword.length < 6) {
      return next(createError(400, "New password must be at least 6 characters."));
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) return next(createError(404, "User not found"));

    const matches = await bcrypt.compare(currentPassword, user.password);
    if (!matches) return next(createError(401, "Current password is incorrect."));

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    return next(error);
  }
};

const startOfDay = (date) =>
  new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

const endOfDay = (date) =>
  new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1)
  );

export const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).lean();

    if (!user) {
      return next(createError(404, "User not found"));
    }

    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    const [
      todayStats,
      totalWorkouts,
      workoutsToday,
      categoryCalories,
      weeklyRows,
      workoutsThisWeek,
      workoutDays,
    ] =
      await Promise.all([
        Workout.aggregate([
          {
            $match: {
              user: user._id,
              date: { $gte: todayStart, $lt: todayEnd },
            },
          },
          {
            $group: {
              _id: null,
              totalCaloriesBurnt: { $sum: "$caloriesBurned" },
            },
          },
        ]),
        Workout.countDocuments({
          user: user._id,
        }),
        Workout.countDocuments({
          user: user._id,
          date: { $gte: todayStart, $lt: todayEnd },
        }),
        Workout.aggregate([
          {
            $match: {
              user: user._id,
              date: { $gte: todayStart, $lt: todayEnd },
            },
          },
          {
            $group: {
              _id: "$category",
              totalCaloriesBurnt: { $sum: "$caloriesBurned" },
            },
          },
        ]),
        Workout.aggregate([
          {
            $match: {
              user: user._id,
              date: {
                $gte: new Date(
                  todayStart.getTime() - 6 * 24 * 60 * 60 * 1000
                ),
                $lt: todayEnd,
              },
            },
          },
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$date" },
              },
              totalCaloriesBurnt: { $sum: "$caloriesBurned" },
            },
          },
          { $sort: { _id: 1 } },
        ]),
        Workout.countDocuments({
          user: user._id,
          date: {
            $gte: new Date(todayStart.getTime() - 6 * 24 * 60 * 60 * 1000),
            $lt: todayEnd,
          },
        }),
        Workout.aggregate([
          { $match: { user: user._id } },
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            },
          },
          { $sort: { _id: -1 } },
        ]),
      ]);

    const totalCaloriesBurnt = todayStats[0]?.totalCaloriesBurnt ?? 0;
    const avgCaloriesBurntPerWorkout =
      workoutsToday > 0 ? totalCaloriesBurnt / workoutsToday : 0;

    const weeklyMap = new Map(
      weeklyRows.map((row) => [row._id, row.totalCaloriesBurnt])
    );

    const weeks = [];
    const caloriesBurned = [];

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(todayStart);
      date.setUTCDate(date.getUTCDate() - i);

      const key = date.toISOString().slice(0, 10);
      weeks.push(
        date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          timeZone: "UTC",
        })
      );
      caloriesBurned.push(weeklyMap.get(key) ?? 0);
    }

    const pieChartData = categoryCalories.map((category, index) => ({
      id: index,
      value: category.totalCaloriesBurnt,
      label: category._id,
    }));

    const workoutDayKeys = workoutDays.map(({ _id }) => _id);
    const todayKey = todayStart.toISOString().slice(0, 10);
    const yesterday = new Date(todayStart);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const yesterdayKey = yesterday.toISOString().slice(0, 10);
    let streak = 0;
    let streakDate = workoutDayKeys.includes(todayKey)
      ? new Date(todayStart)
      : workoutDayKeys.includes(yesterdayKey)
        ? yesterday
        : null;

    while (streakDate && workoutDayKeys.includes(streakDate.toISOString().slice(0, 10))) {
      streak += 1;
      streakDate = new Date(streakDate);
      streakDate.setUTCDate(streakDate.getUTCDate() - 1);
    }

    return res.status(200).json({
      totalCaloriesBurnt,
      totalWorkouts,
      workoutsToday,
      workoutsThisWeek,
      avgCaloriesBurntPerWorkout,
      streak,
      totalWeeksCaloriesBurnt: { weeks, caloriesBurned },
      pieChartData,
    });
  } catch (error) {
    return next(error);
  }
};

export const getWorkoutsByDate = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.exists({ _id: userId });

    if (!user) {
      return next(createError(404, "User not found"));
    }

    const date = req.query.date ? new Date(req.query.date) : new Date();

    if (Number.isNaN(date.getTime())) {
      return next(createError(400, "Invalid date."));
    }

    const workouts = await Workout.find({
      user: userId,
      date: { $gte: startOfDay(date), $lt: endOfDay(date) },
    })
      .sort({ date: -1 })
      .lean();

    const totalCaloriesBurnt = workouts.reduce(
      (total, workout) => total + (workout.caloriesBurned ?? 0),
      0
    );

    return res.status(200).json({
      todaysWorkouts: workouts,
      totalCaloriesBurnt,
    });
  } catch (error) {
    return next(error);
  }
};

const parseWorkoutBlock = (block) => {
  const lines = block
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 5 || !lines[0].startsWith("#")) {
    return null;
  }

  const category = lines[0].slice(1).trim();
  const workoutName = lines[1].replace(/^-/, "").trim();

  // Supports both:
  // -5 setsX15 reps
  // -5 sets
  // -15 reps
  const setsRepsLine = lines[2]?.replace(/^-/, "").trim() ?? "";
  const setsMatch = setsRepsLine.match(/(\d+(?:\.\d+)?)\s*sets?/i);
  const repsMatch = setsRepsLine.match(/(\d+(?:\.\d+)?)\s*reps?/i);

  let sets = setsMatch ? Number(setsMatch[1]) : null;
  let reps = repsMatch ? Number(repsMatch[1]) : null;
  let weightLine;
  let durationLine;

  if (sets !== null && reps !== null) {
    weightLine = lines[3];
    durationLine = lines[4];
  } else {
    const repsLine = lines[3]?.replace(/^-/, "").trim() ?? "";
    const weightIndex = 4;
    const durationIndex = 5;

    setsMatch && (sets = Number(setsMatch[1]));
    const standaloneReps = repsLine.match(/(\d+(?:\.\d+)?)\s*reps?/i);
    reps = standaloneReps ? Number(standaloneReps[1]) : null;
    weightLine = lines[weightIndex];
    durationLine = lines[durationIndex];
  }

  const weightMatch = weightLine?.match(/(\d+(?:\.\d+)?)\s*kg/i);
  const durationMatch = durationLine?.match(/(\d+(?:\.\d+)?)\s*min/i);

  if (!category || !workoutName || sets === null || reps === null) {
    return null;
  }

  const weight = weightMatch ? Number(weightMatch[1]) : Number.NaN;
  const duration = durationMatch ? Number(durationMatch[1]) : Number.NaN;

  if (!Number.isFinite(weight) || !Number.isFinite(duration)) {
    return null;
  }

  return {
    category,
    workoutName,
    sets,
    reps,
    weight,
    duration,
    caloriesBurned: calculateCaloriesBurnt({ weight, duration }),
  };
};

const calculateCaloriesBurnt = ({ duration, weight }) =>
  duration * 5 * weight;

export const addWorkout = async (req, res, next) => {
  try {
    const { workoutString, date } = req.body;
    const userId = req.user.id;

    if (!workoutString?.trim()) {
      return next(createError(400, "Workout details are required."));
    }

    const workoutDate = date ? new Date(`${date}T00:00:00.000Z`) : new Date();

    if (
      Number.isNaN(workoutDate.getTime()) ||
      (date && !/^\d{4}-\d{2}-\d{2}$/.test(date))
    ) {
      return next(createError(400, "Please provide a valid workout date."));
    }

    const blocks = workoutString
      .trim()
      .split(/(?=^#)/m)
      .map((block) => block.trim())
      .filter(Boolean);

    const parsedWorkouts = blocks.map(parseWorkoutBlock);

    if (parsedWorkouts.some((workout) => !workout)) {
      return next(
        createError(
          400,
          "Invalid workout format. Use #Category, workout name, sets, reps, weight and duration."
        )
      );
    }

    const workoutsToCreate = parsedWorkouts.map((workout) => ({
      ...workout,
      user: userId,
      date: workoutDate,
    }));

    const createdWorkouts = await Workout.insertMany(workoutsToCreate);

    return res.status(201).json({
      message: "Workouts added successfully",
      workouts: createdWorkouts,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(
        createError(
          409,
          "A workout with the same name already exists. Please choose another name."
        )
      );
    }
    return next(error);
  }
};

export const updateWorkout = async (req, res, next) => {
  try {
    const allowedFields = ["category", "workoutName", "sets", "reps", "weight", "duration"];
    const updates = Object.fromEntries(
      allowedFields
        .filter((field) => req.body[field] !== undefined)
        .map((field) => [field, req.body[field]])
    );

    for (const field of ["sets", "reps", "weight", "duration"]) {
      if (updates[field] !== undefined) updates[field] = Number(updates[field]);
    }

    if (updates.category !== undefined) updates.category = String(updates.category).trim();
    if (updates.workoutName !== undefined) updates.workoutName = String(updates.workoutName).trim();

    if (!updates.category || !updates.workoutName) {
      return next(createError(400, "Category and workout name are required."));
    }

    if (["sets", "reps", "weight", "duration"].some((field) => !Number.isFinite(updates[field]) || updates[field] < 0)) {
      return next(createError(400, "Workout values must be valid positive numbers."));
    }

    updates.caloriesBurned = calculateCaloriesBurnt(updates);
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: updates },
      { returnDocument: "after", runValidators: true }
    ).lean();

    if (!workout) return next(createError(404, "Workout not found."));
    return res.status(200).json({ message: "Workout edited successfully", workout });
  } catch (error) {
    return next(error);
  }
};

export const deleteWorkout = async (req, res, next) => {
  try {
    const result = await Workout.deleteOne({ _id: req.params.id, user: req.user.id });
    if (!result.deletedCount) return next(createError(404, "Workout not found."));
    return res.status(200).json({ message: "Workout deleted successfully" });
  } catch (error) {
    return next(error);
  }
};
