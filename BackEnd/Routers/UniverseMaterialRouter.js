import { UniverseMaterialModel } from "../Model/UniverseMaterial.Model.js";
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { UPLOAD_PATH } from "../config.js";
import fs from "fs";

const universeMaterialRouter = express.Router();

const __dirname = dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, express.static(`${UPLOAD_PATH}/universalmaterial`));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
// Initialize multer
const upload = multer({ storage: storage });

// Create operation with file upload
universeMaterialRouter.post(
  "/materials",
  upload.single("doc_path"),
  async (req, res) => {
    try {
      const { topic, short_desc, date, class_id, subject_id, chapter } =
        req.body;
      //(short_desc, date, status)
      const material = new UniverseMaterialModel({
        topic,
        short_desc,
        date,
        class_id,
        subject_id,
        chapter,
        doc_path: req.file ? req.file.path : null, // Set doc_path if a file was uploaded
      });

      await material.save();
      res.status(201).json(material);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Read operations
universeMaterialRouter.get("/materials", async (req, res) => {
  try {
    const materials = await UniverseMaterialModel.find()
      .populate("class_id")
      .populate("subject_id");
    res.json(materials);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

universeMaterialRouter.get("/materials/:id", async (req, res) => {
  try {
    const material = await UniverseMaterialModel.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update operation
universeMaterialRouter.put("/materials/:id", async (req, res) => {
  try {
    const { topic, short_desc, date, status } = req.body;
    const newData = {
      topic,
      short_desc,
      date,
      status,
    };

    if (req.file) {
      newData.doc_path = req.file.path;
    }

    const updatedMaterial = await UniverseMaterialModel.findByIdAndUpdate(
      req.params.id,
      newData,
      { new: true }
    );

    if (!updatedMaterial) {
      return res.status(404).json({ error: "Material not found" });
    }

    res.json(updatedMaterial);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete operation
universeMaterialRouter.delete("/materials/:id", async (req, res) => {
  try {
    const deletedMaterial = await UniverseMaterialModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedMaterial) {
      return res.status(404).json({ error: "Material not found" });
    }
    res.json(deletedMaterial);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const uploadDir = path.join(__dirname, "..", "uploads");

universeMaterialRouter.get("/download/:filename", (req, res) => {
  const { filename } = req.params;

  const filePath = path.join(uploadDir, filename);

  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Set the appropriate headers for the response
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", "application/octet-stream");

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } else {
    res.status(404).json({ error: "File not found." });
  }
});

export { universeMaterialRouter };
