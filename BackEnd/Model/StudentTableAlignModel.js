import mongoose, { model } from "mongoose";

const moonLanding = new Date();
const currentYear = moonLanding.getFullYear();
const nextYear = currentYear + 1;
const CurrentSession = `${currentYear}-${nextYear.toString().slice(2)}`;

const StudentAlign = new mongoose.Schema(
  {
    studentid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
      required: true,
    },

    Class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "classes",
      trim: true,
    },
    section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
      trim: true,
    },
    status: {
      type: String,
      default: "1",
    },
    session_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },
    CreatedDate: {
      type: Date,
      default: Date.now(),
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

export default mongoose.model("StudentAlignInfo", StudentAlign);
