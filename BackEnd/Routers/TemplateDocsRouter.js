import express from "express";
const router = express.Router();

import {
  deleteDocument,
  updateDocument,
  getDocuments,
  createDocument,
} from "../Controllers/DocumentController.js";
import Authorization from "../src/auth/Authorization.js";
router.post(
  "/createDocument",
  Authorization(["admin", "teacher"]),
  createDocument
);
router.get("/getDocuments", Authorization(["admin", "teacher"]), getDocuments);
router.put("/:id", Authorization(["admin", "teacher"]), updateDocument);
router.delete("/:id", Authorization(["admin", "teacher"]), deleteDocument);

export default router;
