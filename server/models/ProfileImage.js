import mongoose from "mongoose";

const ProfileImageSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    imageData: { type: String, required: true },
    contentType: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ProfileImage", ProfileImageSchema, "images");
