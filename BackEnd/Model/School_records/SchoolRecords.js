import mongoose from "mongoose";

const schoolRecordSchema = new mongoose.Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"schools",
      required: true,
    },
    admin_record_id :{
        type :mongoose.Schema.Types.ObjectId,
        ref :"adminRecord",
        required:true        
    }
  },
  { timestamps: true }
);

const SchoolRecord = mongoose.model("schoolRecord", schoolRecordSchema);

export default SchoolRecord;
