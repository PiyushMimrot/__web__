import Parents from "../src/models/parent.js";

export const Parentcontroller = async (req, res) => {
  try {
    const { studentid, fathername, mothername, phoneNumber } = req.body;

    const ParentInfo = new Parents({
      studentid,
      fathername,
      mothername,
      phoneNumber,
      school_id: req.school,
    });

    await ParentInfo.save();

    res.status(200).json({
      success: true,
      message: "Parent is successfully registered.",
    });

    console.log(ParentInfo);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchParentById = async (req, res) => {
  try {
    const id = req.userId;
    const parent = await Parents.findById(id);
    res.status(200).json({
      success: true,
      data: parent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchParentByStudentid = async (req, res) => {
  try {
    const studentId = req.params.studentid;
    const parent = await Parents.find({ studentid: studentId });
    res.status(200).json({
      success: true,
      data: parent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateParent = async (req, res) => {
  try {
    // const id = req.params.id
    const id = req.body._id;
    const { fathername, mothername, phoneNumber } = req.body;
    const update = await Parents.findByIdAndUpdate(
      id,
      {
        fathername: fathername,
        mothername: mothername,
        phoneNumber: phoneNumber,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      data: update,
    });
    console.log(update);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateParentViaToken = async (req, res) => {
  try {
    const id = req.userId;
    const { fathername, mothername, phoneNumber } = req.body;
    const update = await Parents.findByIdAndUpdate(
      id,
      {
        fathername: fathername,
        mothername: mothername,
        phoneNumber: phoneNumber,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      data: update,
    });
    console.log(update);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const ParentDetail = async (req, res) => {
  try {
    const data = await Parents.find({ studentid: req.userId });
    res.json(data);
  } catch {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const GetParents = async (req, res) => {
  try {
    const data = await Parents.find(req.params.id);
    res.json(data);
  } catch {
    res.status(500).json({ success: false, message: error.message });
  }
};
