import uni_class from "../../Model/Main/uni_classModelModel.js";

export const addClass = async (req, res) => {
  try {
    const newClass = new uni_class(req.body);
    const savedNewClass = await newClass.save();
    res.status(200).json(savedNewClass);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const getAllClass = async (req, res) => {
  try {
    const allClass = await uni_class.find({});
    res.status(200).json(allClass);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const getOneClass = async (req, res) => {
  try {
    const oneClass = await uni_class.findById(req.params.id);
    res.status(200).json(oneClass);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const updateClass = async (req, res) => {
  try {
    const updateClass = await uni_class.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updateClass);
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};

export const deleteClass = async (req, res) => {
  try {
    await uni_class.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: "Class deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: true, message: error.message });
  }
};
