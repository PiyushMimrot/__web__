import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    studentid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "students",
      required: true,
    },
    date: {
      type: Date,
      default: null,
      // required: true
    },
    present: {
      type: Boolean,
      default: false,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "classes",
    },
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
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

const Attendance = mongoose.model("Attendance", AttendanceSchema);

export default Attendance;
