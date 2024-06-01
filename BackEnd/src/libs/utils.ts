import { Types } from "mongoose";
import SectionM from "../../Model/Class&Section/SectionModel.js";
import Students from "../models/student.js";


export function GetTodayDate() {
    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    return currentDate;
}



export async function generateUniqueStudentId() {
    while (true) {
      const candidateNumber = Math.floor(1000000 + Math.random() * 9000000); 
      try {
        const existingNumber = await Students.find({ studentId: candidateNumber });
        if (!existingNumber.length) {
          return candidateNumber;
        }else{
            generateUniqueStudentId()
        }
      } catch (error) {
        console.error('Error checking for unique number:', error);
        throw error;
      }
    }
}


type ClassAndSectionInfo = {
  cls_id: Types.ObjectId,
  cls: string,
  sections: {name:string,_id:Types.ObjectId}[]
}

export const getClassAndSectionInfo = async (school:string):Promise<ClassAndSectionInfo[]> => {
  return await SectionM.aggregate([
      {$match :{school_id: new Types.ObjectId(school)}},
      {$group: {_id: "$class_id",sections: {$push: {name: "$name",_id: "$_id"}}}},
      {$lookup: {from: "classes",localField: "_id",foreignField: "_id",as: "cls"}},
      {$sort: {"cls.name":1}},
      {$unwind: "$cls"},
      {$project: {_id:0,cls_id: "$_id",cls:"$cls.name",sections:1}},
  ]).exec() as ClassAndSectionInfo[];
}

