import mongoose from "mongoose";

const document = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      required: true,
    },
    template_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "template",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "schools",
      required: true,
    },
  },
  { timestamps: true }
);

const Documents = mongoose.model("Document", document);

export default Documents;
