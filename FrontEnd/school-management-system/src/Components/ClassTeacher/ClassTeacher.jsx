import { useState, useEffect } from "react";
import { InstilTable, TableState } from "../MainComponents/InstillTable";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import AddButton from "../../utils/AddButton/Addbutton";

import { SERVER } from "../../config";
import ClassTeacherForm from "./ClassTeacherForm";
import ClassTeacherEditForm from "./ClassTeacherEditForm";
import Swal from "sweetalert2";

import { FaCircleCheck } from "react-icons/fa6";
import UpdateNotAssigned from "./UpdateNotAssigned";
import UpdateClassTeacher from "./UpdateClassTeacher";
import axios from "axios";

export const ClassTeacher = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setselectedClass] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSection, setselectedSection] = useState(null);
  const [classsubjects, setClasssubjects] = useState([]);
  const [allteachers, setAllteachers] = useState([]);
  const [alignTeachers, setalignTeachers] = useState(null);

  const [selectClassTeacher, setselectClassTeacher] = useState(null);
  const [edit, setedit] = useState(null);
  const [isThereAnyClassTeacher, setisThereAnyClassTeacher] = useState(false);

  const getClasses = async () => {
    const { data } = await axios.get(`${SERVER}/classes/allClasses`, {
      withCredentials: true,
    });
    setClasses(data);
    if (data.length > 0) {
      setselectedClass(data[0]._id);
      getSections(data[0]._id);
    }
    // setallSubjects([]);
    // setnotassgineSubjects(null);
  };

  const getSections = async (id) => {
    getAllSubjects(id);
    const { data } = await axios.get(`${SERVER}/section/${id}`, {
      withCredentials: true,
    });
    setSections(data);
    if (data.length > 0) {
      setselectedSection(data[0]._id);
    }
    setselectClassTeacher(null);
  };

  const getAllSubjects = async (id) => {
    const { data } = await axios.get(
      SERVER + `/subject/getSubjectClass/${id}`,
      {
        withCredentials: true,
      }
    );
    if (data.status === "success") {
      setClasssubjects(data.data);
    }
  };

  const getAllTeachers = async () => {
    const { data } = await axios.get(`${SERVER}/ClassTeacher/getTeachers`, {
      withCredentials: true,
    });
    if (data.success) {
      setAllteachers(data.data);
    }
  };

  const fetchAliginTeachers = async () => {
    const { data } = await axios.get(`${SERVER}/ClassTeacher/allTeachers`, {
      withCredentials: true,
    });
    if (data.success) {
      setalignTeachers(data.data);
    }
  };

  const AddTeacherAlignSubmitHandler = async (teacherid, subjectid) => {
    try {
      const newData = {
        class_id: selectedClass,
        section_id: selectedSection,
        subject_id: subjectid,
        teacher_id: teacherid,
        IsClassTeacher: false,
      };
      console.log(newData);

      const { data } = await axios.post(
        `${SERVER}/ClassTeacher/addTeacher`,
        newData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (data.success) {
        console.log(data);
        Swal.fire({
          title: "Success",
          text: "Successfully Teacher Added to class",
          icon: "success",
          timer: 3000,
        });
        fetchAliginTeachers();
      }
    } catch (error) {
      console.error("Error creating:", error);
    }
  };

  const handleUpdateClassTeacher = async () => {
    try {
      const newclassTeacher = alignTeachers.find(
        (item) =>
          item.section_id === selectedSection &&
          !item.IsClassTeacher &&
          item?.teacher_id?._id === selectClassTeacher
      );
      const oldclassTeacher = alignTeachers.find(
        (item) => item.section_id === selectedSection && item.IsClassTeacher
      );
      const newData = {
        newTeacherid: selectClassTeacher,
        newclassTeacher: newclassTeacher._id,
        oldclassTeacher: oldclassTeacher._id,
      };

      const { data } = await axios.put(
        `${SERVER}/ClassTeacher/updateClassTeacher`,
        { ...newData },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (data.success) {
        fetchAliginTeachers();
        setselectClassTeacher(null);
        Swal.fire({
          title: "Success",
          text: "Class Teacher Updated",
          icon: "success",
          timer: 3000,
        });
      } else {
        Swal.fire({
          title: "Warning",
          text: data.message,
          icon: "warning",
          timer: 3000,
        });
      }
    } catch (error) {
      console.error("Error creating:", error);
    }
  };

  const handleEditSubmit = async (teacherid, alignid, method = false) => {
    try {
      let newData = {};
      if (method) {
        newData.IsClassTeacher = true;
      } else {
        newData.teacher_id = teacherid;
      }
      const { data } = await axios.put(
        `${SERVER}/ClassTeacher/${alignid}`,
        newData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (data.success) {
        fetchAliginTeachers();
        Swal.fire({
          title: "Success",
          text: "Teacher Updated",
          icon: "success",
          timer: 3000,
        });
        if (method) {
          setselectClassTeacher(null);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getClasses();
    getAllTeachers();
    fetchAliginTeachers();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      getSections(selectedClass);
    }
  }, [selectedClass]);

  useEffect(() => {
    if (alignTeachers && alignTeachers.length > 0) {
      let isthere = alignTeachers.find(
        (item) => item.section_id === selectedSection && item.IsClassTeacher
      );
      if (!isthere) {
        Swal.fire({
          title: "warning",
          text: "please add the class teacher",
          icon: "warning",
          timer: 3000,
        });
      }
    }
  }, [selectedSection]);

  useEffect(() => {
    const updateFunction = () => {
      const newclassTeacher = alignTeachers.find(
        (item) =>
          item.section_id === selectedSection &&
          item?.teacher_id?._id === selectClassTeacher
      );
      handleEditSubmit(
        newclassTeacher?.teacher_id?._id,
        newclassTeacher?._id,
        true
      );
    };
    if (selectClassTeacher) {
      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to set as class teacher",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Confirm it!",
      }).then((result) => {
        if (result.isConfirmed) {
          isThereAnyClassTeacher
            ? handleUpdateClassTeacher()
            : updateFunction();
        } else {
          setisThereAnyClassTeacher(false);
          setselectClassTeacher(null);
        }
      });
    }
  }, [selectClassTeacher]);

  return (
    <>
      <div className="card p-2">
        <div>
          <h2 className="fw-bold text-primary p-3">Class Teacher List</h2>
        </div>
        <div className="">
          <div className="row">
            <div className="col-6">
              <label htmlFor="formFileMultipleone" className="form-label">
                Class
              </label>
              <select
                className="form-select"
                aria-label="Default select Class"
                onChange={(e) => setselectedClass(e.target.value)}
                name="class_id"
              >
                <option value="" defaultChecked>
                  Select Class
                </option>
                {classes.map((item, idx) => {
                  return (
                    <option
                      key={idx}
                      value={item._id}
                      selected={selectedClass === item._id}
                    >
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
            {selectedClass && (
              <div className="col">
                <label htmlFor="formFileMultipleone" className="form-label">
                  Section
                </label>
                <select
                  className="form-select"
                  aria-label="Default select Section"
                  onChange={(e) => {
                    setselectClassTeacher(null);
                    setselectedSection(e.target.value);
                    setisThereAnyClassTeacher(false);
                  }}
                  name="section_id"
                >
                  <option value="" defaultChecked>
                    Select Section
                  </option>
                  {sections.map((item, idx) => {
                    return (
                      <option
                        key={idx}
                        value={item._id}
                        selected={selectedSection === item._id}
                      >
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card mt-3">
        <table className="table  table-hover mt-2 ">
          <thead>
            <tr>
              <th scope="col">S.No</th>
              <th scope="col">Subjects</th>
              <th scope="col">Teacher</th>
              <th scope="col">Action</th>
              <th scope="col">Class Teacher</th>
            </tr>
          </thead>
          <tbody>
            {classsubjects?.map((subject, index) => {
              let subjectTeacher = alignTeachers?.find(
                (item) =>
                  item?.subject_id === subject?._id &&
                  item.section_id === selectedSection
              );
              let isAlreadyClassTeacher = alignTeachers?.find(
                (item) =>
                  subjectTeacher?.teacher_id._id === item?.teacher_id?._id &&
                  item?.IsClassTeacher
              );
              return (
                <tr key={subject._id}>
                  <th scope="row">{index + 1}</th>
                  <td>{subject?.name}</td>
                  <TableActions
                    subjectTeacher={subjectTeacher}
                    allteachers={allteachers}
                    selectClassTeacher={selectClassTeacher}
                    setselectClassTeacher={setselectClassTeacher}
                    isAlreadyClassTeacher={isAlreadyClassTeacher}
                    handleSubmitData={AddTeacherAlignSubmitHandler}
                    subjectid={subject._id}
                    setedit={setedit}
                    setisThereAnyClassTeacher={setisThereAnyClassTeacher}
                  />
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ClassTeacherEditForm
        title={"Edit Subject Teacher"}
        formId={"editSubTeacher"}
        teachers={allteachers}
        editD={edit}
        handleEditData={handleEditSubmit}
      />
    </>
  );
};

const TableActions = ({
  subjectTeacher,
  allteachers,
  selectClassTeacher,
  setselectClassTeacher,
  isAlreadyClassTeacher,
  handleSubmitData,
  subjectid,
  setedit,
  setisThereAnyClassTeacher,
}) => {
  const [selecteSubjectTeacher, setselecteSubjectTeacher] = useState(null);

  if (subjectTeacher?.IsClassTeacher) {
    setisThereAnyClassTeacher(true);
  }
  return (
    <>
      <td>
        {subjectTeacher?.teacher_id?.name ? (
          subjectTeacher?.teacher_id?.name
        ) : (
          <select
            className="form-select"
            aria-label="Default select example"
            onChange={(e) => setselecteSubjectTeacher(e.target.value)}
          >
            <option value="" defaultChecked>
              Select Teacher
            </option>
            {allteachers.map((teacher) => {
              return (
                <option
                  key={teacher._id}
                  value={teacher._id}
                  selected={selecteSubjectTeacher === teacher._id}
                >
                  {teacher.name}
                </option>
              );
            })}
          </select>
        )}
      </td>
      <td>
        {subjectTeacher ? (
          <button
            type="button"
            className="btn btn-outline-secondary"
            data-bs-toggle="modal"
            data-bs-target="#editSubTeacher"
            onClick={() => setedit(subjectTeacher)}
          >
            <AiFillEdit />
          </button>
        ) : (
          <button
            className="btn btn-primary"
            disabled={selecteSubjectTeacher ? false : true}
            onClick={() => handleSubmitData(selecteSubjectTeacher, subjectid)}
          >
            Appoint
          </button>
        )}
      </td>
      <td>
        {subjectTeacher?.IsClassTeacher ? (
          <div>
            <FaCircleCheck />
          </div>
        ) : (
          !isAlreadyClassTeacher &&
          subjectTeacher && (
            <input
              className="form-check-input mt-0"
              type="checkbox"
              aria-label="Checkbox for following text input"
              onChange={() =>
                setselectClassTeacher(subjectTeacher?.teacher_id._id)
              }
              checked={
                selectClassTeacher === subjectTeacher?.teacher_id._id
                  ? true
                  : false
              }
            />
          )
        )}
      </td>
    </>
  );
};

// export const OldClassAlign = () => {
//   const [classTeachers, setClassTeachers] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [session, setSession] = useState([]);
//   const [teachers, setTeachers] = useState([]);
//   const [edit, setEdit] = useState(null);
//   const [section, setSections] = useState([]);
//   const [selectCS, setSelectCS] = useState({ classId: "", secId: "" });
//   const [filterTeacher, setFilterTeachers] = useState([]);
//   const [tableState, setTableState] = useState(TableState.LOADING);
//   const [allsubjects, setallSubjects] = useState([]);
//   const [notassgineSubjects, setnotassgineSubjects] = useState(null);
//   const [selectedSection, setselectedSection] = useState(null);
//   //(assignments)

//   useEffect(() => {
//     (async () => {
//       setTableState(TableState.LOADING);
//       await getClasses();
//       await fetchClassTeachers();
//       await getSession();
//       await getTeachers();
//       setTableState(TableState.SUCCESS);
//     })();
//   }, []);

//   // useEffect(() => {
//   //   if (selectCS.classId) {
//   //     getSections();
//   //   }
//   // }, [setSelectCS]);

//   const getTeachers = async () => {
//     await fetch(`${SERVER}/ClassTeacher/getTeachers`, {
//       credentials: "include",
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data);
//         setTeachers(data.data);
//       });
//   };

//   const getSession = async () => {
//     await fetch(`${SERVER}/sessions/active`, { credentials: "include" })
//       .then((res) => res.json())
//       .then((data) => setSession(data.data));
//   };
//   const getClasses = async () => {
//     fetch(SERVER + "/classes/allClasses", { credentials: "include" })
//       .then((res) => res.json())
//       .then((data) => {
//         setClasses(data);
//       });
//     // setallSubjects([]);
//     // setnotassgineSubjects(null);
//   };

//   const getSections = (id) => {
//     getAllSubjects(id);
//     fetch(SERVER + `/section/${id}`, { credentials: "include" })
//       .then((res) => res.json())
//       .then((data) => setSections(data));
//   };

//   const getAllSubjects = (id) => {
//     fetch(SERVER + `/subject/getSubjectClass/${id}`, { credentials: "include" })
//       .then((res) => res.json())
//       .then((data) => setallSubjects(data.data));
//   };

//   const fetchClassTeachers = async () => {
//     try {
//       const response = await fetch(`${SERVER}/ClassTeacher/allTeachers`, {
//         credentials: "include",
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           setClassTeachers(data.data);
//         });
//     } catch (error) {
//       console.error("Error fetching ClassTeacher:", error);
//     }
//   };

//   const handleEditSubmit = async (editData) => {
//     console.log(editData, "editData");
//     let URL = `${SERVER}/ClassTeacher/${editData._id}`;

//     await fetch(URL, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(editData),
//       credentials: "include",
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Network response was not ok");
//         }
//         return response.json(); // Parse the JSON response
//       })

//       .catch((error) => {
//         // Handle errors here
//         console.error("Error updating ClassTeacher:", error);
//       });
//   };

//   const handleDelete = (id) => {
//     // console.log(id);

//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then((result) => {
//       try {
//         fetch(`${SERVER}/ClassTeacher/deleteClassTeacher/${id}`, {
//           method: "DELETE",
//           credentials: "include",
//         }).then(() => {
//           fetchClassTeachers();
//         });
//       } catch (error) {
//         console.error("Error deleting ClassTeacher:", error);
//       }

//       if (result.isConfirmed) {
//         Swal.fire("Deleted!", "Class has been deleted.", "success");
//       }
//     });
//   };

//   const handleSubmitData = async (newData) => {
//     let URL = `${SERVER}/ClassTeacher/addTeachers`;

//     try {
//       await fetch(URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newData),
//         credentials: "include",
//       })
//         .then((response) => {
//           return response.json();
//         })
//         .then((data) => {
//           fetchClassTeachers();
//           Swal.fire({
//             title: "Success",
//             text: "Subject Teacher Added Successfully",
//             icon: "success",
//             timer: 3000,
//           });
//         });
//     } catch (error) {
//       Swal.fire({
//         title: "Try Again!",
//         text: "Check if there is any active session!",
//         icon: "success",
//         timer: 3000,
//       });
//       console.error("Error creating:", error);
//     }
//   };

//   const handleClassSections = (e) => {
//     getSections(e.target.value);
//     setselectedSection("");
//     setSelectCS({ classId: e.target.value, secId: "" });
//     setallSubjects([]);
//     setnotassgineSubjects(null);
//     setFilterTeachers([]);
//   };

//   const handleCLassTeachers = (e) => {
//     let secId = e.target.value;
//     setselectedSection(secId);
//     // console.log(selectCS, " ", secId);
//     let ct = classTeachers.filter((item, idx) => {
//       if (
//         item.class_id._id === selectCS.classId &&
//         item.section_id._id === secId
//       ) {
//         return item;
//       }
//     });

//     let subjectNotAssignTeacher = [...allsubjects];
//     console.log(ct);

//     function filterSubjects(subjects = [], results = []) {
//       return subjects.filter((subject) => {
//         const isMatched = results.some(
//           (result) => result.subject_id._id === subject._id
//         );

//         return !isMatched;
//       });
//     }
//     subjectNotAssignTeacher = filterSubjects(allsubjects, ct);

//     if (subjectNotAssignTeacher.length > 0) {
//       setnotassgineSubjects(subjectNotAssignTeacher);
//     } else {
//       setnotassgineSubjects(null);
//     }

//     setFilterTeachers([...ct]);
//     if (ct.length == 0) {
//       setnotassgineSubjects(null);
//     }
//     setSelectCS({ ...selectCS, ["secId"]: secId });
//   };

//   const handleUpdateNotAssignedTeacher = (data) => {
//     try {
//       const newData = data.map((item) => ({
//         class_id: selectCS.classId,
//         section_id: selectCS.secId,
//         session_id: session._id,
//         subject_id: item.subject,
//         teacher_id: item.teacher,
//         IsClassTeacher: false,
//       }));
//       let URL = `${SERVER}/ClassTeacher/addNotAssignedTeacher`;
//       fetch(URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(newData),
//         credentials: "include",
//       })
//         .then((response) => {
//           return response.json();
//         })
//         .then((data) => {
//           console.log(data);
//           Swal.fire({
//             title: "Success",
//             text: "Class Added Successfully",
//             icon: "success",
//             timer: 3000,
//           });
//           fetchClassTeachers();
//           setselectedSection(null);
//           setFilterTeachers([]);
//           setnotassgineSubjects(null);
//         });
//     } catch (error) {
//       console.error("Error creating:", error);
//     }
//   };

//   const handleUpdateClassTeacher = (data) => {
//     try {
//       // console.log(data);

//       let URL = `${SERVER}/ClassTeacher/updateClassTeacher`;
//       fetch(URL, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//         credentials: "include",
//       })
//         .then((response) => {
//           return response.json();
//         })
//         .then((data) => {
//           console.log(data);
//           if (data.success) {
//             Swal.fire({
//               title: "Success",
//               text: "Class Teacher Updated",
//               icon: "success",
//               timer: 3000,
//             });
//             fetchClassTeachers();
//             setselectedSection(null);
//             setFilterTeachers([]);
//             setnotassgineSubjects(null);
//           } else {
//             Swal.fire({
//               title: "Warning",
//               text: data.message,
//               icon: "warning",
//               timer: 3000,
//             });
//           }
//         });
//     } catch (error) {
//       console.error("Error creating:", error);
//     }
//   };

//   return (
//     <div>
//       <div className="card px-3 pb-3 mb-4">
//         <AddButton
//           title={"Class Teachers List"}
//           buttonTitle={"Add class Teacher"}
//           formId={"addClassTeacher"}
//         />
//         <div className="row">
//           <div className="col-6">
//             <label htmlFor="formFileMultipleone" className="form-label">
//               Class
//             </label>
//             <select
//               className="form-select"
//               aria-label="Default select Class"
//               onChange={handleClassSections}
//               name="class_id"
//             >
//               <option value="" defaultChecked>
//                 Select Class
//               </option>
//               {classes.map((item, idx) => {
//                 return (
//                   <option key={idx} value={item._id}>
//                     {item.name}
//                   </option>
//                 );
//               })}
//             </select>
//           </div>
//           {selectCS.classId ? (
//             <div className="col">
//               <label htmlFor="formFileMultipleone" className="form-label">
//                 Section
//               </label>
//               <select
//                 className="form-select"
//                 aria-label="Default select Section"
//                 onChange={handleCLassTeachers}
//                 name="section_id"
//               >
//                 <option value="" defaultChecked>
//                   Select Section
//                 </option>
//                 {section.length > 0 &&
//                   section?.map((item, idx) => {
//                     return (
//                       <option
//                         key={idx}
//                         value={item._id}
//                         selected={selectedSection === item._id}
//                       >
//                         {item.name}
//                       </option>
//                     );
//                   })}
//               </select>
//             </div>
//           ) : (
//             ""
//           )}
//         </div>
//       </div>

//       {filterTeacher.length > 0 && (
//         <button
//           className="btn btn-primary mt-2"
//           data-bs-toggle="modal"
//           data-bs-target="#updateClassTeacher"
//         >
//           Update Class Teacher
//         </button>
//       )}
//       <InstilTable
//         tableState={tableState}
//         titles={[
//           "Sr No.",
//           // 'Class',
//           // 'Section',
//           "Session",
//           "Subject",
//           "Teacher",
//           "Class Teacher",
//           "Action",
//         ]}
//         rows={filterTeacher.map((teacher, idx) => ({
//           "Sr No.": idx + 1,
//           // 'Class':teacher.class_id.name,
//           // 'Section':(teacher.section_id.name || ''),
//           Session: session.session_name,
//           Subject: teacher.subject_id["name"] || "",
//           Teacher: teacher.teacher_id.name,
//           "Class Teacher": teacher?.IsClassTeacher ? <FaCircleCheck /> : "",
//           Action: (
//             <div
//               className="btn-group"
//               role="group"
//               aria-label="Basic outlined example"
//             >
//               <button
//                 type="button"
//                 className="btn btn-outline-secondary"
//                 data-bs-toggle="modal"
//                 data-bs-target="#editSubTeacher"
//                 onClick={() => setEdit(teacher)}
//               >
//                 <AiFillEdit />
//               </button>
//               {/* <button
//                 type="button"
//                 className="btn btn-outline-secondary deleterow"
//                 onClick={() => handleDelete(teacher._id)}
//               >
//                 <AiFillDelete className="text-danger" />
//               </button> */}
//             </div>
//           ),
//         }))}
//       />

//       {notassgineSubjects && (
//         <button
//           className="btn btn-danger mt-2"
//           data-bs-toggle="modal"
//           data-bs-target="#updateTeacherNotAssigned"
//         >
//           Not Assigned
//         </button>
//       )}

//       <ClassTeacherForm
//         title={"Add Class Teacher"}
//         formId={"addClassTeacher"}
//         classes={classes}
//         session={session}
//         teachers={teachers}
//         handleNewData={handleSubmitData}
//         allClassTeachers={classTeachers}
//       />
//       <ClassTeacherEditForm
//         title={"Edit Subject Teacher"}
//         formId={"editSubTeacher"}
//         classes={classes}
//         teachers={teachers}
//         editD={edit || {}}
//         handleEditData={handleEditSubmit}
//       />

//       <UpdateNotAssigned
//         title={"Subject Not Assignned"}
//         formId={"updateTeacherNotAssigned"}
//         teachers={teachers}
//         subjects={notassgineSubjects}
//         handleSubmitData={handleUpdateNotAssignedTeacher}
//       />

//       <UpdateClassTeacher
//         title={"Update Class Teacher"}
//         formId={"updateClassTeacher"}
//         teachers={filterTeacher}
//         handleSubmitData={handleUpdateClassTeacher}
//       />
//     </div>
//   );
// };
