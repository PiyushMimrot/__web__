import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    // unique: true,
  },
  email: {
    type: String,
    default: null,
  },
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "schools",
  },
  status: {
    type: Boolean,
  },
  pin: {
    type: String,
    // unique: true,
  },
},{timestamps:true});

const Admin = mongoose.model("Admin", AdminSchema);

export default Admin;
