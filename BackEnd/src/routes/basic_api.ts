import express from "express";
import { getClassAndSectionInfo } from "../libs/utils.js";
import Attendance from "../../Model/AttendanceModel.js";
import SessionM from "../models/session.js";
import ClassTeacherModel from "../../Model/ClassTeacher.Model.js";

const apiRouter = express.Router();


apiRouter.get("/cls_and_section_info",async (req, res) => {
    try {
        const result = await getClassAndSectionInfo(req.school!);
        const info = result.map((item) => ({cls:item.cls,sections:item.sections.map((sec)=>sec.name)}))
        res.json({success:true,info});
      } catch (err) {
        res.status(500).json({ success: false });
      }
});


apiRouter.post("/qr-scanner",async (req, res) => {
  const startOfDay = new Date(
    new Date(new Date()).setHours(0, 0, 0, 0)
  ).toISOString(); // Get the start of today
  const endOfDay = new Date(
    new Date(new Date()).setHours(23, 59, 59, 999)
  ).toISOString();
  try {

    if(!req.body.sec) return res.status(400).json({ success: false });
    const session = await SessionM.findOne({school_id:req.school!,active:true});
    if(!session) return res.status(400).json({ success: false,message:"Session not found" });
    const classTeachers = await ClassTeacherModel.find({school_id:req.school,section_id:req.body.sec,session_id:session._id,teacher_id:req.userId}).populate('subject_id');

    if(!classTeachers) return res.status(400).json({ success: false,message:"Class Teacher not found" });

    if(classTeachers.length === 0) return res.status(400).json({ success: false,message:"Class Teacher not found" });

    const isClassTeacher = classTeachers.find((item)=>item.IsClassTeacher);
    
    if(isClassTeacher){
      const result = await Attendance.findOne({school_id:req.school,date:{ $gte: new Date(startOfDay), $lte: new Date(endOfDay) },sectionId:req.body.sec});
      if(!result) return res.json({success:true,take_attendance:true});
    }
    const subjects = classTeachers.map((item:any)=>item.subject_id);
    return res.json({success:true,subjects});
  }
  catch (err) {
    res.status(500).json({ success: false });
  }
});

export { apiRouter }

