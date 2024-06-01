import mongoose from "mongoose";

const CourseListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    topics: [
      {
        topic: String,
      },
    ],
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "schools",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const CourseList = mongoose.model("CourseList", CourseListSchema);
