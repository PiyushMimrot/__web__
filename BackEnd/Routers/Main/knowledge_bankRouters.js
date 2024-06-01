import express from "express";
import {
  addKnowledgeBank,
  addKnowledgeBankExcel,
  deleteBank,
  getBankByTopic,
  updateBank,
} from "../../Controllers/Main/knowledge_bankController.js";
import Authorization from "../../src/auth/Authorization.js";
import multer from "multer";
import { UPLOAD_PATH } from "../../config.js";
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${UPLOAD_PATH}/universalmaterial`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

//ADD KNOWLDEGE BANK CONTENT
router.post(
  "/add",
  Authorization(["supperadmin"]),
  upload.single("material"),
  addKnowledgeBank
);
//ADD KNOLEDGE BANK CONTENT EXCEL
router.post("/addExcel", Authorization(["supperadmin"]), addKnowledgeBankExcel);

//GET KNOWLEDGE BANK BY TOPIC NAME
router.get(
  "/getbank/:id",
  Authorization(["admin", "teacher", "student", "supperadmin"]),
  getBankByTopic
);

//UPDATE BANK
router.put("/update/:id", Authorization(["admin", "teacher"]), updateBank);

//DELETE BANK
router.delete("/delete/:id", Authorization(["admin", "teacher"]), deleteBank);

export default router;
