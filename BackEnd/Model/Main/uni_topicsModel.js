import mongoose from "mongoose";

const uni_topics_schema = mongoose.Schema(
  {
    chapter_id: {
      type: String,
      required: true,
    },
    topic_name: {
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

export default mongoose.model("uni_topics", uni_topics_schema);
