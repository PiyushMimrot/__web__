import React, { useState, useEffect } from "react";
import { AiFillEdit } from "react-icons/ai";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { TbXboxX } from "react-icons/tb";
import AttendenceForm from "./AttendenceForm";
import { SERVER } from "../../config";
import { InstilTable, TableState } from "../MainComponents/InstillTable";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import SwalAlert from '../../utils/SweetAlert/Swal';
import Swal from "sweetalert2";

export default function Attendance() {
  const [classes, setClasses] = useState([]);
  const [section, setSections] = useState([]);
  const [classIndex, setClassIndex] = useState(null);
  const [sectionIndex, setSectionIndex] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState([]);

  const [warning, setWarning] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState([]);
  const [isToday, setIsToday] = useState(true);
  const [edit, setedit] = useState();
  const [noOfPresent, setNoOfPresent] = useState(0);
  const [flag, setFlag] = useState(false);
  const [todayDate, setTodayDate] = useState(new Date());
  const [classT, setClassT] = useState({});
  const [tableState, setTableState] = useState(TableState.LOADING);
  const [isPresent, setIspresent] = useState(false);

  const nav = useNavigate();

  const handleAddAttendance = async () => {
    if (!flag) {
      const updatedStudents = students.map((student, idx) => {
        if (selectedStudent.some((selected) => selected._id === student._id)) {
          student.present = true;
        } else {
          student.present = false;
        }
        return student;
      });
      console.log({ updatedStudents });

      // updatedStudents.forEach((item, idx) => {
      //   if (Object.keys(item["studentid"]).length) {
      //     item["studentid"] = item["studentid"]._id;
      //   }
      // });
      await axios
        .post(
          `${SERVER}/attendance/addAttendance`,
          { array: updatedStudents, date },
          { withCredentials: true }
        )
        .then((response) => {
          if (response.data.status === "success") {
            setSelectedStudent([]);
            getAttendance();
          }
        });
      // await fetch(`${SERVER}/attendance/addAttendance`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     array: updatedStudents,
      //     date: date,
      //   }),
      //   credentials: "include",
      // })
      //   .then((response) => response.json())
      //   .catch((error) => {
      //     console.error("Error adding attendance:", error);
      //   });
    }
    setFlag(true);

    Swal.fire({
      title: "Attendance",
      text: "Attendance Added",
      icon: "success",
      timer: 3000,
    });
  };

  const getAttendance = async () => {
    let d1 = new Date(date);
    // console.log(d2," ",d1)
    if (d1.getDate() == todayDate.getDate()) {
      setIsToday(true);
    } else {
      setIsToday(false);
    }
    console.log(date);
    setTableState(TableState.LOADING);
    const res = await fetch(`${SERVER}/attendance/getAttendance`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date: date, sectionId: sectionIndex }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "data");
        if (data.data.length > 0) {
          setStudents(data.data);
          setFlag(true);
          setTotalStudents(data.data);
          setTableState(TableState.SUCCESS);
        } else {
          setFlag(false);
          getStudents();
        }
      });
  };
  // console.log(res)
  useEffect(() => {
    getAttendance();
  }, [sectionIndex, date]);
  // useEffect(()=>{
  //   if(section.length === 1){
  //   }  },[])
  const getStudents = async () => {
    setTableState(TableState.LOADING);
    const resp = await fetch(`${SERVER}/studentAlign/getinfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        class_id: classIndex,
        section: sectionIndex,
      }),
      credentials: "include",
    });
    const res = await resp.json();
    console.log(res, "res");
    res.data.forEach((student, idx) => {
      student.present = false;
    });
    setTotalStudents(res.data);
    // if(!students.length){
    setStudents(res.data);
    setTableState(TableState.SUCCESS);
    // }
  };

  const handleSelect = (e, data) => {
    const { name, checked } = e.target;
    if (checked) {
      if (name === "allSelect") {
        setSelectedStudent(students);
      } else {
        setSelectedStudent([...selectedStudent, data]);
      }
    } else {
      if (name === "allSelect") {
        setSelectedStudent([]);
      } else {
        // console.log(data,'else')
        let tempuser = selectedStudent.filter((item) => item._id !== data._id);
        setSelectedStudent(tempuser);
      }
    }
  };
  const handleEdit = async (newStatus) => {
    const { attendenceId, present } = newStatus;
    await axios
      .put(`${SERVER}/attendance/updateAttendence`, newStatus, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          Swal.fire({
            title: "success",
            text: "Attendence edit successfully",
            icon: "success",
            timer: 3000,
          });
        }
      });

    getAttendance();
  };
  const getSections = (id) => {
    fetch(SERVER + `/section/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setSections(data);
        if (data.length === 1) {
          setSectionIndex(data[0]?._id);
        } else {
        }
      });
  };

  useEffect(() => {
    (async () => {
      let res = await fetch(SERVER + "/classes/allClasses", {
        credentials: "include",
      });
      if (res.status === 200) {
        res = await res.json();
        setClasses(res);
      } else console.log(res, "ERROR ---");
    })();
    getStudents();
    getTeacherD();
  }, []);
  useEffect(() => {
    setNoOfPresent(students.filter((item) => item.present === true).length);
  }, [students]);
  useEffect(() => {
    if (classIndex) {
      getSections();
    }
  }, [setClassIndex]);
  // console.log(selectedStudent,'selectStu')
  const getTeacherD = async () => {
    await fetch(SERVER + `/ClassTeacher/isClassTeacher`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setClassIndex(data.teachD.class_id);
        setSectionIndex(data.teachD.section_id);
        setClassT(data.teachD);
      });
  };

  const handleGetSection = (e) => {
    setSections([]);
    getSections(e.target.value);
    setClassIndex(e.target.value);
  };
  // console.log(classT);

  return (
    <div className="row w-100 p-4">
      <div className="d-flex gap-3 mb-4 card px-3 py-4">
        <h2 className="fw-bold text-primary">Attendence</h2>
        <div className="row">
          {/* Class */}
          {!Object.keys(classT).length ? (
            <div className="col-sm-4">
              <select
                className="form-select"
                aria-label="Default select Class"
                onChange={handleGetSection}
                name="class_id"
              >
                <option defaultValue value={null}>
                  Select a class
                </option>
                {classes.map((item, idx) => {
                  return (
                    <option key={idx} value={item._id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          ) : (
            <h2 className="fw-bold mb-0 text-primary">
              Class {classT.class_id.name} / {classT.section_id.name}
            </h2>
          )}
          {/* Section */}
          {classIndex &&
            section.length !== 1 &&
            !Object.keys(classT).length && (
              <div className="col-sm-4">
                <select
                  className="form-select"
                  aria-label="Select a section"
                  onChange={(e) => setSectionIndex(e.target.value)}
                  name="section_id"
                >
                  <option defaultValue>Select a section</option>
                  {section.length &&
                    section?.map((item, idx) => {
                      return (
                        <option key={idx} value={item._id}>
                          {item.name}
                        </option>
                      );
                    })}
                </select>
              </div>
            )}
          {/* Date */}
          <div className="col-sm-4">
            <input
              type="date"
              className="form-control"
              id="formFileMultipleone"
              name="date"
              onChange={(e) => setDate(e.target.value)}
              max={todayDate.toISOString().split("T")[0]}
              value={date}
            />
          </div>
        </div>
      </div>
      {warning && (
        <div
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          <strong>Warning!</strong> {warning}
          <button
            type="button"
            className="btn-close"
            data-dismiss="alert"
            aria-label="Close"
            onClick={setWarning(null)}
          ></button>
        </div>
      )}
      {students && (
        <div
          className="alert alert-primary alert-dismissible fade show row"
          role="alert"
          style={{ marginLeft: "2px" }}
        >
          <div className="col">Total Students: {totalStudents.length}</div>
          <div className="col">Present: {noOfPresent}</div>
          <div className="col">
            Absents: {""}
            {totalStudents.length - noOfPresent < 0
              ? 0
              : totalStudents.length - noOfPresent}{" "}
          </div>
        </div>
      )}

      <InstilTable
        tableState={tableState}
        titles={[
          "Student",
          "Student Name",
          "Status",
          flag || !isToday ? "Action" : "",
        ]}
        rows={
          flag || isToday
            ? students?.map((student, idx) => ({
                Student: (
                  <div style={{ padding: "0px" }}>
                    <img
                      src={`${SERVER}/courseplatform/student/photo/${student?.studentid?._id}`}
                      onError={(e) => {
                        e.target.src = "/assets/images/gallery/no-image.png";
                      }}
                      alt={student?.studentid?.name}
                      className="avatar rounded-circle img-thumbnail shadow-sm"
                      style={{
                        width: "45px",
                        height: "45px",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        nav(student?.studentid._id);
                      }}
                    />
                  </div>
                ),
                "Student Name": student?.studentid?.name,
                Status: !flag ? (
                  <input
                    type="checkbox"
                    name={student._id}
                    checked={
                      !isToday
                        ? student?.present
                        : selectedStudent.some(
                            (item) => item?._id === student?._id
                          )
                    }
                    disabled={!isToday ? true : false}
                    onChange={(e) => handleSelect(e, student)}
                  />
                ) : student.present ? (
                  <RiCheckboxCircleFill color="green" />
                ) : (
                  <TbXboxX color="red" />
                ),
                Action:
                  flag || isToday ? (
                    <span className="btn-group">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        data-bs-toggle="modal"
                        data-bs-target={"#editAttendence"}
                        onClick={() => {
                          setedit(student);
                          setIspresent(student.present);
                        }}
                      >
                        <AiFillEdit />
                      </button>
                    </span>
                  ) : (
                    ""
                  ),
              }))
            : []
        }
      />

      <div className="w-50 d-flex gap-3 py-3">
        <button
          className="btn btn-primary"
          onClick={() => handleAddAttendance()}
          disabled={students.length ? (students[0].date ? true : false) : false}
        >
          Add Attendance
        </button>
      </div>
      <AttendenceForm
        formId={"editAttendence"}
        handleEdit={handleEdit}
        editAttendence={edit}
        isPresent={isPresent}
        setIspresent={setIspresent}
      />
    </div>
  );
}
