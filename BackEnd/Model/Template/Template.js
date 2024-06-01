import mongoose from "mongoose";

const template = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    desc: {
      type: [String],
      required: true,
    },
    for: {
      type: String,
      enum: ["student", "staff"],
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "schools",
      required: true,
    },
  },
  { timestamps: true }
);

export const Template = mongoose.model("template", template);
