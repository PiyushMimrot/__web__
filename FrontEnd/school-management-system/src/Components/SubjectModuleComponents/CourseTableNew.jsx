import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../MainComponents/Navbar";
import Table from "../MainComponents/Table";
import { RiFileExcel2Line, RiFileDownloadLine } from "react-icons/ri";
import { SERVER } from "../../config";
import { InstilTable, TableState } from "../MainComponents/InstillTable";
import {
  AiFillEdit,
  AiFillDelete,
  AiOutlineEye,
  AiOutlineDelete,
  AiOutlinePlusCircle,
  AiFillPlusCircle,
} from "react-icons/ai";
import { SlOptions } from "react-icons/sl";

import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import Accordion from "react-bootstrap/Accordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, InputAdornment } from "@mui/material";
import { FaCommentsDollar } from "react-icons/fa";

const type = localStorage.getItem("type");

export default function CourseTableNew() {
  const [sub, setSub] = useState("");

  const [Courses, setCourses] = useState([]);

  const [courseId, setCourseId] = useState("");

  const [subject, setSubject] = useState({});

  const [editName, setEditName] = useState("");

  const [editId, setEditId] = useState("");

  const [topicBlk, setTopicBlk] = useState([{ topic: "" }]);

  const [viewT, setViewT] = useState([]);

  const [tableState, setTableState] = useState(TableState.LOADING);

  const [editTopic, setEditTopic] = useState("");
  const [editTopicId, setEditTopicId] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  // ------------------------------------------
  const [searchData, setSearchData] = useState("");

  // ------------------------------------------

  const params = useParams();

  const navigate = useNavigate();

  let tableRowData = ["No.", "Courses", "Actions"];
  let selector = ["name"];

  const handleTopic = (e, idx) => {
    topicBlk[idx]["topic"] = e.target.value;
    setTopicBlk([...topicBlk]);
  };

  const addTopic = () => {
    setTopicBlk([...topicBlk, { topic: "" }]);
  };
  const removeTopic = (id) => {
    let update = [...topicBlk];
    update.splice(id, 1);
    setTopicBlk(update);
  };

  const getSingleSubject = async () => {
    const res = await axios.get(`${SERVER}/subject/getSubject/${params.id}`, {
      withCredentials: true,
    });

    console.log(res);

    setSubject(res.data.data);
  };

  const addCourse = async () => {
    const res = await axios.post(
      `${SERVER}/course/createCourse`,
      {
        name: sub,
        subject_id: params.id,
        topics: topicBlk,
      },
      { withCredentials: true }
    );
    Swal.fire({
      title: "Success",
      text: "Course Added Successfully",
      icon: "success",
      timer: 3000,
    });
    // console.log(topicBlk);
    setSub("");
    setTopicBlk([{ topic: "" }]);
    setViewT([]);
    setCourses([...Courses, res.data.data]);
  };

  const getCourses = async () => {
    try {
      const res = await axios.get(`${SERVER}/course/getCourse/${params.id}`, {
        withCredentials: true,
      });
      // console.log(res, "getcourses");

      if (Array.isArray(res.data.data)) {
        setCourses(res.data.data);
      } else {
        setCourses([]); // Set to an empty array to avoid the error
      }

      setSub("");
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]); // Set to an empty array in case of an error
    }
  };

  const handleCourseDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const res = axios.delete(`${SERVER}/course/deleteCourse/${id}`, {
          withCredentials: true,
        });
        Swal.fire("Deleted!", "Student has been deleted.", "success");
        // console.log(res);

        setCourses(Courses.filter((item) => item._id !== id));
      }
    });
  };

  const handleCourseUpdate = async (upid) => {
    const res = await axios.put(
      `${SERVER}/course/updateCourse/${editId}`,
      {
        name: editName,
        subject_id: params.id,
      },
      { withCredentials: true }
    );

    Swal.fire({
      title: "Success",
      text: "Course Edited Successfully",
      icon: "success",
      timer: 3000,
    });

    setCourses(
      Courses.map((item) =>
        item._id === upid ? { ...item, name: editName } : item
      )
    );
    setEditName("");
    console.log(res);
  };

  const handleAddTopic = async () => {
    if (courseId) {
      const addTopic = await fetch(
        `${SERVER}/coursetopic/addtopic/${courseId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ topic: newTopic }),
        }
      )
        .then((res) => res.json())
        .then(() => {
          getCourses();
        })
        .then(() => {
          setNewTopic("");
        });
    }
  };

  const handleTopicUpdate = async () => {
    console.log({ courseId, editTopicId });

    const updateTopic = await fetch(
      `${SERVER}/coursetopic/updatetopic/${courseId}/${editTopicId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updatedTopicName: editTopic }),
      }
    );
    const topic = await updateTopic.json();

    if (topic) {
      getCourses();
      // IT SHOULD BE COMMENTED OUT IF USING INSTILLTABLE
      // setCourseId("");
      setEditTopicId("");
    }
  };

  const handleTopicDelete = async (id) => {
    try {
      const confirmResult = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (confirmResult.isConfirmed) {
        const res = await axios.delete(
          `${SERVER}/coursetopic/deletetopic/${courseId}/${id}`,
          {
            withCredentials: true,
          }
        );

        // console.log(res, "deleted");
        getCourses();
        setEditTopicId("");
        Swal.fire("Deleted!", "Student has been deleted.", "success");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      Swal.fire("Error", "Failed to delete student.", "error");
    }
  };

  useEffect(() => {
    setTableState(TableState.LOADING);
    getCourses();
    getSingleSubject();
    setTableState(TableState.SUCCESS);
  }, []);
  // ----------------------------
  const [excelData, setExcelData] = useState();
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const [typeError, setTypeError] = useState({
    status: "good",
    msg: "Select a File!",
  });
  const handleClear = () => {
    fileInputRef.current.value = null;
    setTypeError({
      status: "good",
      msg: "Select a File!",
    });
    setSuccess(false);
  };
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const formattedData = data.reduce((acc, row, index) => {
        if (index === 0) {
          row.forEach((chapter) => {
            acc.push({ [chapter]: [] });
          });
        } else {
          row.forEach((cell, idx) => {
            if (acc[idx][data[0][idx]]) {
              acc[idx][data[0][idx]].push(cell);
            }
          });
        }
        return acc;
      }, []);
      setExcelData(formattedData);
    };
    reader.readAsBinaryString(file);
  };

  const submitFileUpload = async () => {
    // Classes
    await axios
      .post(
        `${SERVER}/course/excelCoursesadd`,
        {
          subject_id: params.id,
          excelData,
        },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data) {
          const result = res.data.data;
          Swal.fire({
            title: "Success",
            text: "Course Added Successfully",
            icon: "success",
            timer: 3000,
          });
          handleClear();
          setExcelData([]);
          setCourses([...Courses, ...result]);
        }
      });
  };

  return (
    <>
      <div className="body d-flex py-lg-3 py-md-2">
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="border-0 mb-4">
              <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                <h3 className="fw-bold mb-0">{subject.name} Courses</h3>
                {(type === "admin" || type === "staff") && (
                  <div className="col-auto d-flex gap-5 w-sm-100">
                    <button
                      type="button"
                      className="btn btn-dark btn-set-task w-sm-100"
                      data-bs-toggle="modal"
                      data-bs-target="#tickadd"
                    >
                      <AiOutlinePlusCircle className="d-inline-block mb-1 me-1" />{" "}
                      Add Course
                    </button>
                    <button
                      className="btn btn-success text-white"
                      data-bs-toggle="modal"
                      data-bs-target="#excelmodal"
                    >
                      <RiFileExcel2Line size={20} /> <e> Add Bulk</e>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------- */}
      <Accordion defaultActiveKey="0">
        <div>
          <input
            type="text"
            className="form-control w-25 mb-2"
            placeholder="Search here..."
            aria-describedby="basic-addon1"
            onChange={(e) => setSearchData(e.target.value)}
          />
        </div>
        {Courses.filter((item) =>
          searchData === ""
            ? item
            : item.name.toLowerCase().includes(searchData.toLowerCase())
        ).map((item, index) => (
          <BootAccordion
            key={index}
            index={index}
            data={item}
            setEditName={setEditName}
            setEditId={setEditId}
            setEditTopic={setEditTopic}
            setEditTopicId={setEditTopicId}
            setCourseId={setCourseId}
            handleCourseDelete={handleCourseDelete}
            handleTopicDelete={handleTopicDelete}
          />
        ))}
      </Accordion>
      {/* ---------------------------------------------- */}
      {/* Edit modal  */}
      <div
        className="modal fade"
        id={`edittickit`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="edittickitLabel">
                Edit course
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
                  Course
                </label>
                <input
                  type="text"
                  value={editName}
                  className="form-control"
                  id="sub1"
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={() => handleCourseUpdate(editId)}
              >
                {" "}
                Save changes{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Excel Modal */}
      <div
        class="modal fade"
        id="excelmodal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Add Chapters and Topics
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleClear}
              ></button>
            </div>
            <div class="modal-body">
              <input
                type="file"
                accept=".xlsx, .xls"
                className="form-control"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <p className="text-danger font-monospace">
                *Please ensure that the Excel includes chapters and topics as
                shown in sample excel.
              </p>

              <div>
                <a
                  className="btn btn-danger text-light btn-lg shadow-lg"
                  href="../../../public/sampleDocs/syllabus.xlsx"
                  download="syllabus.xlsx"
                >
                  <RiFileDownloadLine size={20} /> <e> Sample</e>
                </a>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={submitFileUpload}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal Members*/}
      <div
        className="modal fade"
        id="viewTopics"
        tabIndex={-1}
        aria-labelledby="addUserLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h5 className="modal-title  fw-bold" id="addUserLabel">
                  View Topics
                </h5>
                <h5 className="modal-title">{selectedCourse}</h5>
              </div>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div className="modal-body">
              <div className="col-auto d-flex w-sm-100">
                <button
                  type="button"
                  className="btn btn-dark btn-set-task w-sm-100 mb-3"
                  data-bs-toggle="modal"
                  data-bs-target="#addtopic"
                >
                  <AiOutlinePlusCircle className="d-inline-block mb-1 me-1" />{" "}
                  Add Topics
                </button>
              </div>
              {viewT && (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th scope="col">Sr. No.</th>
                      <th scope="col">Topic name</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewT.map((item, idx) => {
                      return (
                        <tr key={idx}>
                          <th scope="row">{idx + 1}</th>
                          <td>{item.topic}</td>
                          <td>
                            <div
                              className="btn-group"
                              role="group"
                              aria-label="Basic outlined example"
                            >
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                data-bs-toggle="modal"
                                data-bs-target="#edittopic"
                                data-bs-dismiss="modal"
                                onClick={() => {
                                  setEditTopic(item.topic);
                                  setEditTopicId(item._id);
                                }}
                              >
                                <AiFillEdit />
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-secondary deleterow"
                                onClick={() => handleTopicDelete(item._id)}
                                data-bs-dismiss="modal"
                              >
                                <AiFillDelete className="text-danger" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Add Tickit*/}
      <div className="modal fade" id="tickadd" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="leaveaddLabel">
                Add Course
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
                  Course
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="sub"
                  placeholder="Enter Course name here"
                  value={sub}
                  onChange={(e) => setSub(e.target.value)}
                />
              </div>
              <div>
                {topicBlk.map((item, idx) => {
                  return (
                    <div key={idx} class_name="card card-body">
                      <div className="mb-3 row">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="form-label col"
                        >
                          Topic Name{" "}
                          <i onClick={() => removeTopic(idx)}>
                            <AiOutlineDelete size={20} color="red" />
                          </i>
                        </label>
                        <input
                          type="text"
                          className="form-control col"
                          id="exampleFormControlInput1"
                          name="section_name"
                          value={topicBlk[idx].topic}
                          onChange={(e) => handleTopic(e, idx)}
                        />
                      </div>
                    </div>
                  );
                })}
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={addTopic}
                >
                  Add Topic
                </button>
              </div>
            </div>
            <div className="modal-footer">
              <button
                disabled={sub.trim() ? false : true}
                type="submit"
                className="btn btn-primary"
                onClick={() => addCourse()}
                data-bs-dismiss="modal"
              >
                Add Course
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* edit topics */}
      <div
        className="modal fade"
        id={`edittopic`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold" id="edittickitLabel">
                Edit
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
                  Topic
                </label>
                <input
                  type="text"
                  value={editTopic}
                  className="form-control"
                  id="sub1"
                  onChange={(e) => setEditTopic(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleTopicUpdate}
              >
                {" "}
                Save changes{" "}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* add topics */}
      <div
        className="modal fade"
        id="addtopic"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="leaveaddLabel">
                Add Topic
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
                  Topic
                </label>
                <input
                  autocomplete="off"
                  type="text"
                  className="form-control"
                  id="topic"
                  placeholder="Enter Topic name here"
                  value={newTopic}
                  onChange={(e) => setNewTopic(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                disabled={newTopic.trim() ? false : true}
                type="submit"
                className="btn btn-primary"
                onClick={handleAddTopic}
                data-bs-dismiss="modal"
              >
                Add Topic
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function BootAccordion({
  data,
  index,
  setEditName,
  setEditId,
  setEditTopic,
  setEditTopicId,
  setCourseId,
  handleCourseDelete,
  handleTopicDelete,
}) {
  // console.log(data);
  return (
    <Accordion.Item eventKey={index}>
      <Accordion.Header onClick={() => setCourseId(data._id)}>
        <div className="d-flex align-items-center justify-content-between me-5 w-100">
          {data.name}
          {(type === "admin" || type === "teacher") && (
            <div>
              <button
                type="button"
                className="btn btn-outline-primary"
                data-bs-toggle="modal"
                data-bs-target="#edittickit"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditName(data.name);
                  setEditId(data._id);
                }}
              >
                <AiFillEdit color="green" />
              </button>
              <button
                type="button"
                className="btn btn-outline-primary ms-2"
                data-bs-toggle="modal"
                data-bs-target="#delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCourseDelete(data._id);
                }}
              >
                <AiFillDelete color="red" />
              </button>
            </div>
          )}
        </div>
      </Accordion.Header>
      <Accordion.Body>
        <div className="row my-3 w-100">
          {data?.topics.map((item, index) => (
            <Topic
              item={item}
              key={index}
              setEditTopic={setEditTopic}
              setEditTopicId={setEditTopicId}
              handleTopicDelete={handleTopicDelete}
            />
          ))}
          {(type === "admin" || type === "teacher") && (
            <div className="w-25 d-flex items-center">
              <button
                type="button"
                className="btn btn-warning text-primary w-50 my-2 mx-2 p-2 shadow-lg"
                data-bs-toggle="modal"
                data-bs-target="#addtopic"
              >
                <AiFillPlusCircle size={20} className="shadow-lg" />
              </button>
            </div>
          )}
        </div>
      </Accordion.Body>
    </Accordion.Item>
  );
}

function Topic({ item, setEditTopic, setEditTopicId, handleTopicDelete }) {
  const [show, setShow] = useState(true);
  return (
    <div className="col-3 d-flex justify-content-between align-items-center my-2 mx-3 p-2 rounded shadow-sm border border-primary">
      <e> {item.topic}</e>
      {(type === "admin" || type === "teacher") &&
        (show ? (
          <button
            className="btn btn-sm btn-primary"
            onClick={() => setShow(false)}
          >
            <SlOptions size={10} />
          </button>
        ) : (
          <div
            className="btn-group btn-group-sm"
            role="group"
            aria-label="Basic outlined example"
          >
            <button
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#edittopic"
              className="btn btn-outline-primary"
              onClick={() => {
                setEditTopic(item?.topic);
                setEditTopicId(item?._id);
                setShow(true);
              }}
            >
              <AiFillEdit size={10} color="green" />
            </button>
            <button
              type="button"
              onClick={() => {
                handleTopicDelete(item?._id);
                setShow(true);
              }}
              className="btn btn-outline-primary"
              // onClick={()=> }
            >
              <AiFillDelete size={10} color="red" />
            </button>
          </div>
        ))}
    </div>
  );
}

//
{
  /* <InstilTable
        tableState={tableState}
        titles={["No.", "Courses", "View", type === "admin" && "Actions"]}
        rows={Courses.map((item, idx) => ({
          "No.": idx + 1,
          Courses: item.name,
          View: (
            <button
              className="btn btn-secondary"
              data-bs-toggle="modal"
              data-bs-target="#viewTopics"
              onClick={() => {
                setViewT(item.topics);
                setCourseId(item._id);
                setSelectedCourse(item.name);
              }}
            >
              <AiOutlineEye />
            </button>
          ),
          Actions: type === "admin" && (
            <div
              className="btn-group"
              role="group"
              aria-label="Basic outlined example"
            >
              <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-toggle="modal"
                data-bs-target="#edittickit"
              >
                <AiFillEdit />
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary deleterow"
                onClick={() => handleCourseDelete(item._id)}
              >
                <AiFillDelete className="text-danger" />
              </button>
            </div>
          ),
        }))}
      /> */
}
