import express from "express";
import {
  addManyTopics,
  addTopic,
  deleteTopic,
  getAllTopics,
  getOneTopic,
  getTopicsByChapt,
  updateTopic,
} from "../../Controllers/Main/topicsController.js";
import Authorization from "../../src/auth/Authorization.js";
const router = express.Router();

//ADD TOPIC NAME
router.post("/add", Authorization(["admin", "teacher"]), addTopic);
router.post("/addMany", Authorization(["supperadmin"]), addManyTopics);

//GET ALL TOPICS
router.get(
  "/getall/",
  Authorization(["admin", "teacher", "student"]),
  getAllTopics
);

//GET TOPIC BY ID
router.get(
  "/getone/:id",
  Authorization(["admin", "teacher", "student"]),
  getOneTopic
);

//GET TOPICS BY CHAPTER
router.get(
  "/gettopic/:id",
  Authorization(["admin", "teacher", "student", "supperadmin"]),
  getTopicsByChapt
);

//UPDATE TOPIC
router.put("/update/:id", Authorization(["admin", "teacher"]), updateTopic);

//DELTE TOPIC
router.delete("/delete/:id", Authorization(["admin", "teacher"]), deleteTopic);

//Get Knowledge Banks
// router.get(
//   "/getknowledgebank/:id",
//   Authorization(["admin", "teacher", "student", "supperadmin"])
// );

export default router;
