import mongoose from "mongoose";

const ExamlistSchema = new mongoose.Schema(
  {
    exam_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Examtype",
      required: true,
    },
    exam_name: {
      type: String,
      required: true,
    },
    exam_date: {
      type: Date,
      required: true,
    },
    exam_time: {
      type: String,
      required: true,
    },
    exam_duration: {
      type: String,
      required: true,
    },
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "classes",
      required: true,
    },
    section_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
      },
    ],
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "schools",
    },
    status: {
      type: Boolean,
      default: false,
    },
    topperDocument: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ExamlistM = mongoose.model("Examlist", ExamlistSchema);

export default ExamlistM;
