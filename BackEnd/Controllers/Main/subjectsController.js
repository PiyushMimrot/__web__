import uni_subjects from "../../Model/Main/uni_subjectsModel.js";

export const addSubjects = async (req, res) => {
  try {
    const newSubject = new uni_subjects(req.body);
    const savedNewSubjects = await newSubject.save();
    res.status(200).json(savedNewSubjects);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const getSubByClass = async (req, res) => {
  try {
    const classID = req.params.id;
    const getSub = await uni_subjects.find({ class_id: classID });
    res.status(200).json(getSub);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const updateSub = async (req, res) => {
  try {
    const subID = req.params.id;
    const update = await uni_subjects.findByIdAndUpdate(
      subID,
      { $set: { subject_name: req.body.subject_name } },
      { new: true }
    );
    res.status(200).json(update);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const deleteSub = async (req, res) => {
  try {
    const subID = req.params.id;
    await uni_subjects.findByIdAndDelete(subID);
    res.status(200).json({ status: "subject deleted." });
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};
