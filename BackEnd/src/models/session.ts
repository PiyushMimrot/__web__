import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    session_name: String,
    date: Date,
    active: Boolean,
    start_date: String,
    end_date: String,
    isDeleted:{
      type:Boolean,
      default:false
    },
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "schools",
    },
  },
  { timestamps: true }
);

const SessionM = mongoose.model("Session", sessionSchema);

export default SessionM;
