import { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Table from "../MainComponents/Table";
import { SERVER } from "../../config";
// import AssignmentT from './AssignmentT';
import { InstilTable, TableState } from "../MainComponents/InstillTable";
import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FcDeleteDatabase } from "react-icons/fc";
import { useActiveSession } from "../../hooks/basic";

export default function AssignmentTable() {
  const [assignments, setAssignments] = useState([]);
  const [editName, setEditName] = useState("");
  const [topic, setTopic] = useState("");
  const [desc, setDesc] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [staffId, setStaffId] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [status, setStatus] = useState("");
  const [totalMarks, setTotalMarks] = useState("");

  const [selectedClassId, setSelectedClassId] = useState("");
  const [SelectedSectionId, setSelectedSectionId] = useState("");
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [SelectedChapterId, setSelectedChapterId] = useState(null);

  const [editSubjects, setEditSubjects] = useState([]);

  const [Class, SetClass] = useState([]);
  const [Staff, SetStaffs] = useState([]);
  const [Course, SetCourse] = useState([]);
  const [Subject, SetSubjects] = useState([]);
  const [Section, SetSection] = useState([]);
  const [Chapters, setChapters] = useState([]);

  const [class2, setClass2] = useState([]);
  const [section2, setSection2] = useState([]);
  const [activeSession, setActiveSession] = useState("");
  const [editData, setEditData] = useState({});

  const [tableState, setTableState] = useState(TableState.LOADING);
  const navigate = useNavigate();
  const currentDate = new Date().toISOString().split("T")[0];
  const type = localStorage.getItem("type");

  useEffect(() => {
    if (activeSession !== "") {
      getAssignment();
    }
  }, [activeSession]);

  useEffect(() => {
    Staffs();
    activeSesisonFun();
  }, []);

  useEffect(() => {
    Classes();
  }, [staffId]);

  useEffect(() => {
    ClassesEdit();
  }, [selectedStaffId]);

  useEffect(() => {
    SubjectsEdit();
  }, [selectedClassId]);

  useEffect(() => {
    Subjects();
  }, [classId]);

  useEffect(() => {
    getSection(classId);
  }, [classId]);

  useEffect(() => {
    getSection2(selectedClassId);
  }, [selectedClassId]);

  useEffect(() => {
    setSelectedChapterId(null);
    setChapters([]);
    getChapters(subjectId);
  }, [subjectId]);

  // let selector = ["topic", "desc", "subject_id", "class_id", "section_id", "staff_id", "last_date", "status", "date_created"];

  let tableRowData = [
    "No.",
    "Class",
    "Topic",
    "View Submission",
    "Status",
    "Action",
  ];

  const activeSesisonFun = async () => {
    const sessionData = await fetch(`${SERVER}/sessions/active`, {
      credentials: "include",
    });
    const session = await sessionData.json();
    setActiveSession(session?.data._id);
  };

  const getAssignment = async () => {
    setTableState(TableState.LOADING);
    // const sessionId = useActiveSession();
    const res = await fetch(
      // `${SERVER}/assignments?classId=${selectedClassId}&sectionId=${SelectedSectionId}`,
      `${SERVER}/assignments/all?sessionId=${activeSession}`,
      { credentials: "include" }
    );

    // console.log(res);

    if (res.status === 200) {
      const data = await res.json();
      // setAssignments(
      //   data.map((item) => ({
      //     ...item,
      //     date_created: new Date(item.date_created).toLocaleDateString(),
      //     last_date: new Date(item.last_date).toLocaleDateString(),
      //   }))
      // );
      setAssignments(data?.assigments);
      setTableState(TableState.SUCCESS);
    } else {
      setTableState(TableState.ERROR);
    }
  };

  const handleSubjectUpdate = async (upid) => {
    setAssignments(
      assignments.map((item) =>
        item._id === upid ? { ...item, name: editName } : item
      )
    );
    setEditName("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      topic: topic,
      desc: desc,
      subject_id: subjectId,
      class_id: classId,
      section_id: sectionId,
      chapter_id: SelectedChapterId,
      staff_id: staffId,
      last_date: lastDate,
      totalMarks: totalMarks,
      date_created: Date(Date.now()).toString(),
      session_id: activeSession,
    };
    try {
      fetch(`${SERVER}/assignments`, {
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      })
        .then((response) => response.json())
        .then((res) => {
          if (res) {
            Swal.fire({
              title: "Success",
              text: "Assignment added successfully",
              icon: "success",
              confirmButtonText: "Ok",
            });

            getAssignment();
            setTopic("");
            setDesc("");
            setSubjectId("");
            setClassId("");
            setSectionId("");
            setSelectedChapterId("");
            setStaffId("");
            setLastDate("");
            setTotalMarks("");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // edit data
  const [formData, setFormData] = useState({
    topic: "",
    class_id: "", // Leave this field with defaultValue
    desc: "",
    last_date: "", // Leave this field with defaultValue
    section_id: "",
    staff_id: "",
    status: "",
    subject_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  // const action={} method="post"

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
            icon: "info",
          });

          getAssignment();
        }
      })
      .catch((error) => {
        console.error("Error making PUT request:", error);
      });
  };

  const deleteAssignment = async (id) => {
    const res = await axios.delete(`${SERVER}/assignments/${id}`, {
      withCredentials: true,
    });

    if (res.status === 204) {
      Swal.fire({
        title: "Success",
        text: "Assignment deleted successfully",
        icon: "success",
        confirmButtonText: "Ok",
      });
    }

    getAssignment();
  };

  const handleAssignmentDelete = async (id) => {
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
        deleteAssignment(id);
      }
    });
  };

  const Classes = async () => {
    try {
      const response = await axios.get(`${SERVER}/classes`, {
        withCredentials: true,
      });

      setClass2(response.data);

      // SetClass(response.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const ClassesEdit = async () => {
    // try {
    //   if (selectedStaffId !== "" && setSelectedStaffId !== null) {
    //     const response = await axios.get(`${SERVER}/classes/getclassbyteacher/${selectedStaffId}`, {
    //       withCredentials: true
    //     }); // Assuming your backend is running on the same domain
    //     console.log(response.data);
    //     SetClass(response.data);
    //   }
    // } catch (error) {
    //   console.error('Error fetching materials:', error);
    // }
  };

  const SubjectsEdit = async () => {
    try {
      if (selectedClassId !== "" && selectedClassId !== null) {
        const response = await axios.get(
          `${SERVER}/subject/getSubjectClass/${selectedClassId}`,
          {
            withCredentials: true,
          }
        ); // Assuming your backend is running on the same domain
        setEditSubjects(response.data.data);
        // console.log(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const Staffs = async () => {
    try {
      const response = await axios.get(`${SERVER}/staffmanage/staff`, {
        withCredentials: true,
      }); // Assuming your backend is running on the same domain
      SetStaffs(response.data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const Subjects = async () => {
    try {
      if (classId !== null && classId !== "") {
        if (type === "admin") {
          await axios
            .get(`${SERVER}/subject/getSubjectClass/${classId}`, {
              withCredentials: true,
            })
            .then((response) => SetSubjects(response.data.data));
        } else if (type === "teacher") {
          await axios
            .get(`${SERVER}/ClassTeacher/getSubTeachers`, {
              withCredentials: true,
            })
            .then((response) => SetSubjects(response.data.data));
        }
      }
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const getSection = async (class_var) => {
    if (class_var !== null && class_var !== "") {
      if (class_var !== 0) {
        const res = await axios.get(
          `${SERVER}/section/getSectionClass/${class_var}`,
          {
            withCredentials: true,
          }
        );
        //(res)
        // console.log(res);
        SetSection(res.data.data);
      } else {
        SetSection([]);
      }
    }
  };

  const getSection2 = async (class_var) => {
    if (class_var !== null && class_var !== "") {
      if (class_var !== 0) {
        const res = await axios.get(
          `${SERVER}/section/getSectionClass/${class_var}`,
          {
            withCredentials: true,
          }
        );
        //(res)
        // console.log(res);
        setSection2(res.data.data);
      } else {
        SetSection([]);
      }
    }
  };

  const selectSubjectHander = async (e) => {
    setSubjectId(e.target.value);
    await getChapters(e.target.value);
  };

  const getChapters = async (id) => {
    try {
      const res = await axios.get(`${SERVER}/course/getCourse/${id}`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        let update = res.data.data.map((item) => ({
          chapter_id: item._id,
          chapter_name: item.name,
        }));
        setChapters(update);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onEdit = (item) => {
    setEditData(item);
  };

  const handleEditStatusChange = async (newStatus, id) => {
    // update the status in the assignments state of id is id
    // console.log(newStatus);

    let updatedAssignment = assignments.find((item) => item._id === id);

    // console.log(updatedAssignment);

    await fetch(`${SERVER}/assignments/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify({ ...updatedAssignment, status: newStatus }), // Convert the data to JSON format
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json(); // Parse the response as JSON
      })
      .then((data) => {
        if (data) {
          getAssignment();
        }
      })
      .catch((error) => {
        console.error("Error making PUT request:", error);
      });

    getAssignment();
  };
  console.log(assignments);
  return (
    <>
      <div className="body d-flex py-lg-3 py-md-2">
        <div className="container-xxl custom-bg rounded-3">
          <div className="row align-items-center">
            <div className="border-0 mb-4">
              <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                <h3 className="fw-bold mb-0 text-primary">Assignment</h3>
              </div>
              <div className="col-auto d-flex w-sm-100">
                <select
                  onChange={(e) => {
                    setSelectedClassId(e.target.value);
                    setSelectedSectionId("");
                  }}
                  className="form-control m-3"
                  id="class_id"
                  name="class_id"
                  required
                >
                  <option disabled selected>
                    Select a Class
                  </option>
                  {class2 &&
                    class2?.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))}
                </select>

                <select
                  onChange={(e) => setSelectedSectionId(e.target.value)}
                  className="form-control m-3"
                  id="section_id"
                  name="section_id"
                  required
                >
                  <option selected>Select a Section</option>
                  {section2 &&
                    section2?.map((student) => (
                      <option key={student._id} value={student._id}>
                        {student.name}
                      </option>
                    ))}
                </select>
                <div className="col-4 w-sm-100 d-flex justify-content-center align-items-center">
                  <button
                    type="button"
                    className="btn btn-dark btn-set-task p-2"
                    data-bs-toggle="modal"
                    data-bs-target="#tickadd"
                  >
                    <AiOutlinePlusCircle className="d-inline-block mb-1 me-1" />{" "}
                    Add Assignment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add Assignment*/}
      {/* <AssignmentT assignments={assignments} /> */}

      <InstilTable
        tableState={tableState}
        titles={tableRowData}
        rows={assignments
          ?.filter((item) => {
            if (SelectedSectionId !== "") {
              return item?.section_id?._id === SelectedSectionId;
            } else {
              return item;
            }
          })
          ?.map((item, idx) => ({
            [tableRowData[0]]: item?.isDeleted ? (
              <FcDeleteDatabase size={20} />
            ) : (
              <e>{idx + 1}</e>
            ),
            [tableRowData[1]]: item.class_id.name + "/" + item.section_id.name,
            // [tableRowData[2]]: item.topic,
            [tableRowData[2]] : <button type="button"
            className="btn btn-secondary" data-bs-toggle="tooltip"
            data-bs-placement="right"
            title={item?.topic}>
            {item?.topic}
          </button>,

            [tableRowData[3]]: (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  navigate(`/viewAssignment/${item._id}`);
                }}
              >
                View
              </button>
            ),
            [tableRowData[4]]: (
              <div className="form-check form-switch theme-switch">
                <input
                  className="form-check-input"
                  id="statusToggle"
                  type="checkbox"
                  checked={item.status === "active"}
                  value={item.status}
                  onChange={(e) => {
                    handleEditStatusChange(
                      e.target.checked ? "active" : "inactive",
                      item._id
                    );
                    // HandelEditdata(item._id);
                  }}
                />
              </div>
            ),
            [tableRowData[5]]: (
              <div className="d-flex">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-bs-toggle="modal"
                  data-bs-target="#edittickit"
                  onClick={() => onEdit(item)}
                >
                  <AiFillEdit />
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary deleterow"
                  onClick={() => handleAssignmentDelete(item._id)}
                >
                  <AiFillDelete className="text-danger" />
                </button>
              </div>
            ),
          }))}
      />

      {/* Add Assigment */}
      <div className="modal fade" id="tickadd" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="leaveaddLabel">
                {" "}
                Add Assignment
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div>
                  <div className="mb-3">
                    <label htmlFor="topic">Topic:</label>
                    <input
                      type="text"
                      onChange={(e) => setTopic(e.target.value)}
                      value={topic}
                      className="form-control"
                      id="topic"
                      name="topic"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="desc">Description:</label>
                    <textarea
                      onChange={(e) => setDesc(e.target.value)}
                      value={desc}
                      className="form-control"
                      id="desc"
                      name="desc"
                      rows={4}
                      style={{ resize: "none" }}
                    ></textarea>
                  </div>

                  <div className="mb-3 row">
                    <div className="col">
                      <label htmlFor="class_id">Class:</label>

                      {/* Class */}
                      <select
                        onChange={(e) => setClassId(e.target.value)}
                        value={classId}
                        className="form-control"
                        id="class_id"
                        name="class_id"
                        required
                      >
                        <option value="">Select Class</option>
                        {class2 &&
                          class2.map((item) => (
                            <option key={item._id} value={item._id}>
                              {item.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    {/* Section */}
                    <div className="col">
                      <label htmlFor="section_id">Section:</label>
                      <select
                        onChange={(e) => setSectionId(e.target.value)}
                        value={sectionId}
                        className="form-control"
                        id="section_id"
                        name="section_id"
                        required
                      >
                        <option value="">Select Section</option>
                        {Section &&
                          Section.map((student) => (
                            <option key={student._id} value={student._id}>
                              {student.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    {/* date */}
                    <div className="col">
                      <label htmlFor="last_date">Last Date:</label>
                      <input
                        type="date"
                        onChange={(e) => setLastDate(e.target.value)}
                        value={lastDate}
                        className="form-control"
                        id="last_date"
                        name="last_date"
                        min={currentDate}
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    {/* Subject */}
                    <div className="col">
                      <label htmlFor="subject_id">Subject:</label>

                      <select
                        className="form-control"
                        id="subject_id"
                        name="subject_id"
                        onChange={selectSubjectHander}
                        required
                      >
                        <option value="">Select Subject</option>
                        {type === "admin"
                          ? Subject &&
                            Subject.map((student) => (
                              <option key={student._id} value={student._id}>
                                {student.name}
                              </option>
                            ))
                          : classId &&
                            sectionId &&
                            Subject.filter(
                              (item) =>
                                item.class_id._id === classId &&
                                item.section_id._id === sectionId
                            ).map((item) => (
                              <option
                                key={item.subject_id._id}
                                value={item.subject_id._id}
                              >
                                {item.subject_id.name}
                              </option>
                            ))}
                        {}
                      </select>
                    </div>
                    <div className="col">
                      <label htmlFor="subject_id">Chapter:</label>

                      <select
                        className="form-control"
                        id="chapter_id"
                        name="chapter_id"
                        onChange={(e) => setSelectedChapterId(e.target.value)}
                        value={SelectedChapterId}
                        required
                      >
                        <option value="">Select Chapter</option>
                        {Chapters.map((item, index) => (
                          <option value={item.chapter_id} key={index}>
                            {item.chapter_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Marks */}
                    <div className="col">
                      <label htmlFor="Total_marks">Total Marks</label>
                      <input
                        type="number"
                        onChange={(e) => setTotalMarks(e.target.value)}
                        value={totalMarks}
                        className="form-control"
                        id="desc"
                        name="desc"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  disabled={
                    topic &&
                    totalMarks &&
                    classId &&
                    sectionId &&
                    lastDate &&
                    subjectId &&
                    SelectedChapterId
                      ? false
                      : true
                  }
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

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
                  {/* Total Marks */}
                  {/* <div className="mb-3">
                    <label htmlFor="desc">Total Marks:</label>
                    <input
                      type="Number"
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          totalMarks: e.target.value,
                        })
                      }
                      value={editData.totalMarks}
                      className="form-control"
                      id="totalMarks"
                      name="totalMarks"
                    />
                  </div> */}
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
                      // value={editData?.last_date?.slice(0, 10)}
                      className="form-control"
                      id="last_date"
                      name="last_date"
                      min={currentDate}
                    />
                  </div>
                  {/* <div className="mb-3">
                    <label htmlFor="status">Status:</label>
                    <select
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          status: e.target.value,
                        })
                      }
                      value={editData.status}
                      className="form-select"
                      id="status"
                      name="status"
                    >
                      
                      <option value="active">Active</option>
                      <option value="nonactive">Non-Active</option>
                    </select>
                  </div> */}
                  {/* <div className="mb-3">
                    <label htmlFor="subject_id">Subject ID:</label>

                    <select
                      className="form-control"
                      id="subject_id"
                      name="subject_id"
                      value={editData.status}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          subject_id: e.target.value,
                        })
                      }
                      required
                    >
                      {Subject &&
                        Subject.map((student) => (
                          <option key={student._id} value={student._id}>
                            {student.name}
                          </option>
                        ))}
                    </select>
                  </div> */}
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
    </>
  );
}
