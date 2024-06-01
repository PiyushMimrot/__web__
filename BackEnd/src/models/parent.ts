import mongoose from "mongoose";
const ParentSchema = new mongoose.Schema({
    phoneNumber:{
        type:String,
        required:true,
        trim:true,
    },
    studentid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "students",
        required: true
    },
    fathername: {
        type: String,
        required: true,
        trim: true
    },
 
    mothername:{
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Boolean,
      },
      pin:{
        type: String
      },
    school_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'schools'
    },
    isDeleted:{
        type:Boolean,
        default:false
      },
},{timestamps:true});

export default mongoose.model("parents",ParentSchema);