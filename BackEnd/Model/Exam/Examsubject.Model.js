import mongoose from "mongoose";

const ExamsubjectsSchema = new mongoose.Schema(
  {
    subject: [
      {
        subject_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Subjects",
        },
        chapters: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseList",
          },
        ],
        total_marks: Number,
      },
    ],
    exam_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Examlist",
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

const ExamSubjectM = mongoose.model("ExamSubject", ExamsubjectsSchema);

export default ExamSubjectM;
