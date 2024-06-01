import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classes",
    },
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subjects",
    },
    chapter: String,
    topic: String,
    short_desc: String,
    doc_path: String,
    date: String,
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "schools",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const UniverseMaterialModel = mongoose.model(
  "UniverseMaterial",
  materialSchema
);
