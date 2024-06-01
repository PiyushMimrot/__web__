import { Router } from 'express';
import Authorization from '../auth/Authorization.js';
import Students from '../models/student.js';
import { generateUniqueStudentId, getClassAndSectionInfo } from '../libs/utils.js';
import path from 'path';
import multer from "multer";
import { UPLOAD_PATH } from '../../config.js';
import {v4} from 'uuid';
import Parents from '../models/parent.js';
import StudentTableAlignModel from '../../Model/StudentTableAlignModel.js';
import SessionM from '../models/session.js';
import { Types } from 'mongoose';
import Classes from '../../Model/Class&Section/Class.Model.js';
import SectionM from '../../Model/Class&Section/SectionModel.js';


const MandatoryStudentFields = ["name", "number", "cls", "sec", "fatherName", "motherName", "parentNumber","dob","gender"];

const studentRouter = Router();

const storage = multer.diskStorage({
  destination: (_, file, cb) => {
    const uploadDir =
      file.fieldname === "photo"
        ? `${UPLOAD_PATH}/photo`
        : `${UPLOAD_PATH}/aadhar`;
    cb(null, uploadDir);
  },
  filename: (_, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, v4() + "." + ext);
  },
});
const upload = multer({ storage });



studentRouter.post("/add_student",
        Authorization(["admin", "Accountant", "teacher"]),
        upload.fields([{ name: "photo", maxCount: 1 },{ name: "adherCard", maxCount: 1 }])
      ,async (req, res) => {
    try {

      // validate all mandatory fields
      if(!MandatoryStudentFields.every((field)=>req.body[field])){
        res.status(400).json({ success: false, msg: "Please fill all the mandatory fields!" });
        return
      }

      // create student object and add it
      let studentId = await generateUniqueStudentId();
      const studentInfo = new Students({
        ...req.body, 
        studentId,
        school_id: req.school,
      });
      const photo = req.files?.photo;
      const adherCard = req.files?.adherCard;
      if (photo) {
        studentInfo.photo = path.basename(photo[0].path);
      }
      if (adherCard) {
        studentInfo.adherCard = path.basename(adherCard[0].path);
      }
      const resp= await studentInfo.save()

      // create parent object and add it
      const {  fatherName, motherName, parentNumber } = req.body;
      const ParentInfo = new Parents({
        studentid: resp._id,
        fathername:fatherName,
        mothername:motherName,
        phoneNumber:parentNumber,
        school_id: req.school,
      });
      await ParentInfo.save();


      // create student align object and add it
      const { cls, sec } = req.body;

      const Class_details =await  Classes.findOne({school_id: req.school,isDeleted:false,name:cls});
      const Class_id = Class_details?._id;
      const Section_details = await SectionM.findOne({school_id: req.school,isDeleted:false,class_id:Class_details?._id,name:sec});
      const section_id = Section_details?._id;

      const session = await SessionM.findOne({school_id: req.school,active: true});
      const studentAlignInfo = new StudentTableAlignModel({
        studentid:resp._id,
        Class_id,
        section_id,
        session_id:session?._id,
        school_id:req.school,
        status:"1"
      });
  
      const alignInfo = await studentAlignInfo.save();

      res.status(200).json({ success: true, student: resp,alignInfo});
    } catch (error) {
        res.status(500).json({ success: false ,msg:"Failed to add student" });
    }
});



studentRouter.post("/add_multiple_students",Authorization(["admin", "Accountant", "teacher"]),async (req, res) => {
    try {
        // validate all mandatory fields
        for(const student of req.body){
          if(!MandatoryStudentFields.every((field)=>student[field])){
            res.status(400).json({ success: false, msg: "All mandatory fields are not present!" });
            return
          }
        }

        for(const student of req.body){
          student.studentId = await generateUniqueStudentId();
          student.school_id = req.school;
        }

        const result = await Students.insertMany(req.body);

        
        // return res.status(200).json({ success: true, result });

        const session = await SessionM.findOne({school_id: req.school,active: true});
        const classAndSectionInfo = await getClassAndSectionInfo(req.school!);
        const parents=[]
        const alignInfo=[]

        const failedAlignInfo = []

        for(let i=0;i<req.body.length ; i++){
          const {  fatherName, motherName, parentNumber,cls,sec } = req.body[i];
          const studentId = result[i]._id;
          const ParentInfo = new Parents({
            studentid: studentId,
            fathername:fatherName,
            mothername:motherName,
            phoneNumber:parentNumber,
            school_id: req.school,
          });
          parents.push(ParentInfo)

          let Class_id = null;
          let section_id = null;
          loop:for(const item of classAndSectionInfo){
            if(item.cls.trim().toLowerCase()==cls.toString().trim().toLowerCase()){
              Class_id = item.cls_id;
              for(const section of item.sections){
                if(section.name.trim().toLowerCase()==sec.toString().trim().toLowerCase()){
                  section_id = section._id;
                  continue loop
                }
              }
            }
          }

          if(!Class_id || !section_id){
            failedAlignInfo.push({studentId,cls,sec})
            continue
          }
         
          const studentAlignInfo = new StudentTableAlignModel({
            studentid:studentId,
            Class_id,
            section_id,
            session_id:session?._id,
            school_id:req.school,
            status:"1"
          });
          alignInfo.push(studentAlignInfo)
        }
        await Parents.insertMany(parents);
        await StudentTableAlignModel.insertMany(alignInfo);
        return res.status(200).json({ success: true, result,failedAlignInfo });
      }
      catch (error) {
        console.log(error)
        res.json({ success: false });
      }
    }
);




studentRouter.get("/get_all_students",async (req, res) => {
  try{
    const students = await Students.aggregate([
      {$match:{school_id:new Types.ObjectId(req.school),isDeleted:false}},
      {$lookup:{from:"studentaligninfos",localField:"_id",foreignField:"studentid",as:"align"}},
      {$unwind:{path:"$align",preserveNullAndEmptyArrays:true}},
      {$lookup:{from:"classes",localField:"align.Class_id",foreignField:"_id",as:"cls"}},
      {$unwind:{path:"$cls",preserveNullAndEmptyArrays:true}},
      {$lookup:{from:"sections",localField:"align.section_id",foreignField:"_id",as:"sec"}},
      {$unwind:{path:"$sec",preserveNullAndEmptyArrays:true}},
      {$project:{_id:0,id:"$_id",cls:"$cls.name",sec:"$sec.name",sectionId:"$sec._id",name:1,number:1,studentId:1,photo:1,dob:1,nationality:1,gender:1,religion:1}}
    ]).exec()
    res.json({ success: true, students });
  }
  catch (error) {
    console.log(error)
    res.json({ success: false });
  } 
})

export default studentRouter;

