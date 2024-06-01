import mongoose from "mongoose";

const StaffSchema = new  mongoose.Schema( {
  name: {
    type:String,
    required:true,
  },
  gender: {
    type:String,
    default:null
  },
  phone: {
    type:String,
    default:null
  },
  email: {
    type:String,
    default:null
  },
  staff_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StaffType",
  },
  address: {
    type:String,
    default:null
  },
  password: String,
  staffStatus: {
    type: String,
    default: "Active",
  },
  adherCard:{
    type:String,
    default:null
  },
  panCard: {
    type:String,
    default:null
  },
  photo: {
    type:String,
    default:null
  },
  adherNumber: {
    type:String,
    // unique:true
    sparse: true
  },
  panNumber: {
    type: String,
    // unique: true,
    uppercase: true,
    sparse: true
  },
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "schools",
  },
  status: {
    type: Boolean,
    default:false,
  },
  nationality: {
    type:String,
    default:null
  },
  religion: {
    type:String,
    default:null
  },
  pin: {
    type: String,
    select: false,
  },
  isDeleted:{
    type:Boolean,
    default:false
  },
},{timestamps:true});


const Staffs = mongoose.model("staffs", StaffSchema);
export default Staffs;
