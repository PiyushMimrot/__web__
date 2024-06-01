import mongoose from "mongoose";

const staffTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
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

export default mongoose.model("StaffType", staffTypeSchema);
