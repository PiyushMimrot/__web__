import ClassGroupChatModel from "../../Model/Chat/ClassGroupChat.Model.js";
import ClassGroupMessageModel from "../../Model/Chat/ClassGroupMessage.Model.js";
// chat group
export const addClassGroupChat = async (req, res) => {
  try {
    const createNew = new ClassGroupChatModel({
      groupName: "class1_Science",
      members: ["659d3ef8ad57dce091cbd60b"],
      school_id: req.school,
      subject_id: "655a3fcfd4c33881adf1c2f2",
      class_id: "655a3f8ad4c33881adf1c2d9",
      section_id: "655a3f8ad4c33881adf1c2db",
      teacher_id: "655a3a0bd4c33881adf1c255",
    });
    await createNew.save();
    res.status(201).json({
      success: true,
      createNew,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const getAllClassGroupChats = async (req, res) => {
  const myId = req.userId;
  try {
    const allgroups = await ClassGroupChatModel.find({
      members: { $elemMatch: { $eq: req.userId } },
    }).populate("teacher_id", "photo");

    res.status(200).json({
      success: true,
      data: allgroups,
      myId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

// chat message of the group
export const addClassGroupMessage = async (req, res) => {
  try {
    const { groupid } = req.params;
    const isPresent = await ClassGroupChatModel.findOne({
      _id: groupid,
      members: { $elemMatch: { $eq: req.userId } },
    });
    if (!isPresent) {
      return res.status(403).json({
        success: true,
        message: "unauthorised , cannot use this group resources",
      });
    }
    function getmodeltype(usertype) {
      let type = null;
      switch (usertype) {
        case "admin":
          type = "Admin";
          break;
        case "teacher":
          type = "staffs";
          break;
        case "student":
          type = "students";
          break;
        default:
          type = null;
      }
      return type;
    }
    console.log(req.userType);
    console.log(getmodeltype(req.userType));
    let newMessage = new ClassGroupMessageModel({
      senderType: req.userType,
      senderId: req.userId,
      message: req.body.message,
      chatGroup: groupid,
      docModel: getmodeltype(req.userType),
    });

    await newMessage.save();

    // newMessage = await ClassGroupMessageModel.findById(newMessage._id).populate(
    //   "senderId",
    //   "name"
    // );

    res.status(201).json({
      success: true,
      newMessage,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "internal server  error",
    });
  }
};

export const getClassGroupMessages = async (req, res) => {
  try {
    const { groupid } = req.params;
    const isPresent = await ClassGroupChatModel.findOne({
      _id: groupid,
      members: { $elemMatch: { $eq: req.userId } },
    });
    if (!isPresent) {
      return res.status(403).json({
        success: true,
        message: "unauthorised , cannot use this group resources",
      });
    }
    const newMessage = await ClassGroupMessageModel.find({
      chatGroup: groupid,
    }).populate("senderId", "name");

    res.status(200).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "internal server  error",
    });
  }
};

export const getSpecificMessage = async (messageid) => {
  const message = await ClassGroupMessageModel.findById(messageid._id).populate(
    "senderId",
    "name"
  );
  return message;
};
