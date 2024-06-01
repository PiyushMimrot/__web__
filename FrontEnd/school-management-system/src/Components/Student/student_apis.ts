import Swal from "sweetalert2";
import { SERVER } from "../../config.js";
import axios from "axios";

type StudentInfo = Partial<{
    alignId:string,
    id:string;
    studentId:string;
    name:string;
    number:string;
    fatherName:string;
    motherName:string;
    parentNumber:string;
    status:string;
    dob:string;
    sec:string;
    cls:string;
    photo:File;
    aadhaar_file:File;
    aadhar_number:string;
    gender:string;
    religion:string;
    nationality:string;
    sectionId?:string
}>


export type ExcelStudentData = Partial<{
  name: string,
  number: number,
  religion: string,
  nationality: string,
  cls: string,
  sec: string,
  gender: string,
  fatherName: string,
  motherName: string,
  parentNumber: number,
  dob: number
}>


const getAllStudents = async () => {
    const resp = await fetch(`${SERVER}/students/get_all_students`,{credentials:"include"})
    const data = await resp.json()
    console.log(data)
    if (data && data.students) {
        return data.students
    } else {
        alert("Failed to get Student");
        return []
    }
};



const getSectionStudents = async (classId:string,sectionId:string) => {
  const resp = await axios.post(`${SERVER}/studentAlign/getinfo`,{ class_id: classId, section: sectionId },{withCredentials:true})
  
  if (resp.data) {
      const transformedArray = resp?.data?.data?.map((item:any) => ({
          alignId:item?._id,
          id: item?.studentid?._id,
          studentId:item?.studentid?.studentId,
          name: item?.studentid?.name,
          number: item?.studentid?.number,
          // fathername: , // Assuming father's name is not available in the original object
          // mothername: '', // Assuming mother's name is not available in the original object
          // Parentnumber: '', // Assuming parent's number is not available in the original object
          status: item?.studentid?.status ,
          dob: item?.studentid?.dob,
          sec:{
            _id:item?.section_id?._id,
            name:item?.section_id?.name
          },
          cls: {
            _id:item?.Class_id?._id,
            name:item?.Class_id?.name
          },
          photo: item?.studentid?.photo, // Assuming photo is not available in the original object
          aadhaar_file: item?.studentid?.adherCard, // Assuming aadhaar file is not available in the original object
          aadhar_number: item?.studentid?.adherNumber, // Assuming aadhar number is not available in the original object
          gender: item?.studentid?.gender,
          religion: item?.studentid?.religion,
          nationality: item?.studentid?.nationality
      }));              
      return {transformedArray,myId:resp.data.myId}
  } else {
      alert("Failed to get Student");
      return null
  }
};

const getClassTeacher = async (sectionId:string)=>{
  const resp = await axios
  .get(`${SERVER}/ClassTeacher/getTeachersBySection/${sectionId}`, {
    withCredentials: true,
  })
  if(resp.data){
    return resp.data.data[0]
  }
  return null
}


export const addNewStudent = async (student:StudentInfo) => {
    const studentData = new FormData();
      for (const key in student) {
        if(student[key as keyof StudentInfo]){
          if(key === "photo" || key === "aadhaar_file"){
            studentData.set('files',student[key]!);
          }
          else{
            studentData.append(key,student[key as keyof Omit<StudentInfo,"photo"|"aadhaar_file">]!);
          }
        }
      }
      const resp = await fetch(`${SERVER}/students/add_student`, {
        method: "POST",
        body:studentData,
        credentials: "include",
      })
     return await resp.json()
}













const studentDelete = async (student: StudentInfo) => {
    Swal.fire({
      title: `Are you sure you want to delete ${student.name}`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${SERVER}/students/studentaligninformation/${student.alignId}`, {
          method: "DELETE",
          credentials: "include",
        })
          .then((res) => res.json())
          .then(() => {
            fetch(`${SERVER}/courseplatform/studentinformation/${student.id}`, {
              method: "DELETE",
              credentials: "include",
            })
          }).then(()=>{
            return true
          }).catch(err=>{
            return null
          })
        }
    }).catch(err=>{
        return null
    })
};

const studentUpdate = async (editStudent: StudentInfo) => {
    await axios
      .put(
        `${SERVER}/courseplatform/studentinformation/${editStudent.id}`,
        editStudent,
        {
          withCredentials: true,
        }
      ).catch(err=>{
        return null
      })
      
      return true
  };



export {getAllStudents,StudentInfo,studentDelete,studentUpdate,getSectionStudents,getClassTeacher}