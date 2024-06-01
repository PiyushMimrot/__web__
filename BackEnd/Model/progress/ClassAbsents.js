import mongoose from "mongoose";

const ClassAbsentsSchema = new mongoose.Schema(
  {
    classHistoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassHistory",
      required: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
      required: true,
    },
    reason: {
      type: String,
      default: "Unknown",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const ClassAbsents = mongoose.model("ClassAbsents", ClassAbsentsSchema);

export default ClassAbsents;
