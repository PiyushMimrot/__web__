import express from "express";
import SessionM from "../src/models/session.js";
import Authorization from "../src/auth/Authorization.js";

const router = express.Router();

//add  a new session
router.post("/", Authorization(["admin", "Accountant"]), async (req, res) => {
  try {
    const sessionData = req.body;
    sessionData.date = new Date();
    if (sessionData.active) {
      const res = await SessionM.findOneAndUpdate(
        { active: 1, school_id: req.school },
        { active: 0 }
      );
    }
    const sessionD = new SessionM({ ...sessionData, school_id: req.school });
    const result = await sessionD.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

//get all sessions
router.get("/", Authorization(["admin", "Accountant"]), async (req, res) => {
  try {
    const sessions = await SessionM.find({
      school_id: req.school,
      isDeleted: false,
    }).sort({
      start_date: 1,
    });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//edit a session
router.put("/:id", Authorization(["admin", "Accountant"]), async (req, res) => {
  try {
    const sessionId = req.params.id;
    const updatedSessionData = req.body;
    updatedSessionData.date = new Date();

    //(updatedSessionData);
    if (updatedSessionData.active) {
      const res = await SessionM.findOneAndUpdate({ active: 1 }, { active: 0 });
    }
    const updatedSession = await SessionM.findByIdAndUpdate(
      sessionId,
      updatedSessionData,
      { new: true }
    );

    if (!updatedSession) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.status(200).json(updatedSession);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//edit active state
router.get(
  "/update/:id",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      const sessionId = req.params.id;
      await SessionM.updateOne({ _id: sessionId }, { $set: { active: true } });

      // Deactivate all other sessions
      await SessionM.updateMany(
        { _id: { $ne: sessionId }, school_id: req.school_id }, // Exclude the already activated session
        { $set: { active: false } }
      );
      res.json({ success: true, msg: "Session set as active successfully" });
    } catch (err) {
      res.json({ success: false, message: err.message });
    }
  }
);

//delete a session
router.delete(
  "/:id",
  Authorization(["admin", "Accountant"]),
  async (req, res) => {
    try {
      const sessionId = req.params.id;
      // const deletedSession = await SessionM.findByIdAndRemove(sessionId);
      const deletedSession = await SessionM.findByIdAndUpdate(sessionId, {
        $set: { isDeleted: true },
      });

      if (!deletedSession) {
        return res.status(404).json({ error: "Session not found" });
      }

      res.json({ success: true, message: "Session deleted successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// get active session
router.get(
  "/active",
  Authorization(["admin", "teacher", "student", "parent", "Accountant"]),
  async (req, res) => {
    try {
      const session = await SessionM.findOne({
        school_id: req.school,
        active: true,
      });
      res.status(200).send({ data: session });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

//get end date of active session (used for creating a new session)
router.get(
  "/maxdate",
  Authorization(["admin", "teacher", "student", "parent", "Accountant"]),
  async (req, res) => {
    try {
      const largestEndDateSession = await SessionM.findOne().sort({
        end_date: -1,
      });
      res.json(largestEndDateSession);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

export default router;
