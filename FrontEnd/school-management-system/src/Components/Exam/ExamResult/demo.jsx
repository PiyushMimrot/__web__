// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { SERVER } from "../../../Config";
// import axios from "axios";
// import { AiFillDelete, AiFillEdit } from "react-icons/ai";
// import ExamResultform from "./ExamResultform";
// import Swal from 'sweetalert2';


// export default function ExamResult() {
//     const [subject, setSubject] = useState([]);
//     const [edit, setEdit] = useState({});
//     const [exam, setExam] = useState({});
//     const [examlist, setExamList] = useState({});
//     const [students, setStudents] = useState([]);
//     const [studentsResult, setStudentsResult] = useState([]);
//     const [section, setSection] = useState([]);
//     const [showStudent,setShowStudent] = useState([]);
//     const [data,setData ]= useState([]);

//     const params = useParams();
//     const getExamListById = () => {
//         axios.get(SERVER + `/examlist/${params.exam}`, {withCredentials:true})
//             .then(response => {
//                 setExamList(response.data, 'examlist')
//                 console.log(response.data);
//                 return response.data.class_id;
//             })
//             .then(getExternalId => {
//                 console.log(getExternalId);
//                 getClasses(getExternalId._id);
//                 const res = fetch(`${SERVER}/studentAlign/studentByClass`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         class_id: getExternalId._id
//                     }),
//                     credentials: 'include'
//                 })
//                 return res
//             }).then((res) => res.json())
//             .then(data => {
//                 // console.log(data);
//                 setStudents(data.data);
//             })
//     }

//     const getExamSubject = () => {
//         fetch(SERVER + `/examSubject/${params.exam}`, { credentials: 'include' })
//             .then(res => res.json())
//             .then(data => {
//                 setExam(data[0]);
//                 setSubject(data[0].subject)
//             });
//     }

//     const getExamResult = async () => {
//         const res = await fetch(SERVER + `/examResult/${params.exam}`, { credentials: 'include'});
//         const data = await res.json();
//         console.log(data);
//         setStudentsResult(data);
//         setShowStudent(data);
//     }

//     const postResult = async (data) => {
    
//         try {
//             await axios.post(SERVER + '/examResult', data, {withCredentials:true}).then((response) => {
//                 // console.log(response.status, response.data);
//                 getExamResult();
//             });
//             ;
//         } catch (error) {
//             console.error('Error:', error);
//         }

//         getExamResult();
//     }


//     useEffect(() => {
//         getExamResult();
//         getExamListById();
//         getExamSubject();
//     }, []);

//     useEffect(() => {
//         console.log(students);
//         if (students.length && !studentsResult.length) {
//             console.log('reduc')
//             let r = students.reduce((acc, item, idx) => {
//                 acc.push({ exam_id: params.exam, student_id: item._id, student_name: item.name, subject });
//                 return acc;
//             }, [])
//             console.log(r, 'r');
//             postResult(r);
//         };
//     }, [studentsResult, students])



//     const getClasses = (id) => {
//         console.log(id,'id')
        
//             fetch(SERVER + `/section/getSectionClass/${id}`,{credentials:'include'})
//             .then((res) => res.json())
//             .then((data) =>{
//                 setSection(data.data);
//             })
//     }
//     // console.log(studentsResult,' ',students);

//     const updateData = async (id, updateData) => {
//         updateData['student_id'] = updateData['student_id']['_id'];
//         console.log(updateData);
//         try {
//             await axios.put(SERVER + `/examResult/${id}`, updateData, {withCredentials: true});
//             // setSubject(a.data.subject);
//         } catch (error) {
//             console.error('Error updating Exam list:', error);
//         }

//         getExamResult();
//     }

//     const handleAddEdit = (marks) => {
//         edit.subject.forEach((sub, idx) => {
//             if (marks[sub.name]) {
//                 sub['marks_obtain'] = marks[sub.name];
//             }
//         })

// // console.log(edit)
//         updateData(edit._id, edit);
//         Swal.fire({
//             title: 'Success',
//             text: 'Result Added Successfully',
//             icon: 'success',
//             timer: 3000
//           })
//     }

//     const handleSectionChange = (e) =>{
//         console.log(e.target.value);
//         // console.log(result)

//         let result = studentsResult.filter((item,idx)=>item.student_id.section_id === e.target.value);
//         setShowStudent(result);
//         console.log(result)
//     }

//     const handleResult = (e,sub,studentId,idx) =>{
//        data[idx][e.target.name]=e.target.value;

//        setData({...data});
//     }

//     const handleSubChange = () =>{
        
//     }
//     console.log(data)
//     return (
//         <div>
//             <div className="row">
//                 <div className="col-sm">
//                     <label htmlFor="formFileMultipleone" className="form-label">Select Section</label>
//                     <select className="form-select" aria-label="Default select Section" name="section_id" onChange={handleSectionChange}>
//                         <option value={'selectall'} >Select All</option>
//                         {
//                             section.map((sec, id) => {
//                                 return <option key={id} value={sec._id}>{sec.name}</option>
//                             })
//                         }
//                     </select>
//                 </div>
//                 <div className="col-sm">
//                     <label htmlFor="formFileMultipleone" className="form-label">Select Subject</label>
//                     <select className="form-select" aria-label="Default select Section" name="section_id" onChange={handleSubChange}>
//                         <option value={'selectall'} >Select All</option>
//                         {
//                             subject.map((sub, id) => {
//                                 return <option key={id} value={sub._id}>{sub.name}</option>
//                             })
//                         }
//                     </select>
//                 </div>
//             </div>
//             <div className="table-responsive">
//                 <table className="table">
//                     <thead>
//                         <tr>
//                             {
//                                 [{ name: 'Students' }, ...subject,{name:'Action'}].map((item, idx) => <th scope="col" key={idx}>{item.name} {(item.total_marks) ? `(${item.total_marks})` : ""}</th>)
//                             }
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {
//                             students.map((item, idx) => {
//                                 return (
//                                     <tr key={idx}>
//                                         <td>{item.studentid.name}</td>
//                                         {
//                                             subject.map((sub, id) => {
//                                                 return (
//                                                     <td key={id}><input type="text" name={sub.name} value={data[idx][sub.name]} onChange={(e)=>handleResult(e,sub,item,id)}/></td>
//                                                 )
//                                             })
//                                         }
//                                         <th className="btn-group" role="group" aria-label="Basic outlined example" >
//                                             <button type="button" className="btn btn-outline-secondary" onClick={() => addsubjectMarks()}>Update</button>
//                                         </th>
//                                     </tr>
//                                 )
//                             })
//                         }
//                     </tbody>
//                 </table>
//             </div>
//             <ExamResultform title={'Add/Edit Marks'} formId={'addEditMarks'} editData={edit} addEditMarks={handleAddEdit} />
//         </div>
//     )
// }