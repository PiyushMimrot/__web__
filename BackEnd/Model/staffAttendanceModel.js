import mongoose from "mongoose";
const StaffAttendanceSchema = new mongoose.Schema(
  {
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "staffs",
      required: true,
    },
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "schools",
      required: true,
    },
    date: {
      type: Date,
    },
    status: {
      type: Number,
      default: 0,
    },
    modifiedDate: {
      type: Date,
    },
    session_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const staffAttendance = mongoose.model(
  "staffAttendance",
  StaffAttendanceSchema
);

export default staffAttendance;
