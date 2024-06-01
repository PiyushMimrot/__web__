import express from "express";
import dotenv from "dotenv";
import StaffModel from "../models/staff.js";
import Admin from "../models/admin.js";
import { GenerateJWT } from "../auth/security.js";
import ParentsModel from "../models/parent.js";
import StudentModel from "../models/student.js";
import Schools from "../models/school.js";
import { InstilUser } from "../../config.js";
import SupperAdmin from "../models/supperadmin.js";
import { LoginLogoutLogs } from "../models/logs.js";
dotenv.config();

// const client = new twilio(process.env.TWILIO_AC_SID, process.env.TWILIO_AUTH_TOKEN);
const loginRouter = express.Router();

const LoginError ={
  INVALID_PHONE_NUMBER:100,
  INVALID_OTP:102,
  INVALID_PIN:103,
  INVALID_CREDS:104,
  SERVER_ERROR:105
} as const


loginRouter.post("/send-otp", async (req, res) => {
  console.log(req.body)
  // Code for sending OTP to the provided phone number
  // client.verify.v2.services(process.env.TWILIO_VERIFY_SID)
  // .verifications.create({to: `+91${phoneNumber}`, channel: 'sms'})
  // .then(verification =>{
  //     res.json({ success: true})
  // })
  // .catch(error => {
  //     res.json({ success: false,error:'Unable to send OTP'})
  //     console.log(error)
  // });

  let { phoneNumber } = req.body;
  if (!phoneNumber || phoneNumber.length !== 10) {
      res.status(400).json({ success: false, error: "Invalid Phone Number",errorCode:LoginError.INVALID_PHONE_NUMBER });
      return;
  }


  try {
    let result = await Promise.all(
      [
        Admin.find({ phoneNumber }),
        StaffModel.find({ phone: phoneNumber,isDeleted:false }),
        StudentModel.find({ number: phoneNumber,isDeleted:false }),
        ParentsModel.find({ phoneNumber,isDeleted:false })
      ]
      .map((userType:any) => userType.select('name status fathername').populate('school_id', 'schoolCode')))

    let allUsers = []
    for(let i = 0; i < result.length; i++) {
      const type = ['admin', 'teacher', 'student', 'parent'][i]
      allUsers.push(...result[i].map((item:any) => ({
        _id: item._id,
        name: item.name||item.fathername,
        school: item.school_id,
        type ,
        verified: item.status || false,
      })))
    }
    if (allUsers.length === 1) {
      res.status(200).json({
        success: true,
        allUsers: null,
        singleUser: { _id: allUsers[0]._id, type: allUsers[0].type },
        verified: allUsers[0].verified,
      });
    }else {
      res.status(200).json({
        success: true,
        allUsers,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to login" });
  }
});


loginRouter.post("/verify-otp", async (req, res) => {

  let { userId, type, pin, otpCode } = req.body;
  let userData = null;
  if (userId === "" || type === "" || pin === "" || otpCode.length !== 5) {
    res.status(400).json({ success: false, error: "required the details",errorCode:LoginError.INVALID_CREDS });
    return;
  }

  try {
    

    // otp verifying  function needed here
    if (otpCode !== "12345") {
      res.status(400).json({
        success: false,
        message: "otp incorrect",
      });
      return;
    }

    let ADMIN_SCHOOL = null;
    if (type === "admin") {
      ADMIN_SCHOOL = await Schools.findOne(
        { admins: { $in: userId } },
        { _id: 1 }
      );
      if (ADMIN_SCHOOL) {
        userData = await Admin.findByIdAndUpdate(
          userId,
          { status: true, pin },
          { new: true }
        );
      } else {
        return res.status(404).json({
          success: false,
          code: 404,
          message: "your not not admin to any school",
        });
      }
    } else if (type === "teacher") {
      userData = await StaffModel.findByIdAndUpdate(
        userId,
        { status: true, pin },
        { new: true }
      ).populate("staff_type","name");
    } else if (type === "parent") {
      userData = await ParentsModel.findByIdAndUpdate(
        userId,
        { status: true, pin },
        { new: true }
      );
    } else if (type === "student") {
      userData = await StudentModel.findByIdAndUpdate(
        userId,
        { status: true, pin },
        { new: true }
      );
    } else {
     return res
        .status(404)
        .json({ success: false, code: 404, message: "user type not found" });
    }

    let token = null;
    console.log(userData);
    userData = userData?.toObject();
    if (type === "admin") {
      token = GenerateJWT(
        userData.phoneNumber,
        type,
        ADMIN_SCHOOL?._id,
        userData._id
      );
    } else if (type === "parent") {
      token = GenerateJWT(
        userData.phoneNumber,
        type,
        userData.school_id,
        userData._id,
        userData.studentid
      );
    } else if(type==="teacher"){
      // dynamic future purpose
      // type = userData.staff_type.name; 
      console.log("here")
      console.log(userData);
      
      type = userData.staff_type.name ==="Accountant"? "Accountant":type;
    
      token = GenerateJWT(
        userData.phone,
        type,
        userData.school_id,
        userData._id
      );
    } 
    else {
      token = GenerateJWT(
        userData.phoneNumber || userData.phone,
        type,
        userData.school_id,
        userData._id
      );
    }
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        expires: new Date(Date.now() + 9000000),
      })
      .status(200)
      .json({ success: true, type });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Unexpected error occured" });
  }
});



loginRouter.post("/verify-pin", async (req, res) => {
  let { userId, type, pin } = req.body;
  let userData = null;
  if (!(userId && type && pin)){
    res.status(400).json({ success: false, error: "req the details",errorCode:LoginError.INVALID_CREDS });
    return;
  }

  try {

    switch (type) {
      case InstilUser.Admin:
        userData = await Admin.findOne({ _id: userId, pin });break;
      case InstilUser.Teacher:
        userData = await StaffModel.findOne({ _id: userId, pin }).populate("staff_type","name");break;
      case InstilUser.Parent:
        userData = await ParentsModel.findOne({ _id: userId, pin: pin });break;
      case InstilUser.Student:
        userData = await StudentModel.findOne({ _id: userId, pin: pin });break;
      default:
        res.status(404).json({ success: false, code: 404, message: "user type not found",errorCode:LoginError.INVALID_CREDS });
        return;
    }

    let token = null;
    userData = userData?.toObject();
    if(!userData){
      res.status(400).json({ success: false, error: "Invalid pin",errorCode:LoginError.INVALID_PIN });
      return;
    }

    if (userData.status) {
      if (type === "admin") {
        const school = await Schools.findOne(
          { admins: { $in: userData._id } },
          { _id: 1 }
        );
        token = GenerateJWT(
          userData.phoneNumber,
          type,
          school?._id,
          userData._id
        );
      } else if (type === "parent") {
        token = GenerateJWT(
          userData.phoneNumber,
          type,
          userData.school_id,
          userData._id,
          userData.studentid
        );
      }
      else if(type==="teacher"){
        // dynamic future purpose
        // type = userData.staff_type.name; 
        console.log("here")
        console.log(userData);
        
        type = userData.staff_type.name ==="Accountant"? "Accountant":type;
      
        token = GenerateJWT(
          userData.phone,
          type,
          userData.school_id,
          userData._id
        );
      }
      else {
        token = GenerateJWT(
          userData.phoneNumber || userData.number,
          type,
          userData.school_id,
          userData._id
        );
      }

      console.log(type);
      res
        .cookie("token", token, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
          expires: new Date(Date.now() + 9000000),
        })
        .status(200)
        .json({ success: true, type ,name:userData?.name, photo:userData?.photo});
      LoginLogoutLogs.create({ user_id: userId, time_of_event: new Date(), event: "login" });
    }
    else {
      res.status(404).json({
        success: false,
        code: 400,
        message: "verify the otp please",
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Unable to verify pin",errorCode:LoginError.SERVER_ERROR });
  }
});

loginRouter.post("/supperadmin", async (req, res) => {
  try {
    const { number, pin } = req.body;
    let userData = await SupperAdmin.findOne({ number, pin, status: true });
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "supper admin not found" });
    }

    let token = GenerateJWT(userData.number, "supperadmin", null, userData._id);

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        expires: new Date(Date.now() + 9000000),
      })
      .status(200)
      .json({ success: true, type: "supperadmin" });
  } catch (error) {
    res.status(500).json({ success: false, message: "internal server error" });
  }
});

export default loginRouter;












// _______Latest change for mobile. Migrate to this code in the web also_________________________________________________________________________

loginRouter.post("/send-otp2", async (req, res) => {
  console.log(req.body)
  // Code for sending OTP to the provided phone number
  // client.verify.v2.services(process.env.TWILIO_VERIFY_SID)
  // .verifications.create({to: `+91${phoneNumber}`, channel: 'sms'})
  // .then(verification =>{
  //     res.json({ success: true})
  // })
  // .catch(error => {
  //     res.json({ success: false,error:'Unable to send OTP'})
  //     console.log(error)
  // });

  let { phoneNumber } = req.body;
  if (!phoneNumber || phoneNumber.length !== 10) {
      res.status(400).json({ success: false, error: "Invalid Phone Number",errorCode:LoginError.INVALID_PHONE_NUMBER });
      return;
  }


  try {
    let result = await Promise.all(
      [
        Admin.find({ phoneNumber }),
        StaffModel.find({ phone: phoneNumber,isDeleted:false }),
        StudentModel.find({ number: phoneNumber,isDeleted:false }),
        ParentsModel.find({ phoneNumber,isDeleted:false })
      ]
      .map((userType:any) => userType.select('name status fathername').populate('school_id', 'schoolCode')))

    let users = []
    for(let i = 0; i < result.length; i++) {
      const type = ['admin', 'teacher', 'student', 'parent'][i]
      users.push(...result[i].map((item:any) => ({
        _id: item._id,
        name: item.name||item.fathername,
        school: item.school_id,
        type ,
        verified: item.status || false,
      })))
    }
    res.send({ success: true, users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to login" });
  }
});





loginRouter.post("/verify-otp2", async (req, res) => {

  let { type, otp ,userId } = req.body;
  let userData = null;
  if (userId === "" || type === ""  || otp.length !== 5) {
    res.status(400).json({ success: false, error: "required the details",errorCode:LoginError.INVALID_CREDS });
    return;
  }
  try {
    // otp verifying  function needed here
    if (otp !== "12345") {
      res.status(400).json({
        success: false,
        message: "otp incorrect",
        errorCode:LoginError.INVALID_OTP
      });
      return
    }

    let userData;
    switch (type) {
      case InstilUser.Admin:
        userData = await Admin.findOne({ _id: userId});break;
      case InstilUser.Teacher:
        userData = await StaffModel.findOne({ _id: userId }).populate("staff_type","name");break;
      case InstilUser.Parent:
        userData = await ParentsModel.findOne({ _id: userId });break;
      case InstilUser.Student:
        userData = await StudentModel.findOne({ _id: userId });break;
    }

    if(!userData){
      res.status(404).json({ success: false, code: 404, message: "user type not found",errorCode:LoginError.INVALID_CREDS });
      return
    }

    userData = userData.toObject()

    let token = GenerateJWT(
      userData.phoneNumber??userData.phone,
      type,
      userData.school_id,
      userData._id
    );

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        expires: new Date(Date.now() + 9000000),
      })
      .status(200)
      .json({ success: true, type });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Unexpected error occured",errorCode:LoginError.SERVER_ERROR });
  }
});