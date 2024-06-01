import mongoose from "mongoose";
const funFactSchema = new mongoose.Schema(
  {
    fact: {
      type: String,
      required: true,
    },
    explanation: {
      type: String,
      required: true,
    },
    tip_status: {
      type: Number,
      default: 0,
    },
    date_created: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const FunFactM = mongoose.model("FunFact", funFactSchema);

export default FunFactM;
