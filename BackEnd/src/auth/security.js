import jwt from "jsonwebtoken";
import StaffModel from "../models/staff.js";
import Students from "../models/student.js";
import { InstilUser } from "../../config.js";

export function VerifyJWT(req, res, next) {
  const token = req.cookies.token;

  if (!token)
    return res
      .clearCookie("token")
      .status(403)
      .send({ success: false, error: "No token provided." });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err)
      return res
        .status(500)
        .send({ success: false, error: "Failed to authenticate token." });
    req.userId = decoded.id;
    req.userType = decoded.type;
    req.school = decoded.school;
    req.phoneNumber = decoded.phoneNumber;
    console.log(`Request from :${req.phoneNumber} type=${req.userType}`);
    next();
  });
}

export function GenerateJWT(phoneNumber, type, school, id, studentid = null) {
  let token = null;
  if (type === "supperadmin") {
    token = jwt.sign({ phoneNumber, type, id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "30 days",
    });
  } else if (type === "parent") {
    token = jwt.sign(
      { phoneNumber, type, school, id: studentid, parentId: id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30 days" }
    );
  } else {
    token = jwt.sign(
      { phoneNumber, type, school, id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30 days" }
    );
  }
  return token;
}

export function StudentAccess() {
  return async (req, res, next) => {
    const userRole = req.userType;
    const userId = req.userId;

    const filename = req.url.split("/").pop();
    if (userRole === "admin" || userRole === "teacher") {
      next();
    } else if (userRole === "student") {
      const student = await Students.findById(userId);
      if (student.photo === filename || student.adherCard === filename) {
        next();
      } else {
        res.status(403).json({
          success: false,
          code: 403,
          message: "Donot try to access this route",
        });
      }
    } else {
      res.status(403).json({
        success: false,
        code: 403,
        message: "cannot access this route",
      });
    }
  };
}

export function StaffAccess() {
  return async (req, res, next) => {
    const userRole = req.userType;
    const userId = req.userId;

    const filename = req.url.split("/").pop();
    if (userRole === InstilUser.Admin) {
      next();
    } else if (userRole === "teacher") {
      const staff = await StaffModel.findById(userId);
      if (
        staff.photo === filename ||
        staff.adherCard === filename ||
        staff.panCard === filename
      ) {
        next();
      } else {
        res.status(403).json({
          success: false,
          code: 403,
          message: "Donot try to access this route",
        });
      }
    } else {
      res.status(403).json({
        success: false,
        code: 403,
        message: "Cannot access this route",
      });
    }
  };
}
