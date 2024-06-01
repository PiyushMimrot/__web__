import mongoose from "mongoose";

const knowledge_bank_schema = mongoose.Schema(
  {
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "uni_classes",
      required: true,
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "uni_subjects",
      required: true,
    },
    chapter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "uni_chapters",
      required: true,
    },
    topic_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "uni_topics",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    material: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    // tags: {
    //   type: [String],
    //   default: null,
    // },
  },
  { timestamps: true }
);

export default mongoose.model("knowledge_bank", knowledge_bank_schema);
