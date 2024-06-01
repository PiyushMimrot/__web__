import { log } from "console";
import Document from "../Model/Template/TemplateDocs.js";
import Staffs from "../src/models/staff.js";
import Students from "../src/models/student.js";

export const createDocument = async (req, res) => {
  try {
    const newDocument = new Document({
      ...req.body,
      school_id: req.school,
    });

    await newDocument.save();
    console.log(req.body);

    res.status(200).json({ success: true, message: "Document created" });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "Internal error",
      error: error.message,
    });
  }
};

  export const getDocuments = async (req, res) => {
    try {
      let result = [];
      const documents = await Document.find({
        school_id: req.school,
        // isDeleted: false,
      }).populate("template_id");
      for (let i = 0; i < documents?.length; i++) {
        if (documents[i]?.userType === "student") {
          const a = await Students.findById(documents[i].user_id).select("name");
          result.push({ document: documents[i], userData: a });
        }
        if (documents[i]?.userType === "staff") {
          const a = await Staffs.findById(documents[i].user_id).select("name");
          result.push({ document: documents[i], userData: a });
        }
      }
      res.status(200).json({ success: true, resul });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
};

export const updateDocument = async (req, res) => {
  const updatedDocument = req.body;

  try {
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      updatedDocument,
      { new: true }
    );
    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: "document not found" });
    } else {
      res
        .status(200)
        .json({ success: true, message: "document updated", document });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Internal server error" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);

    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: "document not found" });
    } else {
      res.status(200).json({ success: true, message: "document deleted" });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, message: "Internal server error" });
  }
};
