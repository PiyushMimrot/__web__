import mongoose from "mongoose";

const uni_class_schema = new mongoose.Schema(
  {
    class_name: {
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

export default mongoose.model("uni_class", uni_class_schema);
