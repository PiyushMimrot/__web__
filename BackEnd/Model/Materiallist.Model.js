import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    short_desc: String,
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subjects",
    },
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseList",
    },
    doc_path: String,
    staff_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staffs",
    },
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classes",
    },
    date: String,
    status: String,
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

// Create the Material model
export const Material = mongoose.model("Material", materialSchema);
