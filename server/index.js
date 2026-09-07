import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import UserRoutes from "./routes/User.js";
import Profile from "./models/Profile.js";
import ProfileImage from "./models/ProfileImage.js";
import UserSettings from "./models/UserSettings.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 8080;

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim())
  : true;

app.disable("x-powered-by");
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: "8mb" }));
app.use(express.urlencoded({ extended: true, limit: "8mb" }));

app.get("/", (_req, res) => {
  res.status(200).json({ message: "FitTrack API is running" });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

app.use("/api/user", UserRoutes);

// Central error handler. Express 5 also forwards rejected async handlers.
app.use((err, _req, res, _next) => {
  console.error(err);

  const status = err.status ?? 500;
  const message = err.message ?? "Something went wrong";

  res.status(status).json({
    success: false,
    status,
    message,
  });
});

const startServer = async () => {
  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL is not configured");
  }

  if (!process.env.JWT) {
    throw new Error("JWT is not configured");
  }

  await mongoose.connect(process.env.MONGODB_URL);
  await Promise.all(
    [Profile, ProfileImage, UserSettings].map((model) =>
      model.createCollection().catch((error) => {
        if (error.codeName !== "NamespaceExists") throw error;
      })
    )
  );
  console.log("Connected to MongoDB");

  app.listen(PORT, () => {
    console.log(`FitTrack API listening on http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

export default app;
