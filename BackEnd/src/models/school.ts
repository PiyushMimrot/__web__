import mongoose from "mongoose";

const SchoolSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  email: String,
  password: String,
  logo: String,
  schoolCode: {
    type:String,
    uppercase:true,
  },
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  ],
  isDeleted:{
    type:Boolean,
    default:false
  },
},{timestamps:true});

const Schools =  mongoose.model("schools",SchoolSchema)

export default Schools;
