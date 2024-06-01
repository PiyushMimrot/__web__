import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    goesTo: { type: String, enum: ["student", "teacher"] },
    achievementType: { type: String },
    eventName: { type: String },
    description: { type: String },
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "schools",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
export const AchievementModel = mongoose.model("Achievement", schema);
