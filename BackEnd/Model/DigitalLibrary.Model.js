import mongoose from "mongoose";

const DigitalLibrarySchema = new mongoose.Schema(
  {
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "classes",
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Subjects",
    },
    chapter_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "CourseList",
    },
    topic_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "staffs",
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      // required: true,
    },
    views: {
      type: Number,
      // required: true,
      default: 0,
    },
    material: {
      type: String,
      default: null,
    },
    urlLink: {
      type: String,
      default: null,
    },

    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "schools",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("DigitalLibrary", DigitalLibrarySchema);
