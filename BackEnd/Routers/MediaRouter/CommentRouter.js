import express from "express";
const router = express.Router();
import Authorization from "../../src/auth/Authorization.js";
import {
  addComment,
  fetchCommentsByPostId,
} from "../../Controllers/MediaController/Commentcontroller.js";

router.post(
  "/addComment/:id",
  Authorization(["admin", "teacher", "student"]),
  addComment
);
router.get(
  "/:id",
  Authorization(["admin", "teacher", "student"]),
  fetchCommentsByPostId
);

export default router;
