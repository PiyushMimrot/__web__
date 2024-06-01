import React from "react";
import { useEffect, useState } from "react";
import { InstilTable, TableState } from "../MainComponents/InstillTable.js";
import { RiFileExcel2Line } from "react-icons/ri/index.js";
import { StudentInfo, getAllStudents, studentUpdate, } from "./student_apis.js";
import { AiOutlineEye, AiFillEdit, AiFillDelete } from "react-icons/ai/index.js";
import { BackDrop } from "../../utils/popups/backdrop.js";
import Swal from "sweetalert2";
import { SERVER } from "../../config.js";
import { AddNewStudent } from "./components/add_student.js";
import { EditStudent } from "./components/edit_student.js";
import { ShowDetails } from "./components/student_details.js";
import { MultipleAdd } from "./components/multiple_addstudent.js";

export type StudentInFocus = {
  student?: StudentInfo;
  for?: "edit" | "detail" | "add" | "excel";
};


const AllStudentsList = () => {
  const [studentsInfo, setStudentsInfo] = useState<StudentInfo[]>([]);
  const [studentInFocus, setStudentInFocus] = useState<StudentInFocus>({});
  const [tableState, setTableState] = useState<TableState>(TableState.LOADING);

  const getStudents = async () => {
    setTableState(TableState.LOADING);
    const data = await getAllStudents();
    if (data) {
      setStudentsInfo(data);
      setTableState(TableState.SUCCESS);
    } else {
      setTableState(TableState.ERROR);
      Swal.fire(
        "Try Again!",
        "There might be some internet issue! Please reload the page!",
        "warning"
      );
    }
  };


  useEffect(() => {
    getStudents();
  }, []);

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
        fetch(`${SERVER}/students/studentinformation/${student.alignId}`, {
          method: "DELETE",
          credentials: "include",
        })
          .then((res) => res.json())
          .then(() => {
            fetch(`${SERVER}/courseplatform/studentinformation/${student.id}`, {
              method: "DELETE",
              credentials: "include",
            }).then((res) => res.json())
              .then(() => {
                getStudents()
              });
          });
        Swal.fire("Deleted!", "Student has been deleted.", "success");
      }
    });
  };

  const handleStudentUpdate = async (student: StudentInfo) => {
    const data = await studentUpdate(student);
    if (data) {
      setStudentInFocus({});
      getStudents();
      Swal.fire("Student Updated!", "success");
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
        </div>

        <InstilTable
          tableState={tableState}
          titles={["Roll No", "Name", "Class", "Details", "Actions"]}
          rows={studentsInfo?.map((student, idx) => ({
            "Roll No": idx + 1,
            Name: student.name,
            Class: student.cls ? `${student.cls} - ${student.sec}` : "Not Assigned",
            Details: (
              <button
                type="button"
                className="btn btn-dark btn-set-task w-sm-100"
                onClick={() => {
                  console.log("Student=-------------------",student);
                  setStudentInFocus({ student, for: "detail" })
                }}
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

        <BackDrop show={studentInFocus.for != null}>
          {
            studentInFocus.for == "add" ?
              <AddNewStudent
                onClose={() => setStudentInFocus({})}
              /> :
              studentInFocus.for == "edit" ?
                <EditStudent
                  onClose={() => setStudentInFocus({})}
                  onSubmit={(item) => {
                    handleStudentUpdate(item);
                  }}
                  currentStudent={studentInFocus}
                  setCurrentStudent={setStudentInFocus}
                /> :
                studentInFocus.for == "detail" ?
                  <ShowDetails
                    onClose={() => setStudentInFocus({})}
                    currentStudent={studentInFocus.student}
                  /> :
                  studentInFocus.for == "excel" ?
                    <MultipleAdd
                      onClose={() => setStudentInFocus({})}
                    /> :
                    null
          }
        </BackDrop>
      </div>
    </div>
  );
};

export default AllStudentsList;
