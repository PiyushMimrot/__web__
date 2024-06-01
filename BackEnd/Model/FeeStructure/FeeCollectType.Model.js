import mongoose from "mongoose";

const FeeCollectSchema = new mongoose.Schema(
  {
    status: Boolean,
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

const FeeCollectTypeM = mongoose.model("fee_collect_type", FeeCollectSchema);

export default FeeCollectTypeM;
