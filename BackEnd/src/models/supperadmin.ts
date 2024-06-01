import mongoose from "mongoose";

const SuperAdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: null,
  },
  status: {
    type: Boolean,
  },
  pin: {
    type: String,
  },
},{timestamps:true});

const SupperAdmin = mongoose.model("SupperAdmin", SuperAdminSchema);

export default SupperAdmin;
