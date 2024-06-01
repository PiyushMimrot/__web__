import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    }
  }
);

const Admin = mongoose.model("admin", adminSchema);

export default Admin;
