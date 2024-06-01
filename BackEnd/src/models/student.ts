import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  number: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  dob: {
    type: Date,
  },
  studentId: {
    type: Number,
    unique: true,
    required: true,
  },
  adherNumber: {
    type:String,
  },
  // MULTER
  photo: {
    type: String,
  },
  adherCard: {
    type: String,
  },
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "schools",
  },
  pin: {
    type: String,
    select: false,
  },
  nationality: String,
  gender: {
    type: String,
    lowercase: true,
    enum: ["female", "male"],
  },
  religion: String,
  isDeleted:{
    type:Boolean,
    default:false
  },
},{timestamps:true});
const Students = mongoose.model("students", StudentSchema);

export default Students;
