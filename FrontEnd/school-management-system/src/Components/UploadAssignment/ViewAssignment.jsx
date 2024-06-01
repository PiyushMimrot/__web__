import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoMdCheckbox } from "react-icons/io";
import { InstilTable, TableState } from "../MainComponents/InstillTable";
import { SERVER } from "../../config";
import Swal from "sweetalert2";
import moment from "moment";
import axios from "axios";

export default function ViewAssignment() {
  const uploadAssignmentId = useParams().id;

  const [studentAssignment, setStudentAssignment] = useState([]);
  const [checkedAssignment, setCheckedAssignment] = useState([]);
  const [currentAssignment, setCurrentAssignment] = useState({});
  const [tableState, setTableState] = useState(TableState.LOADING);
  const [reReq, setReReq] = useState(false);
  const [viewed, setViewed] = useState(false);
  const [showmoreDocs, setshowmoreDocs] = useState(null);
  // console.log(studentAssignment, "studentAssignment");
  // console.log(checkedAssignment, "checkedAssignment");
  // console.log(currentAssignment, "currentAssignment");

  useEffect(() => {
    getStudentsAssignment();
  }, [reReq]);

  useEffect(() => {
    getCurrentAssignmentInfo();
  }, [uploadAssignmentId, reReq]);

  const getCurrentAssignmentInfo = async () => {
    const getInfo = await fetch(
      `${SERVER}/assignments/getassignmentbyid/${uploadAssignmentId}`,
      {
        credentials: "include",
      }
    );
    const data = await getInfo.json();
    setCurrentAssignment(data);
  };

  const getStudentsAssignment = async () => {
    setTableState(TableState.LOADING);
    const res = await fetch(
      `${SERVER}/uploadAssignment/getAssignment/${uploadAssignmentId}`,
      { credentials: "include" }
    );

    if (res.status === 200) {
      const data = await res.json();
      setStudentAssignment(data.assignment);
      setCheckedAssignment(data.assignment);
      setTableState(TableState.SUCCESS);
    } else {
      setTableState(TableState.ERROR);
    }
  };
  // --
  const handleMarksChange = (event) => {
    const enteredMarks = parseInt(event.target.value);
    if (enteredMarks > 0 && enteredMarks <= 60) {
      setMarks(enteredMarks);
    } else {
      setMarks(0);
    }
  };

  const handleStudentMarksChange = (event, studentId) => {
    console.log(event.target.value, "sutdenId");
    const enteredMarks = Number(event.target.value);

    if (enteredMarks > 0 && enteredMarks <= currentAssignment?.totalMarks) {
      setCheckedAssignment((prevState) =>
        prevState.map((student) =>
          student?.student_id?._id === studentId
            ? { ...student, marks: enteredMarks }
            : student
        )
      );
    } else if (enteredMarks === 0) {
      setCheckedAssignment((prevState) =>
        prevState.map((student) =>
          student?.student_id?._id === studentId
            ? { ...student, marks: 0 }
            : student
        )
      );
    }
  };

  const handleSubmission = async (assignment, selectedStudentId) => {
    console.log(assignment, selectedStudentId, "assignment selectedStudentId");
    const bodyData = {
      id: "",
      marks: null,
    };

    checkedAssignment.map((ele) => {
      if (ele.student_id._id === selectedStudentId) {
        (bodyData.id = ele._id), (bodyData.marks = ele.marks);
      }
    });
    console.log(bodyData, "bodyData");

    const resp = await fetch(`${SERVER}/uploadAssignment/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...bodyData,
      }),
      credentials: "include",
    });

    if (resp.status === 200) {
      const data = await resp.json();

      console.log(data);

      Swal.fire({
        icon: "success",
        title: "Assignment Checked Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    }

    setStudentAssignment(checkedAssignment);
  };
  const HandelEditdata = (id) => {
    // console.log(formData,id)
    fetch(`${SERVER}/assignments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editData),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          Swal.fire({
            title: "Success",
            text: "Assignment updated successfully",
            icon: "success",
          });

          setReReq(!reReq);
        }
      })
      .catch((error) => {
        console.error("Error making PUT request:", error);
      });
  };
  const handlePublish = async (assignment) => {
    const { _id, section_id } = assignment;
    await axios
      .post(
        `${SERVER}/assignments/publish`,
        { assignment_id: _id, section_id },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data) {
          Swal.fire({
            title: "Success",
            text: "Assignment successfully published!",
            icon: "success",
          });

          setReReq(!reReq);
        }
      })
      .catch((error) => {
        console.error("Error making PUT request:", error);
      });
  };

  const [marks, setMarks] = useState("");
  const [editData, setEditData] = useState({});
  const currentDate = new Date().toISOString().split("T")[0];
  return (
    <div className="px-4">
      <div className="container-xxl custom-bg rounded-3">
        <div className="row align-items-center">
          <div className="border-0 mb-4">
            <h2 className="py-3 fw-bold mb-4 text-primary">View Assignment</h2>

            <div className="row">
              <div className="col-md-7">
                <div className="d-flex flex-column">
                  <h4 className="fw-bold ">
                    Topic: {currentAssignment?.topic}
                  </h4>
                  <p className="text-break">
                    <span className="fw-bold ">Description</span>:{" "}
                    {currentAssignment?.desc}
                  </p>
                  <p>
                    <span className="fw-bold ">Total Marks: </span>{" "}
                    {currentAssignment?.totalMarks}
                  </p>
                </div>
              </div>
              <div className="col-md-5">
                <div className="d-flex flex-column">
                  <p>
                    <span className="fw-bold ">Due Date: </span>
                    {moment(currentAssignment?.last_date).format("D MMM YYYY")}
                  </p>
                  <p>
                    {" "}
                    <span className="fw-bold ">Total Submission:</span>{" "}
                    {studentAssignment?.length}
                  </p>
                  <p>
                    {" "}
                    <span className="fw-bold ">By:</span>{" "}
                    {currentAssignment?.staff_id?.name
                      ? currentAssignment?.staff_id?.name
                      : "Admin"}
                  </p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#showchaptertopics"
                >
                  View Topics
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#edittickit"
                  onClick={() => setEditData(currentAssignment)}
                >
                  Edit Assigment
                </button>
                <button
                  type="button"
                  disabled={
                    moment(currentAssignment?.last_date).isAfter()
                      ? true
                      : false
                  }
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#edittickit2"
                  onClick={() => handlePublish(currentAssignment)}
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* show topics here  */}
      <div
        className="modal fade"
        id="showchaptertopics"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Chapter : <b>{currentAssignment?.chapter_id?.name}</b>
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <table id="patient-table" className="table  align-middle mb-0">
                <thead>
                  <tr>
                    <th>Sr.no</th>
                    <th>Topic</th>
                  </tr>
                </thead>
                <tbody>
                  {currentAssignment?.chapter_id?.topics.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}.</td>
                      <td>{item.topic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <InstilTable
        tableState={tableState}
        titles={["No. ", "Student", "View Submission", "Marks", "Status"]}
        rows={studentAssignment?.map((assignment, index) => ({
          "No. ": index + 1,
          Student: assignment.student_id ? assignment.student_id.name : "",
          "View Submission": assignment?.document ? (
            assignment.additionalDocuments.length > 0 ? (
              <span
                style={{ cursor: "pointer" }}
                data-bs-toggle="modal"
                data-bs-target="#showmultidocs"
                onClick={() => {
                  setshowmoreDocs(assignment);
                  setViewed(true);
                }}
              >
                show more
              </span>
            ) : (
              <a
                href={`${SERVER}/studentAssignment/${assignment.document}`}
                target="_blank"
                onClick={() => setViewed(assignment?._id)}
              >
                View Submission
              </a>
            )
          ) : (
            "Not submitted"
          ),
          Marks: (
            <>
              <div className="d-flex align-items-center">
                <input
                  className="outline-warning"
                  style={{ width: "60px" }}
                  value={
                    checkedAssignment[index]?.marks
                      ? checkedAssignment[index].marks
                      : 0
                  }
                  type="number"
                  onChange={(event) =>
                    handleStudentMarksChange(event, assignment.student_id._id)
                  }
                />
                {/* <input
                  type="number"
                  min={0}
                  max={100}
                  value={marks}
                  onChange={handleMarksChange}
                /> */}
                {assignment?.marks >= 0 && (
                  <IoMdCheckbox style={{ color: "green", fontSize: "26px" }} />
                )}
              </div>
            </>
          ),
          Status: (
            <>
              <button
                className="btn btn-primary"
                disabled={viewed === assignment?._id ? false : true}
                onClick={() =>
                  handleSubmission(checkedAssignment, assignment.student_id._id)
                }
              >
                {assignment?.marks ? "Update" : "Submit"}
              </button>
            </>
          ),
        }))}
      />
      {/* Edit modal */}
      <div
        className="modal fade"
        id="edittickit"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="leaveaddLabel">
                {" "}
                Assignment Edit
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  HandelEditdata(editData?._id);
                  console.log(editData);
                }}
              >
                <div>
                  <div className="mb-3">
                    <label htmlFor="topic">Topic:</label>
                    <input
                      type="text"
                      onChange={(e) => {
                        setEditData({
                          ...editData,
                          topic: e.target.value,
                        });

                        setSelectedStaffId(e.target.value);
                      }}
                      value={editData.topic}
                      className="form-control"
                      id="topic"
                      name="topic"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="desc">Description:</label>
                    <input
                      type="text"
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          desc: e.target.value,
                        })
                      }
                      value={editData.desc}
                      className="form-control"
                      id="desc"
                      name="desc"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="last_date">Last Date:</label>
                    <input
                      type="date"
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          last_date: e.target.value,
                        })
                      }
                      value={
                        editData?.last_date
                          ? new Date(editData.last_date)
                              .toISOString()
                              ?.slice(0, 10)
                          : new Date()
                      }
                      className="form-control"
                      id="last_date"
                      name="last_date"
                      min={currentDate}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ShowMultiDocs formId={"showmultidocs"} moreDocs={showmoreDocs} />
    </div>
  );
}

export const ShowMultiDocs = ({ formId, moreDocs }) => {
  console.log(moreDocs);
  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="addholidayLabel">
              Multiple Documents
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="card">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">S.No</th>
                      <th scope="col">FileName</th>
                      <th scope="col">View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moreDocs && (
                      <>
                        <tr>
                          <td>1.</td>
                          <td>{moreDocs.document}</td>
                          <td>
                            {" "}
                            <a
                              className="btn btn-primary"
                              href={`${SERVER}/studentAssignment/${moreDocs.document}`}
                              target="_blank"
                            >
                              View
                            </a>
                          </td>
                        </tr>
                        {moreDocs.additionalDocuments.map((item, index) => (
                          <tr key={index + 2}>
                            <td>{index + 2}.</td>
                            <td>{item}</td>
                            <td>
                              {" "}
                              <a
                                className="btn btn-primary"
                                href={`${SERVER}/studentAssignment/${item}`}
                                target="_blank"
                                // onClick={() => setViewed(true)}
                              >
                                View
                              </a>
                            </td>
                          </tr>
                        ))}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" data-bs-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
