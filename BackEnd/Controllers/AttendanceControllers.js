import Attendance from "../Model/AttendanceModel.js";
import StudentTableAlignModel from "../Model/StudentTableAlignModel.js";
import mongoose from "mongoose";

// create Attendance
export const createAttendanceController = async (req, res) => {
  try {
    const { studentid, present, classId, sectionId } = req.body;

    const attendance = await Attendance.create({
      studentid,
      present,
      school_id: req.school,
    });
    console.log();
    res.status(200).send({
      status: "success",
      data: attendance,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error while creating attendance", error: error });
  }
};

// update Attendance
export const updateAttendanceController = async (req, res) => {
  try {
    const attendanceDataArray = req.body.array; // Array of {student_id, date, present} objects
    const { date } = req.body;

    // Use a loop or async/await to process each object in the array
    for (const attendanceData of attendanceDataArray) {
      const { _id, present } = attendanceData;
      const { studentid, Class_id, section_id } = attendanceData;
      //  const present = true;
      // Find the attendance record for the given student_id and date
      let attendanceRecord = await Attendance.findOne({
        studentid: studentid._id,
        date,
        school_id: req.school,
      });

      // If the attendance record does not exist, create a new one
      if (
        attendanceRecord === null ||
        attendanceRecord.length === 0 ||
        attendanceRecord.date === null
      ) {
        attendanceRecord = new Attendance({
          studentid: studentid._id,
          date,
          present,
          school_id: req.school,
          classId: Class_id._id,
          sectionId: section_id._id,
        });

        // Save the attendance record
        console.log(attendanceRecord, "arrrr");
        await attendanceRecord.save();
      } else {
        const attendance = await Attendance.findByIdAndUpdate(_id, {
          present: present,
        });

        console.log("Updated Atd " + attendance);
      }
    }
    res.status(200).json({
      status: "success",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// delete Attendance
export const deleteAttendanceController = async (req, res) => {
  try {
    const id = req.params.id;
    const attendance = await Attendance.findByIdAndDelete(id);
    res.status(200).send({
      status: "success",
      data: attendance,
    });
  } catch (error) {
    res.status(500).json({ error: "Error in delete attendance", error: error });
  }
};

// get Attendance
export const getAttendanceController = async (req, res) => {
  const { sectionId } = req.body;
  try {
    console.log({ msg: req.body });
    let date = req.body.date;
    if (date === "null") {
      date = null;
    }

    const attendance = await Attendance.find({
      date: date,
      school_id: req.school,
      sectionId: sectionId,
    }).populate("studentid", "name photo");

    // console.log(attendance,'atttee');

    res.status(200).send({
      status: "success",
      data: attendance,
    });
  } catch (error) {
    //(error);
    res
      .status(500)
      .json({ error: "Error in getting attendance", error: error });
  }
};

// search student by name
export const searchStudentController = async (req, res) => {
  try {
    const { class_id, section_id, date } = req.body;

    console.log(req.body, "attt");

    if (date === "null") {
      date = null;
    }
    let classStudent = await Attendance.find({
      // classId: class_id,
      sectionId: section_id,
      date: date,
      present: true,
    }).populate("studentid", "name");
    // console.log(classStudent, "clstd");
    res.status(200).send({
      status: "success",
      data: classStudent,
    });
  } catch (error) {
    //(error);
    res.status(500).json({ error: "Error in searching student", error: error });
  }
};

// get student cnt
export const getStudentCntController = async (req, res) => {
  try {
    const studentCnt = await Attendance.find({
      date: null,
      school_id: req.school,
    });

    res.status(200).json({
      status: "success",
      data: studentCnt.length,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentAttendanceController = async (req, res) => {
  let studentId = req.params.id;
  if (studentId === "undefined") {
    studentId = req.userId;
  }
  try {
    const studentReport = await Attendance.find({ studentid: studentId })
      .sort({ date: "desc" })
      .exec();

    res.status(200).json({
      status: "success",
      data: studentReport,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllStudentAtt = async (req, res) => {
  const date = req.params.id;
  try {
    const studentReport = await Attendance.count({
      date,
      school_id: req.school,
      present: true,
    });
    const totalStudents = await StudentTableAlignModel.count({
      school_id: req.school,
      status: 1,
    });

    res.json({ studentReport, totalStudents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudentAttendence = async (req, res) => {
  const { attendenceId, present } = req.body;
  try {
    const student = await Attendance.findByIdAndUpdate(
      attendenceId,
      { $set: { present } },
      { new: true }
    );

    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudentAttendenceArray = async (req, res) => {
  try {
    const updates = req.body;

    const updatePromises = updates.map(async (update) => {
      const { id, present } = update;

      const updatedAttendance = await Attendance.findByIdAndUpdate(
        id,
        { present },
        { new: true }
      );
      return updatedAttendance;
    });
    const updatedDocuments = await Promise.all(updatePromises);
    res.status(200).json({
      message: "Documents updated successfully",
      data: updatedDocuments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating documents" });
  }
};
