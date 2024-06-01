import mongoose from "mongoose";



// Don't need of API implementation

const NotificationTypeSchema = new mongoose.Schema({
        
          id:{
            type:mongoose.Schema.Types.ObjectId,
            required: true
          },
          name :{
            type :String,
            required: true
          },
          message :{
            type :String,
            required :true
          },
          icon :{
            type :String,
            required :true
          }
})

const NotificationType = mongoose.model("notificationtype", NotificationTypeSchema);

export default NotificationType;