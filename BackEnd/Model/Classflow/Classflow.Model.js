import mongoose from "mongoose";

const ClassFLowSchema = new mongoose.Schema(
  {
    classSubjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassTeacher",
      required: true,
    },
    chapter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseList",
      required: true,
    },
    topics: [
      {
        topic: String,
        progress: Number,
        date: {
          type: "String",
          default: null,
        },
      },
    ],
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ClassflowM = mongoose.model("ClassFlow", ClassFLowSchema);

export default ClassflowM;
