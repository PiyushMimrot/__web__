import React, { useState, useEffect } from "react";
// import Addbutton from "../StudentAlign/Addbutton";
import { SERVER } from "../../config";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
export default function StudentAlign2() {
  const [classInfo, setClassinfo] = useState([]);
  const [SectionInfo, setSectionInfo] = useState([]);

  const [selectedClass, setSelectedClass] = useState(0);
  const [selectedSection, setSelectedSection] = useState(0);

  const [selectedPromoteClass, setSelectedPromoteClass] = useState(0);
  const [selectedPromoteSection, setSelectedPromoteSection] = useState(0);
  const [selectedPromoteSession, setSelectedPromoteSession] = useState("");

  const [students, setStudents] = useState([]);

  const [selectedStudents, setSelectedStudents] = useState([]);

  const [activeSession, setActiveSession] = useState("");
  const [selectAll, setSelectAll] = useState(false);

  const getActiveSession = async () => {
    const res = await axios.get(`${SERVER}/sessions/active`, {
      withCredentials: true,
    });
    setActiveSession(res.data.data);
  };

  useEffect(() => {
    getActiveSession();
  }, []);

  useEffect(() => {
    fetch(`${SERVER}/classes`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setClassinfo(data));
  }, []);

  const getSection = async (class_var) => {
    if (class_var !== 0) {
      const res = await axios.get(
        `${SERVER}/section/getSectionClass/${class_var}`,
        { withCredentials: true }
      );
      //(res)
      console.log(res);
      setSectionInfo(res.data.data);
    } else {
      setSectionInfo([]);
    }
  };

  const getStudents = async () => {
    if (selectedClass !== 0 && selectedSection !== 0) {
      const res = await axios.post(
        `${SERVER}/courseplatform/getStudentClassSection`,
        {
          class_id: selectedClass,
          section_id: selectedSection,
        },
        { withCredentials: true }
      );
      //(res)
      console.log(res);
      // let student = res.data.data.filter((item)=>item.session_id === activeSession._id) ;
      // console.log(student)
      setStudents(res.data.data);
    } else {
      setStudents([]);
    }
  };

  const handleSectionChange = async () => {
    if (selectedStudents.length === 0) {
      Swal.fire({
        text: "Please select one or more students for section change.",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    const updatedSelectedStudents = selectedStudents.map((student) => ({
      ...student,
      section_id: selectedPromoteSection,
    }));

    setSelectedStudents(updatedSelectedStudents);
    updatedSelectedStudents.forEach((student) => {
      student.studentid.photo = null;
      student.studentid.adherCard = null;
    });
    const res = await axios
      .post(
        `${SERVER}/courseplatform/changeSection`,
        {
          students: updatedSelectedStudents,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.success) {
          Swal.fire({
            title: "Success!",
            text: "Successfully changes student section!",
            icon: "success",
            confirmButtonText: "Ok",
          });

          getStudents();
        } else {
          Swal.fire({
            text: "Try again!",
            icon: "info",
            confirmButtonText: "Ok",
          });
        }
      });
  };

  const handlePromote = async () => {
    // Check if at least one student is selected
    console.log(selectedStudents);
    if (selectedStudents.length === 0) {
      Swal.fire({
        text: "Please select one or more students for promotion.",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    // Update the class, section, and session for all selected students
    const updatedSelectedStudents = selectedStudents.map((student) => ({
      ...student,
      Class_id: selectedPromoteClass,
      section_id: selectedPromoteSection,
      session_id: activeSession,
    }));

    // Now, updatedSelectedStudents contains all the selected students with updated class, section, and session data.
    // You can use this data for further processing or updating your state as needed.
    setSelectedStudents(updatedSelectedStudents);

    handlepromoteBackend(updatedSelectedStudents);
  };

  useEffect(() => {
    getStudents();
  }, [selectedClass, selectedSection]);

  useEffect(() => {
    getSection(selectedClass);
  }, [selectedClass]);

  useEffect(() => {
    getSection(selectedPromoteClass);
  }, [selectedPromoteClass]);

  // Function to handle the selection of a student
  const handleStudentSelection = (student) => {
    const updatedSelectedStudents = [...selectedStudents];

    // Check if the student is already in the selected list
    const studentIndex = updatedSelectedStudents.indexOf(student);

    if (studentIndex !== -1) {
      // If the student is in the selected list, remove it
      updatedSelectedStudents.splice(studentIndex, 1);
    } else {
      // If the student is not in the selected list, add it
      updatedSelectedStudents.push(student);
    }

    setSelectedStudents(updatedSelectedStudents);
  };

  const handlepromoteBackend = async (updatedSelectedStudents) => {
    //set photo to null in updatedSelectedStudents
    updatedSelectedStudents.forEach((student) => {
      student.studentid.photo = null;
      student.studentid.adherCard = null;
    });

    // console.log(updatedSelectedStudents);

    const res = await axios.post(
      `${SERVER}/courseplatform/promoteStudent`,
      {
        students: updatedSelectedStudents,
      },
      { withCredentials: true }
    );
    //(res)
    // console.log(res)

    if (res.data.message === "success") {
      Swal.fire({
        title: "Success!",
        text: "Student promoted successfully!",
        icon: "success",
        confirmButtonText: "Ok",
      });

      getStudents();
    } else {
      Swal.fire({
        text: "Student can't promoted in mid session !",
        icon: "info",
        confirmButtonText: "Ok",
      });
    }
  };
  console.log(students);

  // ////////////////////
  const handleCheckAll = () => {
    const checked = document.getElementById("checkAll").checked;
    const studentCheckboxes = document.querySelectorAll(".form-check-input");

    studentCheckboxes.forEach((checkbox) => {
      checkbox.checked = checked;
    });

    // Update the selectedStudents state based on the new checked state
    const updatedSelectedStudents = checked
      ? students.slice() // Select all students
      : []; // Clear the selected list
    setSelectedStudents(updatedSelectedStudents);
  };
  // console.log(moment().format("MMMMMMMMMMMMMMMMMM"));
  return (
    <>
      <div className="body d-flex py-lg-3 py-md-2 ">
        <div className="container-xxl ">
          <div className="container-fluid custom-bg mb-4">
            <h2 className="py-3 fw-bold mb-1 text-primary">Align Students</h2>
            <div className="row justify-content-between align-items-center py-4">
              <div className="col-auto">
                <select
                  value={selectedClass}
                  className="form-select"
                  aria-label="Class select"
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    // setSelectedStudents([]);
                  }}
                >
                  <option value={0}>No Class</option>
                  {classInfo?.map((item, idx) => (
                    <option key={idx} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-auto">
                <select
                  value={selectedSection}
                  className="form-select"
                  aria-label="Section select"
                  onChange={(e) => {
                    setSelectedSection(e.target.value);
                    // setSelectedStudents([]);
                  }}
                >
                  <option value={0}>No Section</option>
                  {SectionInfo.map((item, idx) => (
                    <option key={idx} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-auto">
                <button
                  disabled={
                    SectionInfo &&
                    // selectedStudents.length > 0
                    //  &&
                    SectionInfo.length > 1
                      ? false
                      : true
                  }
                  type="button"
                  className="btn btn-dark btn-lg btn-set-task w-sm-100"
                  data-bs-toggle="modal"
                  data-bs-target="#changesectionmodal"
                >
                  Change Section
                </button>
              </div>
              <div className="col-auto text-center">
                <button
                  disabled={
                    moment().isAfter(activeSession?.end_date) ? false : true
                  }
                  type="button"
                  className="btn btn-dark btn-lg btn-set-task w-sm-100"
                  data-bs-toggle="modal"
                  data-bs-target="#promoteModal"
                >
                  Promote/Demote
                </button>
              </div>
            </div>
          </div>
          {selectedClass !== 0 && selectedSection !== 0 && (
            <div className="d-flex justify-content-end">
              <div className="bg-white p-2 w-25 text-center m-2 align-self-end rounded shadow-lg">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="checkAll"
                  onChange={handleCheckAll}
                />
                <label htmlFor="selectAll" className="ms-2">
                  Select All
                </label>
              </div>
            </div>
          )}

          <table className="table mx-2 custom-bg">
            <thead>
              <tr>
                <th scope="col">Check Box</th>
                <th scope="col">Student Name</th>
                <th scope="col">Class</th>
                <th scope="col">Section</th>
                <th scope="col">Session</th>
                <th scope="col">Date</th>
              </tr>
            </thead>
            <tbody>
              {selectedClass !== 0 && selectedSection !== 0 ? (
                <>
                  {students?.map((item, idx) => (
                    <tr key={idx}>
                      <td scope="row">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                          id="flexCheckDefault"
                          onChange={() => handleStudentSelection(item)}
                        />
                      </td>
                      <td>{item.studentid.name}</td>
                      <td>{item.Class_id.name}</td>
                      <td>{item.section_id.name}</td>
                      <td>{activeSession.session_name}</td>
                      <td>{moment(item.CreatedDate).format("DD MMM YYYY")}</td>
                    </tr>
                  ))}
                </>
              ) : (
                <p style={{ textAlign: "center" }}>
                  Select Class and Section to see students
                </p>
              )}
            </tbody>
          </table>

          {/* Promote Modals */}

          <div
            className="modal fade"
            id="promoteModal"
            tabIndex={-1}
            aria-labelledby="promoteModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold" id="promoteModalLabel">
                    Promote/demote Student
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="sub" className="form-label">
                      Class
                    </label>

                    <select
                      value={selectedPromoteClass}
                      className="form-select "
                      aria-label="Default select example"
                      onChange={(e) => setSelectedPromoteClass(e.target.value)}
                      //   onChange={(e) =>
                      //     setPromoteModalData({
                      //       ...promoteModalData,
                      //       Class_id: e.target.value,
                      //     })
                      //   }
                    >
                      <option value={0} selected>
                        Select Class
                      </option>
                      {classInfo?.map((item, idx) => {
                        return (
                          <option key={idx} value={item._id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="sub" className="form-label">
                      Section
                    </label>

                    <select
                      value={selectedPromoteSection}
                      className="form-select "
                      aria-label="Default select example"
                      onChange={(e) =>
                        setSelectedPromoteSection(e.target.value)
                      }
                    >
                      <option value={0} selected>
                        Select Section
                      </option>
                      {SectionInfo?.map((item, idx) => {
                        return (
                          <option key={idx} value={item._id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* <div className="mb-3">
                    <label htmlFor="demoteSessionId" className="form-label">
                      Session Id
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="demoteSessionId"
                      placeholder="Enter Session"
                      value={selectedPromoteSession}
                      onChange={(e) => setSelectedPromoteSession(e.target.value)}
                    />
                  </div> */}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handlePromote}
                    data-bs-dismiss="modal"
                  >
                    Promote/Demote Student
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Change Section MOdal */}
          <div
            className="modal fade"
            id="changesectionmodal"
            tabIndex={-1}
            aria-labelledby="promoteModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold" id="promoteModalLabel">
                    Change Section
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  {/* <div className="mb-3">
                    <label htmlFor="sub" className="form-label">
                      Class
                    </label>

                    <select
                      value={selectedPromoteClass}
                      className="form-select "
                      aria-label="Default select example"
                      onChange={(e) => setSelectedPromoteClass(e.target.value)}
                      //   onChange={(e) =>
                      //     setPromoteModalData({
                      //       ...promoteModalData,
                      //       Class_id: e.target.value,
                      //     })
                      //   }
                    >
                      <option value={0} selected>
                        Select Class
                      </option>
                      {classInfo?.map((item, idx) => {
                        return (
                          <option key={idx} value={item._id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                  </div> */}
                  <div className="mb-3">
                    <label htmlFor="sub" className="form-label">
                      Section
                    </label>

                    <select
                      value={selectedPromoteSection}
                      className="form-select "
                      aria-label="Default select example"
                      onChange={(e) =>
                        setSelectedPromoteSection(e.target.value)
                      }
                    >
                      <option value={0} selected>
                        Select Section
                      </option>
                      {SectionInfo?.map((item, idx) => {
                        return (
                          <option key={idx} value={item._id}>
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* <div className="mb-3">
                    <label htmlFor="demoteSessionId" className="form-label">
                      Session Id
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="demoteSessionId"
                      placeholder="Enter Session"
                      value={selectedPromoteSession}
                      onChange={(e) => setSelectedPromoteSession(e.target.value)}
                    />
                  </div> */}
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSectionChange}
                    data-bs-dismiss="modal"
                  >
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
