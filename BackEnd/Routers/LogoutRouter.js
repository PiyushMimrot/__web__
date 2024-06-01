import express from "express"
import { LoginLogoutLogs } from "../src/models/logs.js";
const router = express.Router();

router.post("/",  (req, res) => {
    console.log("object")
  res.clearCookie("token");
  LoginLogoutLogs.create({ user_id: req.userId, time_of_event: new Date(), event: "logout" });
  return res.status(200).json({ message: "User Logged out" });
});

export default router;
