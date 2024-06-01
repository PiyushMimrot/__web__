import mongoose from "mongoose";
const assignmentSchema = new mongoose.Schema(
  {
    assignment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Assignment" },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: "students" },
    document: {
      type: String,
      // required: true,
    },
    additionalDocuments: [
      {
        type: String,
      },
    ],
    marks: {
      type: Number,
    },
    status: {
      type: String,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const UploadAssignmentNew = mongoose.model(
  "UploadAssignment",
  assignmentSchema
);

export default UploadAssignmentNew;
