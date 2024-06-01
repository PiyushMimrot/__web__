import Schoolinformation from "../src/models/school.js";
export const Schoolinfocontroller = async (req, res) => {
  try {
    const { schoolname, location, schoolregnumber, schooladmin } = req.body;
    const Schoolinfo = await new Schoolinformation({
      schoolname,
      location,
      schoolregnumber,
      schooladmin,
    }).save();

    res.status(200).send({
      success: true,
      message: "School information is successfully registered.",
      data: Schoolinfo,
    });

    console.log(Schoolinfo);
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while registering the School.",
    });
  }
};

export const addSchoolInfo = async (req,res)=>{
  try {
    const {name, address, phone, email, password, admins} = req.body
    console.log(req.body)
    const schoolInfo = new Schoolinformation(req.body)
    const saved = await schoolInfo.save();
    res.status(200).json(saved)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error Please try again" });
  }
}

export const FetchingSchoolInformation = async (req, res) => {
  try {
    const data = await Schoolinformation.find().populate("schooladmin");
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error Please try again" });
  }
};

export const getBySchoolId = async (req, res) => {
  try {
    const data = await Schoolinformation.findById(req.params.id);
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error Please try again" });
  }
};

export const updateSchoolInfo = async (req, res) => {
  try {
    const id = req.school;
    const { name, address, phone, email, logo } = req.body; 
    const update = await Schoolinformation.findByIdAndUpdate(
      id,
      { name, address, phone, email, logo },
      { new: true }
    );
    res.status(200).json({ status: "success", data: update });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error Please try again" });
  }
};
