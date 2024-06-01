import mongoose from "mongoose";
const assignmentSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subjects",
      required: true,
    },
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "classes",
      required: true,
    },
    section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    staff_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staffs",
      required: true,
    },
    chapter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseList",
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    date_created: {
      type: Date,
      default: Date.now,
    },
    last_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "nonactive"],
      default: "active",
    },
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "schools",
      required: true,
    },
    session_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "session",
      required: true,
    },
    isDeleted:{
      type:Boolean,
      default:false
    },
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
