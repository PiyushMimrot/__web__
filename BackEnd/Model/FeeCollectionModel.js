import mongoose from "mongoose";

const FeeCollectionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
    },
    session_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },
    payment_mode: {
      type: Number,
      required: true,
    },
    month: {
      type: Array,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
    },
    date: {
      type: Date,
      required: true,
    },
    transaction_id: {
      type: String,
      unique: true,
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

export default mongoose.model("FeeCollection", FeeCollectionSchema);
