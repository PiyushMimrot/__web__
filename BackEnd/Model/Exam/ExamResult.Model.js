import mongoose from "mongoose";

const ExamResultsSchema = new mongoose.Schema(
  {
    exam_subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExamSubject",
    },
    exam_subject_name_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subjects",
    },
    marksObtain: {
      type: String,
      default: 0,
    },
    exam_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Examlist",
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
    },
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "schools",
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sections",
    },
    admin: String,
    status: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ExamResultM = mongoose.model("ExamResult", ExamResultsSchema);

export default ExamResultM;
