import { useEffect, useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { InstilTable, TableState } from "../MainComponents/InstillTable";
import { SERVER } from "../../config";
import ViewStudentDoubt from "./ViewStudentDoubt";
import moment from "moment";
import { getTypeToken } from "../../Context/localStorage";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal2 from "sweetalert2";
import { FcDeleteDatabase } from "react-icons/fc";

const type = getTypeToken();

export default function TeacherViewDoubt() {
  const [doubts, setDoubts] = useState([]);
  const [statusSpecific, setStatusSpecific] = useState([]);
  const [view, setView] = useState({});
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [sTeacher, setSTeacher] = useState();
  // const [filteringSection, setFilteringSection] = useState("");
  const [myId, setMyId] = useState("");
  // const [first, setfirst] = useState(second)

  const [tableState, setTableState] = useState(TableState.LOADING);
  //   console.log(doubts, "doubts")
  const [selectedStatus, setselectedStatus] = useState(false);
  const [selectedClass, setselectedClass] = useState(null);
  const [selectedSection, setselectedSection] = useState(null);

  const [teacherDocUploadid, setteacherDocUploadid] = useState(null);

  useEffect(() => {
    (async () => {
      setTableState(TableState.LOADING);
      await fetchStudentDoubts();
      await getClasses();
      if (type === "admin") {
        await fetchTeachers();
      }
      setTableState(TableState.SUCCESS);
    })();
  }, []);

  const getClasses = async () => {
    if (type === "admin") {
      await fetch(SERVER + "/classes/allClasses", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setClasses(data));
    } else {
      await fetch(SERVER + "/classes", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setClasses(data));
    }
  };

  const fetchTeachers = async () => {
    await axios
      .get(`${SERVER}/staffmanage/activestaffs`, { withCredentials: true })
      .then((res) => setTeachers(res.data));
  };

  const getSections = (id) => {
    fetch(SERVER + `/section/getSectionClass/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setSections(data.data));
  };

  const fetchStudentDoubts = async () => {
    try {
      await fetch(`${SERVER}/StudentDoubt/studentDoubts`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          let { studentDoubts, myId } = data;
          setDoubts(studentDoubts);
          setMyId(myId);
          studentDoubts = studentDoubts.map((item) => {
            if (item.feedback) {
              item.status = true;
            }
            return item;
          });
          setStatusSpecific(
            studentDoubts.filter((item) => item.status === false)
          );
        });
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const handleStatus = async (e, doubt) => {
    doubt.status = e.target.checked;

    doubt.studentId = doubt?.student[0]?._id;
    Swal2.fire({
      title: "Are you sure?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch(SERVER + `/StudentDoubt/studentdoubts/${doubt._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(doubt),
          credentials: "include",
        })
          .then((data) => {
            fetchStudentDoubts();
          })
          .then(() => {
            // Swal2.fire("Done!", "The status has been updated", "success");
            setteacherDocUploadid(doubt._id);
            let modal = new bootstrap.Modal(
              document.getElementById("teacherDoubtAttach")
            );
            modal.show();
          })
          .catch((error) => {
            console.error("Error updating material:", error);
          });
      }
    });
  };

  const handleSetSection = (e) => {
    setSections([]);
    setSTeacher("All");
    setselectedStatus("All");
    setselectedClass(e.target.value);
    getSections(e.target.value);
  };

  const handleFilter = (e) => {
    setselectedSection(e.target.value);
    setSTeacher("All");
    setselectedStatus("All");
    let sts = doubts.filter((item) => item.section_id === e.target.value);
    setStatusSpecific(sts);
  };

  const handleAllStatus = (e) => {
    setselectedStatus(e.target.value);
    setSTeacher("All");
    setselectedClass(null);
    setselectedSection(null);
    setSections([]);
    if (e.target.value !== "All") {
      let sts = doubts.filter((item) => String(item.status) == e.target.value);
      setStatusSpecific(sts);
    } else {
      setStatusSpecific(doubts);
    }
  };

  const handleTeacherFilter = (e) => {
    // const sts = doubts?.filter((item) => {
    //   if (filteringTeacher) {
    //     return item.teacherId._id === e.target.value;
    //   } else {
    //     return item;
    //   }
    // });
    setSTeacher(e.target.value);
    setselectedClass(null);
    setselectedSection(null);
    setselectedStatus("All");
    setSections([]);
    if (e.target.value !== "All") {
      const sts2 = doubts?.filter(
        (item) => item.teacher[0]._id[0] === e.target.value
      );
      setStatusSpecific(sts2);
    } else {
      setStatusSpecific(doubts);
    }
  };

  return (
    <div>
      <div className="row align-items-center card px-3">
        <div className="border-0 mb-4">
          <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
            <h2 className="fw-bold text-primary">Student Doubt</h2>
          </div>
          <div className="d-flex gap-5 align-items-center ">
            <div className="shadow-lg">
              {/* Class */}
              <div className="dropdown d-inline-flex m-1 ">
                <select
                  className="form-select"
                  aria-label="Default select Class"
                  onChange={handleSetSection}
                  name="class_id"
                >
                  <option defaultChecked value={null}>
                    All Classes
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
              {/* Section */}
              <div className="dropdown d-inline-flex m-1">
                <select
                  className="form-select"
                  aria-label="Default select Class"
                  onChange={handleFilter}
                  name="class_id"
                >
                  <option defaultChecked value={null}>
                    All Sections
                  </option>
                  {sections?.map((item, idx) => {
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
            </div>
            {/* Teacher */}
            {type === "admin" && (
              <div className="shadow-lg">
                <div className="dropdown d-inline-flex m-1">
                  <select
                    className="form-select"
                    aria-label="Default select Class"
                    onChange={handleTeacherFilter}
                    name="class_id"
                  >
                    <option defaultValue value={"All"}>
                      All Teachers
                    </option>
                    {teachers?.map((item, idx) => {
                      return (
                        <option
                          key={idx}
                          value={item._id}
                          selected={sTeacher === item._id}
                        >
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            )}
            {/* Completed */}
            <div className="shadow-lg">
              <div className="dropdown d-inline-flex m-1">
                <select
                  className="form-select"
                  aria-label="Default select Class"
                  onChange={handleAllStatus}
                  name="status"
                >
                  {" "}
                  <option value={false} selected={selectedStatus === false}>
                    Not Completed
                  </option>
                  <option value={true} selected={selectedStatus === true}>
                    Completed
                  </option>
                  <option value={"All"} selected={selectedStatus === "All"}>
                    All Status
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      {type === "admin" ? (
        <InstilTable
          tableState={tableState}
          titles={["For", "Student", "Date", "View", "Status", "Rating"]}
          rows={statusSpecific.map((doubt, idx) => ({
            For: doubt?.teacher[0]?.name,
            Student: doubt?.student[0]?.name,
            Date: moment(doubt.date).format("D MMM"),
            View: (
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#viewDoubt"
                onClick={() => setView(doubt)}
              >
                <AiOutlineEye />
              </button>
            ),
            Status: doubt?.isDeleted ? (
              <div className="form-check form-switch theme-switch">
                <FcDeleteDatabase size={20} />
              </div>
            ) : (
              <div className="form-check form-switch theme-switch">
                <input
                  disabled={myId !== doubt?.teacherId?._id && true}
                  style={{ height: 20, width: 20 }}
                  type="checkbox"
                  id={`theme-switch-${idx}`}
                  checked={doubt.status ? true : false}
                  onChange={(e) => handleStatus(e, doubt)}
                />
              </div>
            ),
            Rating: [...Array(Number(doubt.feedback))].map((item, idx) => {
              return (
                <i className="icofont-star text-warning fs-6" key={idx}></i>
              );
            }),
          }))}
        />
      ) : (
        <InstilTable
          tableState={tableState}
          titles={["Sr. no", "Student", "Date", "View", "Status"]}
          rows={statusSpecific?.map((doubt, idx) => ({
            "Sr. no": idx + 1,
            Student: doubt?.student[0]?.name,
            Date: moment(doubt.date).format("D MMM"),
            View: (
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#viewDoubt"
                onClick={() => setView(doubt)}
              >
                <AiOutlineEye />
              </button>
            ),
            Status: doubt?.isDeleted ? (
              <div className="form-check form-switch theme-switch">
                <FcDeleteDatabase size={20} />
              </div>
            ) : (
              <div className="form-check form-switch theme-switch">
                <input
                  style={{ height: 20, width: 20 }}
                  type="checkbox"
                  id={`theme-switch-${idx}`}
                  checked={doubt.status ? true : false}
                  onChange={(e) => handleStatus(e, doubt)}
                />
              </div>
            ),
          }))}
        />
      )}

      <ViewStudentDoubt formId={"viewDoubt"} doubt={view} type={"other"} />

      <FileUploadModal
        setteacherDocUploadid={setteacherDocUploadid}
        teacherDocUploadid={teacherDocUploadid}
      />
    </div>
  );
}

const FileUploadModal = ({ setteacherDocUploadid, teacherDocUploadid }) => {
  const [file, setfile] = useState("");
  const handleFileInputChange = (event) => {
    const { name, files } = event.target;
    const file = files[0];
    setfile(file);
  };

  const submitTeacherFile = async (newComplain) => {
    const formData = new FormData();

    try {
      formData.append("attachDocument", file);

      await fetch(
        `${SERVER}/StudentDoubt/addTeacherDoc/${teacherDocUploadid}`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setteacherDocUploadid(null);
            Swal2.fire({
              title: "Success",
              text: "File Added Successfully",
              icon: "success",
              timer: 3000,
            });
          }
        });

      // getComplaint();
    } catch (error) {
      console.error("Error creating material:", error);
    }
  };
  return (
    <div
      className="modal fade"
      id="teacherDoubtAttach"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title  fw-bold">successfully update</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div>
              <label for="formFile" class="form-label">
                {" "}
                want to upload a file also ?
              </label>
              <input
                onChange={handleFileInputChange}
                class="form-control"
                type="file"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={submitTeacherFile}
            >
              Submit
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
