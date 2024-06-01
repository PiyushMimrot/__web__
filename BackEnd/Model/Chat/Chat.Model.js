import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: true,
  },
  session_id: {
    type: String
  },
  section_id:{
    type: String
  },
  members: {
    
  },
  school_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'schools'
}
});

const ChatM = mongoose.model('chat', chatSchema);
export default ChatM
