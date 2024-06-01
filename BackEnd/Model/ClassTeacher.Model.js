import mongoose from "mongoose";

const ClassTeacherSchema = new mongoose.Schema(
  {
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "classes",
    },
    section_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Section",
    },

    session_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Session",
    },

    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "staffs",
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Subjects",
    },
    IsClassTeacher: {
      type: Boolean,
      default: false,
    },
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

const ClassTeacherModel = mongoose.model("classteachers", ClassTeacherSchema);

export default ClassTeacherModel;
