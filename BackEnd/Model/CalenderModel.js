import mongoose from "mongoose";

const CalenderSchema = mongoose.Schema(
  {
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "schools",
    },
    date: {
      type: "String",
    },
    session_id: {
      type: String,
    },
    title: {
      type: String,
    },
    status: {
      type: Number,
      default: 1,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Calender = mongoose.model("Calender", CalenderSchema);

export default Calender;
