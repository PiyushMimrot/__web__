import mongoose from "mongoose";

const uni_subjects_schema = new mongoose.Schema(
  {
    class_id: {
      type: String,
      required: true,
    },
    subject_name: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("uni_subjects", uni_subjects_schema);
