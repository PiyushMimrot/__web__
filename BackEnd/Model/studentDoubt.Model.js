import { mongoose } from "mongoose";

const studentDoubtSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staffs",
    },
    doubt: {
      type: String,
      required: true,
    },
    attachDocument: {
      type: String,
    },
    teacherDocument: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    feedback: {
      type: Number,
      default: null,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "classes",
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "schools",
    },
    session_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create a model for the StudentDoubt collection
export const StudentDoubt = mongoose.model("StudentDoubt", studentDoubtSchema);
