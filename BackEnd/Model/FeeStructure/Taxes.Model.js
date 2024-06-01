import mongoose from "mongoose";

const TaxSchema = new mongoose.Schema(
  {
    tax_name: String,
    value: Number,
    date: Date,
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

const TaxM = mongoose.model("Taxes", TaxSchema);

export default TaxM;
