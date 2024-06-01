import express from "express";
import {
  addEvent,
  deleteEvent,
  editEvent,
  getAllEvent,
  getEventByDate,
} from "../Controllers/CalenderController.js";
import Authorization from "../src/auth/Authorization.js";
const router = express.Router();

router.post("/addevent", Authorization(["admin"]), addEvent);
router.get(
  "/getevent",
  Authorization(["admin", "teacher", "student"]),
  getAllEvent
);
router.post("/geteventbydate", Authorization(["admin"]), getEventByDate);
router.put("/editevent/:id", Authorization(["admin"]), editEvent);
router.get("/deleteevent/:id", Authorization(["admin"]), deleteEvent);

export default router;
