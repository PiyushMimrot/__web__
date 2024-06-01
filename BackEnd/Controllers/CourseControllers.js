import { CourseList } from "../Model/CourseListModel.js";

export const createCourseController = async (req, res) => {
  try {
    console.log(req.body);
    const CourseData = req.body;
    const course = new CourseList({ ...CourseData, school_id: req.school });
    const result = await course.save();
    res.status(200).send({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createCourseExcelController = async (req, res) => {
  const { excelData, subject_id } = req.body;
  try {
    const CourseData = excelData?.map((item) => {
      const [name, topics] = Object.entries(item)[0];
      return {
        name,
        subject_id,
        topics: topics.map((topic) => ({ topic })),
        school_id: req.school,
      };
    });
    console.log(CourseData[0]);
    const result = await CourseList.insertMany(CourseData);
    res.status(200).send({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCourseController = async (req, res) => {
  try {
    const { name, subject_id } = req.body;
    const id = req.params.id;
    const course = await CourseList.findByIdAndUpdate(
      id,
      { name, subject_id },
      { new: true }
    );
    res.status(200).send({
      status: "success",
      data: course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCourseController = async (req, res) => {
  try {
    const id = req.params.id;
    const course = await CourseList.findByIdAndUpdate(
      id,
      { $set: { isDeleted: true } }, // Update specific fields
      { new: true } // Return the updated document
    );
    // const course = await CourseList.findByIdAndDelete(id);
    res.status(200).send({
      status: "success",
      data: course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCourseController = async (req, res) => {
  try {
    const course = await CourseList.find({
      school_id: req.school,
      isDeleted: false,
    });
    res.status(200).send({
      status: "success",
      data: course,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubjectCourseController = async (req, res) => {
  try {
    const id = req.params.id;
    const course = await CourseList.find({ subject_id: id, isDeleted: false });

    if (course.length == 0) {
      res.status(200).send({
        status: "false",
        data: [],
      });
    } else {
      res.status(200).send({
        status: "success",
        data: course,
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
