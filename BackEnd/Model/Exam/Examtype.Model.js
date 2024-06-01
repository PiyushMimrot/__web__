import mongoose from "mongoose";

const ExamtypeSchema = new mongoose.Schema(
  {
    exam_name: String,
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

const ExamtypeM = mongoose.model("Examtype", ExamtypeSchema);

export default ExamtypeM;
