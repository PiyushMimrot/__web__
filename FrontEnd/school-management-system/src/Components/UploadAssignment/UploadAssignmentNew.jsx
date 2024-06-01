import React, { useEffect, useState, useRef } from "react";
import { SERVER } from "../../config";
import { InstilTable, TableState } from "../MainComponents/InstillTable";
import { GoFileSubmodule } from "react-icons/go";
import { AiFillEye } from "react-icons/ai";
import { FcExpired } from "react-icons/fc";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import Swal from "sweetalert2";

export default function UploadAssignmentNew() {
  const [assignments, setAssignments] = useState([]);
  const [subject, setSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [tabeleState, setTabeleState] = useState(TableState.LOADING);
  const [activeSession, setActiveSession] = useState("");
  const [studentInfo, setStudentInfo] = useState({});
  const [files, setFiles] = useState([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [uploadAsgnInfo, setUploadAsgnInfo] = useState({});
  const [uploaded, setUploaded] = useState([]);
  const currentDate = new Date().toISOString().split("T")[0];

  const ref = useRef();

  useEffect(() => {
    Subjects();
  }, []);

  const Subjects = async () => {
    try {
      setTabeleState(TableState.LOADING);

      //find active session
      const sessionData = await fetch(`${SERVER}/sessions/active`, {
        credentials: "include",
      });
      const session = await sessionData.json();
      setActiveSession(session?.data._id);

      //find subjects
      const response = await fetch(`${SERVER}/subject/getSubject`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: session?.data._id,
        }),
      });
      const responseData = await response.json();
      setSubjects(responseData.subjects);
      setStudentInfo(responseData.studentAlign);
      setTabeleState(TableState.SUCCESS);

      //find all asgn of current section
      const res = await fetch(`${SERVER}/assignments/getassignmentbysection`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: session?.data._id,
          section_id: responseData?.studentAlign?.section_id,
        }),
      });

      const data = await res.json();
      setAssignments(data.assignments);
      setUploaded(data.uploadedAssignments);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const handleSubjectAsgn = async (e) => {
    const subjectId = e.target.value;
    const res = await fetch(`${SERVER}/assignments/getassignment`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subject_id: subjectId,
        session_id: activeSession,
        section_id: studentInfo.section_id,
      }),
    });

    const data = await res.json();
    setAssignments(data);
  };

  const findAssignmentInfo = async (assignmentId) => {
    const assignmentData = await fetch(
      `${SERVER}/uploadAssignment/get/${assignmentId}`,
      {
        credentials: "include",
      }
    );
    const assignment = await assignmentData.json();
    setUploadAsgnInfo(assignment);
  };
  console.log(files);

  const sendDataToBackend = async (formData) => {
    try {
      const response = await fetch(`${SERVER}/uploadAssignment/uploadall`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        Swal.fire({
          title: "Successfully Uploaded!",
          icon: "success",
        });
        setFiles([]);
        Subjects();
      } else {
        Swal.fire({
          title: "Try Again",
          icon: "info",
        });
      }
    } catch (error) {
      Swal.fire({ text: "Try Again!", icon: "danger" });
    }
  };

  const uploadAssignment = async () => {
    const maxFileSize = 5 * 1024 * 1024;
    let isOk = true;
    try {
      if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          let fileSize = files[i].size;
          console.log(fileSize);
          if (fileSize > maxFileSize) {
            isOk = false;
            Swal.fire({
              title: "warning",
              text: "file should be less than 5mb",
              icon: "warning",
              timer: 3000,
            });
            ref.current.value = "";
            setFiles([]);
            return;
          }
        }

        if (isOk) {
          const formData = new FormData();
          formData.append("assignment_id", selectedAssignmentId);
          for (let i = 0; i < files.length; i++) {
            formData.append("documents", files[i]);
          }
          sendDataToBackend(formData);
          ref.current.value = "";
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2 className="mb-4">Upload Assignment</h2>
      <select
        className="form-control w-25 mb-3"
        id="subject_id"
        name="subject_id"
        onChange={(e) => handleSubjectAsgn(e)}
        required
      >
        <option disabled selected>
          Select a Subject
        </option>
        {subjects &&
          subjects.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
      </select>
      <InstilTable
        tableState={tabeleState}
        titles={[
          "Assignment Name",
          "View Details",
          "Submit Assignment",
          "Days Remaining",
        ]}
        rows={assignments.map((assignment, idx) => ({
          "Assignment Name": assignment?.topic,
          "View Details": (
            <button
              className="btn btn-outline-warning"
              data-bs-toggle="modal"
              data-bs-target={`#view${assignment._id}`}
              onClick={() => findAssignmentInfo(assignment._id)}
            >
              <AiFillEye className="fs-5" />
            </button>
          ),
          "Submit Assignment": uploaded.find(
            (item) => item.assignment_id === assignment._id
          ) ? (
            <button
              type="button"
              className="btn"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title={
                "Uploaded on " +
                uploaded
                  .find((item) => item.assignment_id === assignment._id)
                  .createdAt.slice(0, 10)
              }
            >
              <IoCheckmarkDoneCircle size={20} color="green" />
            </button>
          ) : assignment?.last_date.split("T")[0] < currentDate ? (
            <button
              type="button"
              className="btn"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              title={"Expired on " + assignment.date_created.slice(0, 10)}
            >
              <FcExpired size={25} />
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-outline-warning"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              onClick={() => setSelectedAssignmentId(assignment._id)}
              disabled={assignment?.last_date.split("T")[0] < currentDate}
            >
              <GoFileSubmodule size={20} />
            </button>
          ),
          "Days Remaining": (() => {
            const lastDate = new Date(assignment?.last_date.split("T")[0]);
            const currentDate = new Date();

            const timeDifference = lastDate.getTime() - currentDate.getTime();
            const daysRemaining = Math.ceil(
              timeDifference / (1000 * 3600 * 24)
            );
            return <span>{daysRemaining <= 0 ? 0 : daysRemaining} days</span>;
          })(),
        }))}
      />

      <div>
        <div
          className="modal fade"
          id="exampleModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Upload Assignment
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="formFile" className="form-label">
                    Upload
                  </label>
                  <input
                    className="form-control"
                    type="file"
                    multiple
                    ref={ref}
                    onChange={(e) => {
                      setFiles(e.target.files);
                    }}
                  />
                </div>
                <button
                  className="btn btn-primary mt-2"
                  data-bs-dismiss="modal"
                  disabled={files.length > 0 ? false : true}
                  onClick={(e) => {
                    e.preventDefault();
                    uploadAssignment();
                  }}
                >
                  Upload Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {assignments.map((assignment, idx) => (
        <>
          <div>
            <div
              className="modal fade"
              id={`edit${assignment._id}`}
              tabIndex={-1}
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      Modal title
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    />
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label htmlFor="formFile" className="form-label">
                        Upload Assignment
                      </label>
                      <input
                        className="form-control"
                        type="file"
                        id="formFile"
                        accept=".pdf, .doc, .docx"
                        // onChange={(e) => setFile(e.target.files[0])}
                      />
                    </div>
                    <button
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      onClick={(e) => {
                        e.preventDefault();
                        uploadAssignment("edit");
                      }}
                    >
                      Upload Assignment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id={`view${assignment._id}`}
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-3 py-3" id="exampleModalLabel">
                    Assignment Details
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body py-3">
                  <h5 className="mb-3 fs-4">{assignment?.topic}</h5>
                  <p className="mb-3 text-break">{assignment?.desc}</p>
                  <p className="mb-3">
                    <b>Due Date</b> :{" "}
                    {new Date(assignment?.last_date).toLocaleDateString()}
                  </p>
                  <p className="mb-3">
                    <b>Marks</b> :
                    {uploadAsgnInfo?.marks
                      ? uploadAsgnInfo?.marks + "/" + assignment?.totalMarks
                      : "Not marked"}
                  </p>
                  <p>
                    {" "}
                    <b>Subject</b> : {assignment?.subject_id?.name}
                  </p>
                  <p>
                    {" "}
                    <b>Chapter</b> : {assignment?.chapter_id?.name}
                  </p>
                  <p>
                    {" "}
                    <b>Teacher</b> : {assignment?.staff_id?.name}
                  </p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" data-bs-dismiss="modal">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ))}
    </div>
  );
}
