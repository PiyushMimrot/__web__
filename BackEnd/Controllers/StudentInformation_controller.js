import Students from "../src/models/student.js";
import StudentTableAlignModel from "../Model/StudentTableAlignModel.js";
import { generateUniqueStudentId } from "../src/libs/utils.js";
import path from "path";
import parent from "../src/models/parent.js";

export const StudentInformationController = async (req, res) => {
  // MULTER
  try {
    const photo = req.files?.photo;
    const adherCard = req.files?.adherCard;
    let studentId = await generateUniqueStudentId();
    const studentInfo = new Students({
      ...req.body, // Use req.body for other form fields
      studentId,
      school_id: req.school,
    });
    if (photo) {
      studentInfo.photo = path.basename(photo[0].path);
    }
    if (adherCard) {
      studentInfo.adherCard = path.basename(adherCard[0].path);
    }
    const studentD = await studentInfo.save();
    

    res.status(200).json(studentD);
  } catch (error) {
    // try {
    //   const { photo, adherCard } = req.files;
    //   console.log({ dat: { photo, adherCard } });
    //   let studentId = await  generateUniqueStudentId();
    //   // console.log("g", studentId);
    //   const studentInfo = new Students({
    //     ...req.fields,
    //     ...req.files,
    //     studentId,
    //     school_id: req.school,
    //   });

    //   if (photo) {
    //     studentInfo.photo.data = fs.readFileSync(photo.path);
    //     studentInfo.photo.contentType = photo.type;
    //   }

    //   if (adherCard) {
    //     studentInfo.adherCard.data = fs.readFileSync(adherCard.path);
    //     studentInfo.adherCard.contentType = adherCard.type;
    //   }

    //   const studentD = await studentInfo.save();

    //   res.status(200).json(studentD);
    // }
    console.error(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while registering the student.",
    });
  }
};

export const getStudentInfo = async (req, res) => {
  try {
    const { id, section, class_id } = req.body;
    console.log(id, section, class_id);
    let data = [];
    if (id) {
      data = await Students.find({ _id: id });
    } else if (class_id && section) {
      data = await Students.find({ class_id, section });
    } else if (class_id) {
      data = await Students.find({ class_id });
    } else data = await Students.find();
    res.json(data);
    console.log(data);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getInfoViaToken = async (req, res) => {
  try {
    const id = req.userId;
    console.log(id);
    const result = await Students.findById(id);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const UpdateStudentInformation = async (req, res) => {
  try {
    const studentD = await Students.findById(req.params.id);
    const id = req.params.id;

    const student = await Students.findByIdAndUpdate(
      id,
      {
        ...req.body,
        photo: studentD.photo,
        adherCard: studentD.adherCard,
      },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Student Updated Successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, number } = req.body;
    const updateStudent = await Students.findByIdAndUpdate(
      id,
      { name, number }, //add photo also
      { new: true }
    );
    res.status(200).json({ status: "Success", data: updateStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStudentViaToken = async (req, res) => {
  try {
    const id = req.userId;
    const { name, number } = req.body;
    const updateStudent = await Students.findByIdAndUpdate(
      id,
      { name, number }, //add photo also
      { new: true }
    );
    res.status(200).json({ status: "Success", data: updateStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const DeleteStudent = async (req, res) => {
  try {
    const id = req.params.id;
    const student = await Students.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } }, // Update specific fields
      { new: true } // Return the updated document
    );
    const data3 = await parent.updateOne(
      { studentid: id },
      { isDeleted: true }
    ); // Set isDeleted to true

    const studentDeleted = await StudentTableAlignModel.updateOne(
      {
        studentid: id 
      },
      { isDeleted: true }
    )
    res.send({ message: "Student deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const FetchingStudentInformationByID = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Students.findById(id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const FetchingStudentInformationBySection = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Students.find({ section_id: id });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const FetchingStudentInformationByClass = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await Students.find({ class_id: id });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentInformation = async (req, res) => {
  try {
    const student = await Students.find({ school_id: req.school }).populate(
      "class_id"
    );

    res.status(200).send({
      status: "success",
      data: student,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
