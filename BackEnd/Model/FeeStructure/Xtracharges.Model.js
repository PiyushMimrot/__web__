import mongoose from "mongoose";

const XtraChargeSchema = new mongoose.Schema(
  {
    class_name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "classes",
      default: null,
    },
    value: Number,
    status: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
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

const XtraChargeM = mongoose.model("XtraCharge", XtraChargeSchema);

export default XtraChargeM;
