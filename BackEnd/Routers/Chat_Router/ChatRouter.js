import {
  addClassGroupChat,
  addClassGroupMessage,
  getAllClassGroupChats,
  getClassGroupMessages,
} from "../../Controllers/ChatController/ClassGroupChatController.js";
import Authorization from "../../src/auth/Authorization.js";
import express from "express";

const router = express.Router();

router.get(
  "/classgroup/getallgroups",
  Authorization(["admin", "teacher", "student"]),
  getAllClassGroupChats
);
router.get("classgroup/add", Authorization(["admin"]), addClassGroupChat);

// messages
router.post(
  "/classmessage/:groupid",
  Authorization(["admin", "teacher", "student"]),
  addClassGroupMessage
);
router.get(
  "/classmessage/:groupid",
  Authorization(["admin", "teacher", "student"]),
  getClassGroupMessages
);
export default router;
