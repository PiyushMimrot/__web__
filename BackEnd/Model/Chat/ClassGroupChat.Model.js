import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
    },
    members: [
      {
        type: mongoose.Schema.ObjectId,
      },
    ],
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subjects",
    },
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "classes",
    },
    section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sections",
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staffs",
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

const ClassGroupChatModel = mongoose.model("classgroupchat", chatSchema);
export default ClassGroupChatModel;
