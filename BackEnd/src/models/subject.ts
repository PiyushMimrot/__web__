import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "classes",
    },
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "schools",
    },
    isDeleted:{
      type:Boolean,
      default:false
    },
  },
  { timestamps: true }
);

export const Subject = mongoose.model("Subjects", SubjectSchema);
