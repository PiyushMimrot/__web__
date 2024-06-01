import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderType: {
      type: String,
      enum: ["admin", "teacher", "student"],
      required: true,
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      required: true,
      refPath: "docModel",
    },
    docModel: {
      type: String,
      required: true,
      enum: ["Admin", "staffs", "students"],
    },
    message: {
      type: String,
      required: true,
    },
    chatGroup: {
      type: mongoose.Types.ObjectId,
      ref: "classgroupchats",
      required: true,
    },
  },
  { timestamps: true }
);

const ClassGroupMessageModel = mongoose.model(
  "classgroupmessage",
  messageSchema
);
export default ClassGroupMessageModel;
