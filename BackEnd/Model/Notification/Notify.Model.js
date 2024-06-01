import mongoose from "mongoose";

const NotifySchema = new mongoose.Schema({
    sender:[
        {
          sendId:{
            type:mongoose.Schema.Types.ObjectId,
            required: true
          },
          category:String
        }
      ],
    receiver:String,
    expire:Date,
    message:String,
    route:String,
    icon:[
        {
            i:{
                type:String
            }
        }
    ],
    school_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'schools'
    }
},{
    timestamps: true
})

const NotifyM = mongoose.model("notify", NotifySchema);

export default NotifyM;