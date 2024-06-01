import mongoose from "mongoose";

const ReasonSchema = new mongoose.Schema(
  {
    reason: {
      type: Array,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const classLeaveM = mongoose.model("classLeave", ReasonSchema);

export default classLeaveM;
