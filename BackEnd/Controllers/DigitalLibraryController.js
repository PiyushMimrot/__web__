import DigitalLibrary from "../Model/DigitalLibrary.Model.js";
import StudentTableAlignModel from "../Model/StudentTableAlignModel.js";
import ClassTeacherModel from "../Model/ClassTeacher.Model.js";
import SessionM from "../src/models/session.js";

// Add a library
// export const addDigiLibrary = async (req, res) => {
//   const { class_id, subject_id, chapter_id, topic_id, title, desc, urlLink } =
//     req.body;
//   const dataToSave = {
//     class_id,
//     subject_id,
//     chapter_id,
//     topic_id,
//     title,
//     desc,
//     urlLink,
//     school_id: req.school,
//     teacher_id: req.userId,
//   };

//   try {
//     if (req.file) {
//       const filename = req.file.filename;
//       dataToSave.filename = filename;
//     }
//     const library = new DigitalLibrary(dataToSave);
//     library.save();
//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.log(error);
//   }
// };
export const addDigiLibrary = async (req, res) => {
  try {
    console.log({ msg: req.body });
    const library = new DigitalLibrary({
      ...req.body,
      school_id: req.school,
      teacher_id: req.userId,
    });
    const saved = library.save();
    res.status(200).json(saved);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

// Get library by TeacherId
export const getDigiLibraryByTeacherId = async (req, res) => {
  try {
    const teacherId = req.userId;
    const library = await DigitalLibrary.find({
      teacher_id: teacherId,
    })
      .sort({ createdAt: -1 })
      .populate("class_id", "name")
      .populate("subject_id", "name")
      .populate("chapter_id", "name")
      .populate("teacher_id", "name");
    res.status(200).json({ status: true, library });
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const getDigiLibraryByClassId = async (req, res) => {
  const classId = req.params.id;
  try {
    const library = await DigitalLibrary.find({
      class_id: classId,
    })
      .sort({ createdAt: -1 })
      .populate("class_id", "name")
      .populate("subject_id", "name")
      .populate("chapter_id", "name")
      .populate("teacher_id", "name");
    res.status(200).json({ status: true, library });
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

// Get Recent 10 posts
export const getRecentDigiLibrary = async (req, res) => {
  try {
    DigitalLibrary.find({ school_id: req.school })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("class_id", "name")
      .populate("subject_id", "name")
      .populate("chapter_id", "name")
      .populate("teacher_id", "name")
      .exec()
      .then((posts) => {
        res.status(200).json({ posts });
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

//Get Most 10 views
export const getMostViewsDigiLibrary = async (req, res) => {
  try {
    DigitalLibrary.find({ school_id: req.school })
      .sort({ views: -1 })
      .limit(3)
      .populate("class_id", "name")
      .populate("subject_id", "name")
      .populate("chapter_id", "name")
      .populate("teacher_id", "name")
      .exec()
      .then((posts) => {
        res.status(200).json({ posts });
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const getDigiLibraryByTopic = async (req, res) => {
  try {
    const topicId = req.params.id;
    const library = await DigitalLibrary.find({ topic_id: topicId });
    res.status(200).json(library);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const updateDigiLibrary = async (req, res) => {
  try {
    const libraryID = req.params.id;
    const library = await DigitalLibrary.findByIdAndUpdate(
      libraryID,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json({ library, success: true });
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const deleteDigiLibrary = async (req, res) => {
  try {
    const libraryID = req.params.id;
    await DigitalLibrary.findByIdAndDelete(libraryID);
    res
      .status(200)
      .json({ status: "Digital Library deleted successfully", success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDigitalLibrary = async (req, res) => {
  try {
    const library = await DigitalLibrary.find({
      school_id: req.school,
    })
      .sort({ createdAt: -1 })
      .populate("class_id", "name")
      .populate("subject_id", "name")
      .populate("chapter_id", "name")
      .populate("teacher_id", "name")
      .exec()
      .then((posts) => {
        res.status(200).json({ posts, myId: req.userId });
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};
