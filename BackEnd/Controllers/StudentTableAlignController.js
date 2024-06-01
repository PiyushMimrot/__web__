import StudentTableAlignModel from "../Model/StudentTableAlignModel.js";
import parent from "../src/models/parent.js";
import Students from "../src/models/student.js";

export const studentaligncontroller = async (req, res) => {
  try {
    const { studentid, Class_id, section_id, status, session_id } = req.body;

    const studentAlignInfo = new StudentTableAlignModel({
      studentid,
      Class_id,
      section_id,
      session_id,
      school_id: req.school,
    });

    await studentAlignInfo.save();

    res.status(200).json({
      success: true,
      message: "Student is successfully registered.",
    });

    // console.log(studentAlignInfo);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const fetchingStudentAligninformation = async (req, res) => {
  try {
    const data = await StudentTableAlignModel.find({
      school_id: req.school,
      isDeleted: false,
      status: "1",
    })
      .populate("Class_id")
      .populate("section_id")
      .populate("studentid");

    if (!data) {
      return res.status(404).json({
        status: "error",
        message: "No data found in StudentTableAlignModel collection",
      });
    }

    res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching data",
      error: error.message,
    });
  }
};

export const fetchStudents = async (req, res) => {
  const myId = req.userId;
  const { class_id, section } = req.body;
  try {
    const data = await StudentTableAlignModel.find({
      Class_id: class_id,
      section_id: section,
      isDeleted: false,
    })
      .populate("studentid", "-photo -adherCard")
      .populate("Class_id", "name")
      .populate("section_id", "name");
    res.status(200).json({
      status: "success",
      data,
      myId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const fetchStudentsByClass = async (req, res) => {
  console.log(req.body);
  const { class_id, section } = req.body;
  try {
    const id = req.params.id;
    console.log(id, "id");
    const data = await StudentTableAlignModel.find({
      Class_id: class_id,
      isDeleted: false,
    }).populate("studentid", "name");
    res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteStudentAlign = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    // const data = await StudentTableAlignModel.findByIdAndDelete(id);
    const data = await StudentTableAlignModel.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } }, // Update specific fields
      { new: true } // Return the updated document
    );
    res.send({ message: "Student deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchStudentsByID = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await StudentTableAlignModel.find({ studentid: id })
      .populate("Class_id")
      .populate("section_id");
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchByStudentSession = async (req, res) => {
  try {
    const studentAlign = await StudentTableAlignModel.find(req.body);
    res.status(200).json(studentAlign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchByStudentidSession = async (req, res) => {
  const { session_id } = req.body;
  console.log(req.body);
  try {
    const studentAlign = await StudentTableAlignModel.findOne({
      studentid: req.userId,
      session_id,
    });
    res.status(200).json(studentAlign);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
