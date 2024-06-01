import mongoose from "mongoose";

const NotificationViewHistorySchema = new mongoose.Schema({
        
          id:{
            type:mongoose.Schema.Types.ObjectId,
            required: true
          },
          userId :{
            type:mongoose.Schema.Types.ObjectId,
            required: true
          },
          userType :{
            type :String,
            required :true
          },
          notification_id :{
            type :mongoose.Schema.Types.ObjectId,
            ref : "notification",
            required :true
          },
          
},{
    timestamps :true
})

const NotificationViewHistory = mongoose.model("notificationviewhistory", NotificationViewHistorySchema);

export default NotificationViewHistory;