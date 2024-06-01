import mongoose from "mongoose";

const ComplainSchema = new mongoose.Schema(
  {
    complainFor: [
      {
        forId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        category: String,
      },
    ],
    complainOn: [
      {
        onId: mongoose.Schema.Types.ObjectId,
        category: String,
      },
    ],
    complainTo: [
      {
        toId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        category: String,
      },
    ],
    complainTitle: String,
    complainDesc: String,
    complainDoc: {
      type: String,
    },
    complainStatus: {
      type: Boolean,
      default: false,
    },
    isReaded: {
      type: Boolean,
      default: false,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
    dateResolved: {
      type: Date,
      default: null,
    },
    readDate: {
      type: Date,
    },
    queryStatus: {
      type: Boolean,
      default: false,
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

const ComplainM = mongoose.model("Complaint", ComplainSchema);

export default ComplainM;
