// Configure Multer for handling file uploads
import multer from "multer";
import path, { dirname } from "path";
import express from "express";
import { fileURLToPath } from "url";
import fs from "fs";
import { Material } from "./../Model/Materiallist.Model.js";
import Authorization from "../src/auth/Authorization.js";
import { UPLOAD_PATH } from "../config.js";
const router = express.Router();

const storage = multer.diskStorage({
  destination: `${UPLOAD_PATH}/materiallist`,
  filename: function (req, file, callback) {
    callback(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000000000000 }, // Limit file size to 10MB (adjust as needed)
}).single("doc_path");

// Middleware to serve uploaded files statically
router.use("/materiallist", express.static(`${UPLOAD_PATH}/materiallist`));
router.use(express.json());

router.post("/", Authorization(["admin", "teacher"]), (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: "Error uploading file." });
    }

    const {
      short_desc,
      subject_id,
      course_id,
      staff_id,
      class_id,
      date,
      status,
    } = req.body;

    const newMaterial = new Material({
      short_desc,
      subject_id,
      course_id,
      doc_path: req.file ? req.file.filename : null, // Save the file path
      staff_id,
      class_id,
      date,
      status,
    });

    try {
      const savedMaterial = await newMaterial.save();
      res.status(201).json(savedMaterial);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
});

// Route to fetch all materials
router.get(
  "/",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      const materials = await Material.find()
        .populate("subject_id")
        .populate("class_id")
        .populate("course_id")
        .populate("staff_id");
      res.json(materials);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Route to fetch a specific material by ID
router.get(
  "/:id",
  Authorization(["admin", "teacher", "student"]),
  async (req, res) => {
    try {
      const material = await Material.findById(req.params.id);
      if (!material) {
        return res.status(404).json({ error: "Material not found" });
      }
      res.json(material);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
router.delete("/:id", Authorization(["admin", "teacher"]), async (req, res) => {
  try {
    const material = await Material.findByIdAndDelete(req.params.id);
    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.get(
  "/materials/:id",
  Authorization(["admin", "teacher"]),
  async (req, res) => {
    try {
      const material = await Material.find(req.params.id);
      if (!material) {
        return res.status(404).json({ error: "Material not found" });
      }
      res.json(material);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);
// Add this route after defining the Material model and Multer configuration
router.put("/:id", Authorization(["admin", "teacher"]), async (req, res) => {
  //(req.body)
  try {
    const material = await Material.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }
    res.json(material);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to download a specific document by ID// Route to download a specific document by filename

const __dirname = dirname(fileURLToPath(import.meta.url));

const uploadDir = path.join(__dirname, "..", "uploads");

router.get("/download/:filename", (req, res) => {
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

export default router;
