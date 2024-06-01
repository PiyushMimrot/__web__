import mongoose from "mongoose";
import Classes from "./Class.Model.js";

const sectionSchema = new mongoose.Schema(
  {
    class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Classes,
    },
    name: String,
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

const SectionM = mongoose.model("Section", sectionSchema);

export default SectionM;
