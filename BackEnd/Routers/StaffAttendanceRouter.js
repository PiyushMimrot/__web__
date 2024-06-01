import express from "express";
const router = express.Router();
import staffAttendance from "../Model/staffAttendanceModel.js";
import Authorization from "../src/auth/Authorization.js";
//add attendance
router.post("/add", Authorization(["admin", "teacher"]), async (req, res) => {
  try {
    const addStaffAttendance = new staffAttendance(req.body);
    const saved = await addStaffAttendance.save();
    res.status(200).json(saved);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//get all staff attendence
router.get("/getall", Authorization(["admin"]), async (req, res) => {
  try {
    const getAllStaffAttendance = await staffAttendance
      .find({ schoolId: req.school })
      .populate("staffId");
    res.status(200).json(getAllStaffAttendance);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//get staff attendance by staff id
router.get(
  "/get/:id",
  Authorization(["admin", "teacher"]),
  async (req, res) => {
    const staffId = req.params.id;
    try {
      const getStaffAttendanceById = await staffAttendance
        .find({
          staffId: staffId,
        })
        .sort({ date: -1 });
      res.status(200).json(getStaffAttendanceById);
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "internal server error" });
    }
  }
);

//get by today's date
router.get(
  "/gettoday",
  Authorization(["admin", "teacher"]),
  async (req, res) => {
    // if (req.userType === "admin") {
    const today = new Date(); // Get today's date
    today.setHours(0, 0, 0, 0); // Set the time to 00:00:00.000 for accurate date comparison

    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    try {
      const result = await staffAttendance
        .find({
          date: {
            $gte: today,
            $lte: endOfDay,
          },
          schoolId: req.school,
          isDeleted: false,
        })
        .populate("staffId", "name isDeleted");
      const filteredAttendances = result.filter(
        (attendance) => attendance.staffId.isDeleted !== true
      );
      res.status(200).json(filteredAttendances);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
    // }
  }
);

//get data according to input date
router.post(
  "/getbydate",
  Authorization(["admin", "teacher"]),
  async (req, res) => {
    // if (req.userType === "admin") {
    try {
      const dateString = req.body.date;
      const selectedDate = new Date(dateString);

      selectedDate.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const result = await staffAttendance
        .find({
          date: {
            $gte: selectedDate,
            $lte: endOfDay,
          },
          schoolId: req.school,
        })
        .populate("staffId", "name isDeleted");

      const filteredAttendances = result.filter(
        (attendance) => attendance.staffId.isDeleted !== true
      );
      res.status(200).json(filteredAttendances);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
    // }
  }
);

//approve the attendance
router.post("/approve/:id", Authorization(["admin"]), async (req, res) => {
  if (req.userType === "admin") {
    try {
      const id = req.params.id;
      const update = await staffAttendance.findByIdAndUpdate(
        id,
        {
          $set: { status: 1, modifiedDate: Date.now() },
        },
        { new: true }
      );
      res.status(200).json(update);
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

//disapprove the attendance
router.post(
  "/disapprove/:id",
  Authorization(["admin", "teacher"]),
  async (req, res) => {
    if (req.userType === "admin") {
      try {
        const id = req.params.id;
        const update = await staffAttendance.findByIdAndUpdate(
          id,
          {
            $set: { status: 0, modifiedDate: Date.now() },
          },
          { new: true }
        );
        res.status(200).json(update);
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }
  }
);

export default router;
