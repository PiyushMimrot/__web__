import mongoose from "mongoose";

const SpecialChargeSchema = new mongoose.Schema(
  {
    name: String,
    value: Number,
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

const SpecialChargeM = mongoose.model("SpecialCharge", SpecialChargeSchema);

export default SpecialChargeM;
