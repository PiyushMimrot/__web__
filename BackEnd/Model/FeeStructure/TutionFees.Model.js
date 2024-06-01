import mongoose from "mongoose";

const TutionFeesSchema = new mongoose.Schema(
  {
    class_name: String,
    charge_name: String,
    date: {
      type: Date,
      default: Date.now,
    },
    amount: String,
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

const TutionFeesM = mongoose.model("TutionFee", TutionFeesSchema);

export default TutionFeesM;
