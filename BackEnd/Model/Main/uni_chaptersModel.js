import mongoose from "mongoose";

const uni_chapters_schema = mongoose.Schema(
  {
    subject_id: {
      type: String,
      required: true,
    },
    chapter_name: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("uni_chapters", uni_chapters_schema);
