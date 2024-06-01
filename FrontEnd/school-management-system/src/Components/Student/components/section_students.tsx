import React, { useRef } from "react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { InstilTable, TableState } from "../../MainComponents/InstillTable.js";
import {
  useActiveSession,
  useClassAndSectionInfo,
} from "../../../hooks/basic.js";
import { RiFileExcel2Line } from "react-icons/ri/index.js";
import {
  StudentInfo,
  getClassTeacher,
  getSectionStudents,
  studentUpdate,
} from "../student_apis.js";
// @ts-ignore
import { AiOutlineEye, AiFillEdit, AiFillDelete } from "react-icons/ai";
import { BackDrop } from "../../../utils/popups/backdrop.js";
import Swal from "sweetalert2";
import { SERVER } from "../../../config.js";
import { EditStudent } from "./edit_student.js";
import { ShowDetails } from "./student_details.js";
import { MultipleAdd } from "./multiple_addstudent.js";
import { AddNewStudent } from "./add_student.js";
export type StudentInFocus = {
  student?: StudentInfo;
  for?: "edit" | "detail" | "add" | "excel";
};

type ClassTeacherType = {
  _id: string;
  class_id: string;
  section_id: string;
  session_id: string;
  teacher_id: {
    _id: string;
    name: string;
  };
  subject_id: string;
  IsClassTeacher: boolean;
  school_id: string;
  isDeleted: boolean;
  updatedAt: string;
};

const SectionStudentList = () => {
  const userType = localStorage.getItem("type");
  const [studentsInfo, setStudentsInfo] = useState<StudentInfo[]>([]);
  const [myid, setMyId] = useState("");
  const [studentInFocus, setStudentInFocus] = useState<StudentInFocus>({});
  const [classTeacher, setClassTeacher] = useState<ClassTeacherType>();
  const [tableState, setTableState] = useState<TableState>(TableState.LOADING);
  const [reReq, setReReq] = useState(false);
  const fileInputRef = useRef(null);

  const classAndSectionInfo = useClassAndSectionInfo();
  const activeSession = useActiveSession();
  const location = useLocation().state;
  const params = useParams();
  console.log(params);

  const getStudents = async () => {
    const data = await getSectionStudents(location.class_id, location._id);
    if (data) {
      setStudentsInfo(data.transformedArray);
      setMyId(data.myId);
    } else {
      Swal.fire(
        "Try Again!",
        "There might be some internet issue! Please reload the page!",
        "warning"
      );
    }
  };
  const getSectionTeacher = async () => {
    const data = await getClassTeacher(location._id);
    if (data) {
      setClassTeacher(data);
    }
  };
  useEffect(() => {
    setTableState(TableState.LOADING);
    getStudents();
    getSectionTeacher();
    setTableState(TableState.SUCCESS);
  }, [reReq]);

  const handleStudentDelete = async (student: StudentInfo) => {
    Swal.fire({
      title: `Are you sure you want to delete ${student?.name}`,
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
              .then((res) => res.json())
              .then(() => {
                setReReq(!reReq);
              });
          });
        Swal.fire("Deleted!", "Student has been deleted.", "success");
      }
    });
  };

  const handleStudentUpdate = async (student: StudentInfo) => {
    const data = await studentUpdate(student);
    if (data) {
      setReReq(!reReq);
      Swal.fire("Student Updated!", "success");
      setStudentInFocus({});
    } else {
      Swal.fire("Try Again!", "warning");
    }
  };

  return (
    <div>
      <div>
        <div
          className="p-3"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            boxShadow: "0px 0px 5px  rgba(0, 0, 0, 0.2)",
            margin: "2px",
            paddingLeft: "20px",
            padding: "2px 5px",
          }}
        >
          <h4 className="text-primary fw-bold">All Students</h4>
          {(userType === "admin" || classTeacher?.teacher_id?._id === myid) && (
            <div className="d-flex gap-3">
              <button
                type="button"
                className="btn btn-primary text-light btn-lg shadow-lg"
                onClick={() => setStudentInFocus({ for: "add" })}
              >
                Add Student
              </button>
              <button
                type="button"
                className="btn btn-success text-light btn-lg shadow-lg"
                onClick={() => setStudentInFocus({ for: "excel" })}
              >
                <RiFileExcel2Line size={20} /> Add Excel
              </button>
            </div>
          )}
        </div>

        <InstilTable
          tableState={tableState}
          titles={["Roll No", "Name", "Class", "Details", "Actions"]}
          rows={studentsInfo?.map((student, idx) => ({
            "Roll No": idx + 1,
            Name: student.name,
            Class: `${params?.className?.slice(6)}-${params?.section}`,
            Details: (
              <button
                type="button"
                className="btn btn-dark btn-set-task w-sm-100"
                onClick={() => setStudentInFocus({ student, for: "detail" })}
              >
                <AiOutlineEye />
              </button>
            ),
            Actions: (
              <div
                className="btn-group"
                role="group"
                aria-label="Basic outlined example"
              >
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setStudentInFocus({ student, for: "edit" });
                  }}
                >
                  <AiFillEdit />
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary deleterow"
                  onClick={() => handleStudentDelete(student)}
                >
                  <AiFillDelete className="text-danger" />
                </button>
              </div>
            ),
          }))}
        />
        <BackDrop show={studentInFocus.for == "add"}>
          <AddNewStudent onClose={() => setStudentInFocus({})} />
        </BackDrop>
        <BackDrop show={studentInFocus.for == "edit"}>
          <EditStudent
            onClose={() => setStudentInFocus({})}
            onSubmit={(item) => {
              handleStudentUpdate(item);
            }}
            currentStudent={studentInFocus}
            setCurrentStudent={setStudentInFocus}
          />
        </BackDrop>
        <BackDrop show={studentInFocus.for == "detail"}>
          <ShowDetails
            onClose={() => setStudentInFocus({})}
            currentStudent={studentInFocus.student}
            sectionId={location._id}
          />
        </BackDrop>
        <BackDrop show={studentInFocus.for == "excel"}>
          <MultipleAdd onClose={() => setStudentInFocus({})} />
        </BackDrop>
      </div>
    </div>
  );
};

export default SectionStudentList;
