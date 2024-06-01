import mongoose from "mongoose";
const classSchema = new mongoose.Schema(
  {
    name: String,
    noOfSec: String,
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

const Classes = mongoose.model("classes", classSchema);
export default Classes;
