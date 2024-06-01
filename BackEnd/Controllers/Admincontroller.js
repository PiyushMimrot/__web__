import Admin from "../src/models/admin.js";
import Schools from "../src/models/school.js";
export const Admincontroller = async (req, res) => {
  try {
    const { name, phoneNumber, email } = req.body;
    const AdminInfo = await new Admin({
      name,
      phoneNumber,
      email,
    }).save();

    res.status(200).send({
      success: true,
      message: "Admin is successfully registered.",
      data: AdminInfo,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while registering the Admin.",
    });
  }
};

export const FetchingAdminInformation = async (req, res) => {
  try {
    const id = req.userId;
    const data = await Admin.findById(id);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error Please try again" });
  }
};

export const updateAdminInformation = async (req, res) => {
  try {
    const adminID = req.userId;
    const { name, phoneNumber, email } = req.body;
    const updateAdmin = await Admin.findByIdAndUpdate(
      adminID,
      {
        name,
        phoneNumber,
        email,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Admin is successfully Updated.",
      data: updateAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the information of Admin.",
    });
  }
};

export const FetchingAdminBySchool = async (req, res) => {
  try {
    const data = await Schools.findById(req.school)
      .select("name admins")
      .populate("admins", "name");

    // const data = await Admin.find();

    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error Please try again" });
  }
};
