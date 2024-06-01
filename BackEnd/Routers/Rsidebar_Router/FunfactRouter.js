import FunFactM from "../../Model/Rsidebar/Funfact.Model.js";

import express from "express";
const router = express.Router();

router.post("/", async (req, res) => {
  const result = new FunFactM(req.body);
  await result.save();
  res.status(200).json(result);
});

router.get("/gettips", async (req, res) => {
  try {
    const validTips = await FunFactM.find({ tip_status: 1 });
    const randomIndex = Math.floor(Math.random() * validTips.length);
    const randomTip = validTips[randomIndex];
    res.status(200).json(randomTip);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/getfacts", async (req, res) => {
  try {
    const factsWithoutTips = await FunFactM.find({ tip_status: 0 });
    const randomIndex = Math.floor(Math.random() * factsWithoutTips.length);
    const randomFact = factsWithoutTips[randomIndex];
    res.status(200).json(randomFact);
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
