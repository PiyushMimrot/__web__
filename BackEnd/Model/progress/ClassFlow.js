import mongoose from "mongoose";

const ClassFlowSchema = new mongoose.Schema(
  {
    classHistoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassHistory",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "classes",
    },
    chapterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseList",
      required: true,
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subjects",
    },
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    progress: {
      type: Number,
      required: true,
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
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

const Classflow = mongoose.model("ClassFlows", ClassFlowSchema);

export default Classflow;
