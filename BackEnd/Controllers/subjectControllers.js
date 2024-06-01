import { Subject } from "../src/models/subject.js";
import ClassTeacherModel from "../Model/ClassTeacher.Model.js";

export const createSubjectController = async (req, res) => {
  try {
    const { name, class_id } = req.body;

    console.log(class_id);

    const subject_Data = await new Subject({
      name,
      class_id,
      school_id: req.school,
    }).save();

    res.status(200).send({
      status: "success",
      data: subject_Data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubjectController = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.find({
      class_id: id,
      school_id: req.school,
      isDeleted: false,
    }).populate("class_id");

    res.status(200).send({
      status: "success",
      data: subject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSubjectController = async (req, res) => {
  try {
    const { name } = req.body;
    const id = req.params.id;

    const subject = await Subject.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    res.status(200).send({
      status: "success",
      data: subject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSubjectController = async (req, res) => {
  try {
    const id = req.params.id;
    const subject = await Subject.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } }, // Update specific fields
      { new: true } // Return the updated document
    );
    // const subject = await Subject.findByIdAndDelete(id);

    res.status(200).send({
      status: "success",
      data: subject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// single subject router
export const getSingleSubjectController = async (req, res) => {
  const id = req.params.id;

  try {
    const subject = await Subject.findById(id);
    res.status(200).send({
      status: "success",
      data: subject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubject = async (req, res) => {
  try {
    let subject = null;
    if (req.userType === "admin") {
      subject = await Subject.find({ school_id: req.school, isDeleted: false });
    } else if (req.userType === "teacher") {
      let sub = await ClassTeacherModel.find({
        teacher_id: req.userId,
      }).populate("subject_id");
      // console.log(sub,'sub')
      subject = sub.reduce((acc, crr) => {
        if (
          !acc.some(
            (item) =>
              item["_id"].toString() === crr.subject_id["_id"].toString()
          )
        ) {
          acc.push(crr.subject_id);
        }
        return acc;
      }, []);
    }
    res.status(200).send({
      status: "success",
      data: subject,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
