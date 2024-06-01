import mongoose from "mongoose";
const Parent = new mongoose.Schema(
  {
    studentid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentInformation",
      required: true,
    },
    fathername: {
      type: String,
      required: true,
      trim: true,
    },
    Parentnumber: {
      type: Number,
      required: true,
      trim: true,
    },
    mothername: {
      type: String,
      required: true,
      trim: true,
    },
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "schools",
    },
    status: {
      type: Boolean,
    },
    pin: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ParentInformation", Parent);
