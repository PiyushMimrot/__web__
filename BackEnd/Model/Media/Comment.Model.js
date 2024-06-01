import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentInformation",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    school_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "schools",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const CommentM = mongoose.model("Comment", commentSchema);

export default CommentM;
