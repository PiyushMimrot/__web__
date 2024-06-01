import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Table from "../MainComponents/Table";
import ButtonCompnent from "./ButtonCompnent";
import { SERVER } from "../../config";
import Swal from "sweetalert2";

export default function SubjectTableNew() {
  const location = useLocation();
  const [sub, setSub] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [editName, setEditName] = useState("");
  const [editClass, setEditClass] = useState("");
  const [editId, setEditId] = useState("");
  const [classInfo, setClassinfo] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [receivedData, setReceivedData] = useState(location.state);
  const type = localStorage.getItem("type");

  // console.log(receivedData, "recieved Data");
  // console.log(selectedClass, "selectedClass")

  let tableRowData = [];
  if (type === "admin") {
    tableRowData = ["No.", "Class", "Subject", "Actions", "Courses"];
  } else {
    tableRowData = ["No.", "Class", "Subject", "Courses"];
  }
  let selector = ["class_id.name", "name"];

  let otherComponent = [ButtonCompnent];

  const addSubject = async () => {
    console.log(selectedClass);

    if (selectedClass === "0") {
      console.log("hello");
      Swal.fire({
        text: "Please Select Class",
        icon: "info",
        timer: 3000,
      });
      return;
    } else {
      const res = await axios.post(
        `${SERVER}/subject/createSubject`,
        {
          name: sub,
          class_id: selectedClass,
        },
        { withCredentials: true }
      );
      console.log(res.data.data);
      setSubjects([...subjects, res.data.data]);
      getSubjects();
      Swal.fire({
        title: "Success",
        text: "Subject Added Successfully",
        icon: "success",
        timer: 3000,
      });
    }
  };

  const getSubjects = async () => {
    if (type === "student" || type === "parent") {
      // await fetch(SERVER + "/subject/getSubject", { credentials: "include" })
      //   .then((res) => res.json())
      //   .then((data) => setSubjects(data.stdSub));
      await axios
        .get(`${SERVER}/sessions/active`, { withCredentials: true })
        .then((res) => res.data.data._id)
        .then(async (session) => {
          await axios
            .post(
              `${SERVER}/subject/getSubject`,
              { session_id: session },
              { withCredentials: true }
            )
            .then((response) => setSubjects(response.data.subjects));
        });
    } else {
      if (selectedClass !== "0") {
        const res = await axios.get(
          `${SERVER}/subject/getSubjectClass/${selectedClass}`,
          { withCredentials: true }
        );
        console.log(res);
        setSubjects(res.data.data);
        setSub("");
      } else {
        setSubjects([]);
      }
    }
  };

  const handleSubjectDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axios.delete(
          `${SERVER}/subject/deleteSubject/${id}`,
          { withCredentials: true }
        );
        setSubjects(subjects.filter((item) => item._id !== id));
      }
    });
  };

  const handleSubjectUpdate = async (upid) => {
    console.log(upid, " ", editName);
    const res = await axios.put(
      `${SERVER}/subject/updateSubject/${upid}`,
      {
        name: editName,
      },
      { withCredentials: true }
    );
    setSubjects(
      subjects.map((item) =>
        item._id === upid ? { ...item, name: editName } : item
      )
    );
    setEditName("");
    getSubjects();
    Swal.fire({
      title: "Success",
      text: "Subject Edited Successfully",
      icon: "success",
      timer: 3000,
    });
  };

  useEffect(() => {
    if (receivedData) {
      setSelectedClass(receivedData);
      setReceivedData(null);
    }
    getSubjects();
  }, [selectedClass]);

  useEffect(() => {
    if (type === "admin" || type === "Accountant") {
      axios
        .get(`${SERVER}/classes/allClasses`, { withCredentials: true })
        .then((res) => {
          setClassinfo(res.data);
          if (res.data.length > 0) {
            setSelectedClass(res.data[0]["_id"]);
          }
        });
    } else if (type === "teacher") {
      axios
        .get(`${SERVER}/classes`, { withCredentials: true })
        .then((res) => setClassinfo(res.data));
    }
  }, []);
  // console.log({ msg: classInfo[0]._id });
  console.log(classInfo);
  console.log(selectedClass);
  return (
    <>
      <div className="body d-flex py-lg-3 py-md-2">
        <div className="container-xxl">
          <div className="row align-items-center card mb-5">
            <div className="border-0 mb-4">
              <div className=" card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                <h2 className="fw-bold mb-0 text-primary">Subjects</h2>
                <div className=" d-flex  justify-content-center w-sm-100 w-50">
                  <div className="row w-100">
                    {type !== "student" && type !== "parent" && (
                      <div className="col  d-flex justify-content-end align-items-end">
                        <select
                          value={selectedClass}
                          className="form-select "
                          aria-label="Default select example"
                          onChange={(e) => setSelectedClass(e.target.value)}
                        >
                          <option value={0} defaultChecked>
                            No Class
                          </option>
                          {classInfo?.map((item, idx) => {
                            return (
                              <option
                                key={idx}
                                value={item?._id}
                                selected={item?._id === selectedClass}
                              >
                                {item.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    )}
                    {(type === "admin" || type === "Accountant") && (
                      <div className="col d-flex align-items-center">
                        <button
                          type="button"
                          className="btn btn-dark btn-set-task w-sm-100 mt-4"
                          data-bs-toggle="modal"
                          data-bs-target="#tickadd"
                          disabled={selectedClass === "0"}
                        >
                          <AiOutlinePlusCircle className="d-inline-block mb-1 me-1" />
                          Add Subject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Table
            titleRowData={tableRowData}
            mainData={subjects}
            selector={selector}
            otherComponent={otherComponent}
            handleDelete={handleSubjectDelete}
            onEdit={(index) => {
              setEditName(subjects[index].name);
              setEditId(subjects[index]._id);
            }}
          />

          {/* Edit subject Model */}

          <div
            className="modal fade"
            id="edittickit"
            tabIndex={-1}
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold" id="edittickitLabel">
                    Edit Subject
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
                    <label htmlFor="sub1" className="form-label">
                      Subject Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      className="form-control"
                      id="sub1"
                      onChange={(e) => setEditName(e.target.value)}
                    />
                    {/* <select value={editClass} className="form-select mt-4" aria-label="Default select example" onChange={(e) => setEditClass(e.target.value)}>
                      <option value={0} selected>No Class</option>
                      {classInfo?.map((item, idx) => {
                        return (
                          <option key={idx} value={item._id}>{item.name}</option>
                        )
                      }
                      )}
                    </select> */}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={() => handleSubjectUpdate(editId)}
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Row End */}
        </div>
      </div>
      {/* Modal Members*/}
      {/* <div
        className="modal fade"
        id="addUser"
        tabIndex={-1}
        aria-labelledby="addUserLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="addUserLabel">
                Employee Invitation
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="inviteby_email">
                <div className="input-group mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email address"
                    id="exampleInputEmail1"
                    aria-describedby="exampleInputEmail1"
                  />
                  <button
                    className="btn btn-dark"
                    type="button"
                    id="button-addon2"
                  >
                    Sent
                  </button>
                </div>
              </div>
              <div className="members_list">
                <h6 className="fw-bold ">Employee </h6>
                <ul className="list-unstyled list-group list-group-custom list-group-flush mb-0">
                  <li className="list-group-item py-3 text-center text-md-start">
                    <div className="d-flex align-items-center flex-column flex-sm-column flex-md-column flex-lg-row">
                      <div className="no-thumbnail mb-2 mb-md-0">
                        <img
                          className="avatar lg rounded-circle"
                          src="https://thumbs.dreamstime.com/b/vector-illustration-avatar-dummy-logo-collection-image-icon-stock-isolated-object-set-symbol-web-137160339.jpg"
                          alt
                        />
                      </div>
                      <div className="flex-fill ms-3 text-truncate">
                        <h6 className="mb-0  fw-bold">Rachel Carr(you)</h6>
                        <span className="text-muted">
                          rachel.carr@gmail.com
                        </span>
                      </div>
                      <div className="members-action">
                        <span className="members-role ">Admin</span>
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn bg-transparent dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="icofont-ui-settings  fs-6" />
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="icofont-ui-password fs-6 me-2" />
                                ResetPassword
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="icofont-chart-line fs-6 me-2" />
                                ActivityReport
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item py-3 text-center text-md-start">
                    <div className="d-flex align-items-center flex-column flex-sm-column flex-md-column flex-lg-row">
                      <div className="no-thumbnail mb-2 mb-md-0">
                        <img
                          className="avatar lg rounded-circle"
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyJaUCUseeD-lonuMsh4BrQdK1GFin9drxM2msd61pn42lKRrLmpssMfK7BNtDsunE_8g&usqp=CAU"
                          alt
                        />
                      </div>
                      <div className="flex-fill ms-3 text-truncate">
                        <h6 className="mb-0  fw-bold">
                          Lucas Baker
                          <a href="#" className="link-secondary ms-2">
                            (Resend invitation)
                          </a>
                        </h6>
                        <span className="text-muted">
                          lucas.baker@gmail.com
                        </span>
                      </div>
                      <div className="members-action">
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn bg-transparent dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Members
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="icofont-check-circled" />
                                <span>All operations permission</span>
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="fs-6 p-2 me-1" />
                                <span>Only Invite &amp; manage team</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn bg-transparent dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="icofont-ui-settings  fs-6" />
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="icofont-delete-alt fs-6 me-2" />
                                Delete Member
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item py-3 text-center text-md-start">
                    <div className="d-flex align-items-center flex-column flex-sm-column flex-md-column flex-lg-row">
                      <div className="no-thumbnail mb-2 mb-md-0">
                        <img
                          className="avatar lg rounded-circle"
                          src="assets/images/xs/avatar8.jpg"
                          alt
                        />
                      </div>
                      <div className="flex-fill ms-3 text-truncate">
                        <h6 className="mb-0  fw-bold">Una Coleman</h6>
                        <span className="text-muted">
                          una.coleman@gmail.com
                        </span>
                      </div>
                      <div className="members-action">
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn bg-transparent dropdown-toggle"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            Members
                          </button>
                          <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="icofont-check-circled" />
                                <span>All operations permission</span>
                              </a>
                            </li>
                            <li>
                              <a className="dropdown-item" href="#">
                                <i className="fs-6 p-2 me-1" />
                                <span>Only Invite &amp; manage team</span>
                              </a>
                            </li>
                          </ul>
                        </div>
                        <div className="btn-group">
                          <div className="btn-group">
                            <button
                              type="button"
                              className="btn bg-transparent dropdown-toggle"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <i className="icofont-ui-settings  fs-6" />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <a className="dropdown-item" href="#">
                                  <i className="icofont-ui-password fs-6 me-2" />
                                  ResetPassword
                                </a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">
                                  <i className="icofont-chart-line fs-6 me-2" />
                                  ActivityReport
                                </a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">
                                  <i className="icofont-delete-alt fs-6 me-2" />
                                  Suspend member
                                </a>
                              </li>
                              <li>
                                <a className="dropdown-item" href="#">
                                  <i className="icofont-not-allowed fs-6 me-2" />
                                  Delete Member
                                </a>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div> */}
      {/* Add Tickit*/}
      <div className="modal fade" id="tickadd" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="leaveaddLabel">
                Add Subject
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
                  Subject
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="sub"
                  placeholder="Enter Subject name here"
                  value={sub}
                  onChange={(e) => setSub(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                disabled={sub.trim() === "" ? true : false}
                type="submit"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() => addSubject()}
              >
                Add Subject
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
