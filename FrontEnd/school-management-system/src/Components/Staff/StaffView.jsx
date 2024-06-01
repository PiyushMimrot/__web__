import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { SERVER } from "../../config";
import axios from "axios";
import { TeacherDoubtsGraph } from "../Graphs/admin/TeacherProgressAdmin";
import { TeacherWiseAssigmentGraph } from "../Dashboard/dashboardMaterials/Graphs/Column";
import { AiOutlineEye } from "react-icons/ai";
import moment from "moment";
import { InstilTable, TableState } from "../MainComponents/InstillTable";
import { FcDeleteDatabase } from "react-icons/fc";
import { useActiveSession } from "../../hooks/basic";
import { FiEdit } from "react-icons/fi";
import Swal from "sweetalert2";


export default function StaffView() {
  const location = useLocation();
  const { staffId } = useParams();
  const [myClasses, setMyClasses] = useState([]);

  // const location = useLocation();
  const { userData } = location.state;


  const [newstaff,setNewStaff] = useState({})

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setNewStaff({ ...newstaff, [name]: value });
  };

  const fetchStaff = async (id) => {
    try {
      const response = await axios.get(`${SERVER}/staffmanage/staff`, {
        withCredentials: true,
      }); // Assuming your backend is running on the same domain
      console.log({ my: response.data });
     
    } catch (error) {
      console.error("Error fetching staffs:", error);
    
    }
  };


  const handleStaffUpdate = async (userDataId) => {  

    let URL = `${SERVER}/staffmanage/staff/${userData?._id}`;

    await fetch(URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newstaff),
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();
        if (data.success) {
          Swal.fire({
            title: "Success",
            text: "Staff updated successfully",
            icon: "success",
          });  
         fetchStaff(userData?._id)
        }
      })
      .catch((error) => {
        console.error("Error updating material:", error);
      });
   };


   const handleFileUpload = async (e, type) => {
    // console.log("userData=================================================",userData)
    const fileData = new FormData();
    fileData.append(type, e.target.files[0]);
      axios
        .put(`${SERVER}/staffmanage/editStaff/${userData?._id}`, fileData, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.success) {
            Swal.fire({
              title: "Success",
              text: "Staff updated successfully",
              icon: "success",
            });
            // getUser();
            // setCopyDetail(true);
          }
        });
    
   
  };






  const getAllClassApi = async () => {
    try {
      const { data } = await axios.get(`${SERVER}/classes`, {
        withCredentials: true,
      });
      setMyClasses(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllClassApi();
  }, []);

  return (
    <>
      {/* <h4 className="card p-2 text-primary fw-bold">
        <center>Ramesh 's Profile</center>
      </h4> */}
      <ul class="nav nav-tabs nav-justified" role="tablist">
        <li class="nav-item" role="presentation">
          <a
            class="nav-link active"
            id="justified-tab-0"
            data-bs-toggle="tab"
            href="#justified-tabpanel-0"
            role="tab"
            aria-controls="justified-tabpanel-0"
            aria-selected="true"
          >
            {" "}
            Performance
          </a>
        </li>
        <li class="nav-item" role="presentation">
          <a
            class="nav-link"
            id="justified-tab-1"
            data-bs-toggle="tab"
            href="#justified-tabpanel-1"
            role="tab"
            aria-controls="justified-tabpanel-1"
            aria-selected="false"
          >
            {" "}
            History
          </a>
        </li>
        <li class="nav-item" role="presentation">
          <a
            class="nav-link"
            id="justified-tab-2"
            data-bs-toggle="tab"
            href="#justified-tabpanel-2"
            role="tab"
            aria-controls="justified-tabpanel-2"
            aria-selected="true"
          >
            {" "}
            Profile
          </a>
        </li>
      </ul>

      <div class="tab-content pt-5" id="tab-content">
        {/* Tab1 Data */}
        <div
          class="tab-pane active"
          id="justified-tabpanel-0"
          role="tabpanel"
          aria-labelledby="justified-tab-0"
        >
          <div className="d-flex justify-content-center">
            <div className="w-75">
              <div className="row mt-3">
                <div className="col-12">
                  <div className="card">
                    <TeacherWiseAssigmentGraph
                      classes={myClasses.length > 0 ? myClasses : null}
                      teacherid={staffId}
                    />{" "}
                  </div>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-12">
                  <div className="card">
                    <TeacherDoubtsGraph teacherid={staffId} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab2 Data */}
        <div
          class="tab-pane"
          id="justified-tabpanel-1"
          role="tabpanel"
          aria-labelledby="justified-tab-1"
        >
          <div className="d-flex justify-content-center">
            <div className="w-75">
              <h5 className="mb-0 fw-bold text-center">Exam History</h5>
              <TeacherExamList teahcerid={staffId} />
            </div>
          </div>

          <div className="d-flex justify-content-center mt-5">
            <div className="w-75">
              <h5 className="mb-0 fw-bold text-center">Assignments History</h5>
              <TeacherAssignments teahcerid={staffId} />
            </div>
          </div>

          <div className="d-flex justify-content-center mt-5">
            <div className="w-75">
              <h5 className="mb-0 fw-bold text-center">Doubts History</h5>
              <TeacherStudentDoubts teacherid={staffId} />
            </div>
          </div>
        </div>
        <div
          class="tab-pane"
          id="justified-tabpanel-2"
          role="tabpanel"
          aria-labelledby="justified-tab-2" >

          < div className="d-flex flex-column align-items-center ">
            {/* Personal details */}
            <div className=" d-flex w-100 justify-content-end align-items-end"></div>
            <div className="card mb-3 shadow-lg w-100">
              <div className="row g-0">
                <div className="col-md-8">
                  <div className="card-body">
                    <div className="d-flex justify-content-between ">
                      <div>
                        <e style={{ fontSize: 10 }}>Name</e>
                        <h5>{userData?.name}</h5>
                      </div>
                      <div className="">
                        <button
                          type="button"
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#tickedit"
                        >
                          <FiEdit size={20} />
                        </button>

                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div>
                          <e style={{ fontSize: 10 }}>Staff Type</e>
                          <p> {userData?.staff_type?.name}</p>
                        </div>
                        <div>
                          <e style={{ fontSize: 10 }}>Phone Number</e>
                          <p> {userData.phone}</p>
                        </div>

                        <div>
                          <e style={{ fontSize: 10 }}>Email Id</e>
                          <p>{userData.email}</p>
                        </div>
                        <div>
                          <e style={{ fontSize: 10 }}>Aadhar Number</e>
                          <br />
                          {userData?.adherNumber ? <p>{userData?.adherNumber}</p> : "Not available"}
                        </div>
                        <div>
                          <e style={{ fontSize: 10 }}>Gender</e>
                          <p>{userData.gender}</p>
                        </div><div>
                          <e style={{ fontSize: 10 }}>Nationality</e>
                          <p>{userData.nationality}</p>
                        </div><div>
                          <e style={{ fontSize: 10 }}>Religion</e>
                          <p>{userData.religion}</p>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
                <div
                  className="col-md-4 bg-primary d-flex flex-column justify-content-start pt-5 align-items-center"
                  style={{ minHeight: 250 }}
                >
                  <>
                    <img
                      src={`${SERVER}/photo/${userData?.photo}`}
                      className="avatar xl rounded-circle img-thumbnail shadow-sm"
                      onError={(e) => {
                        e.target.src = "/assets/images/gallery/no-image.png";
                      }}
                    />
                  </>
                  <>
                    <input
                      type="file"
                      className="custom-file-input d-none"
                      id="photo"
                    onChange={(e) => handleFileUpload(e, "photo")}
                    />
                    <label className="custom-file-label" for="photo">
                      <span className="btn btn-primary">
                        <FiEdit size={20} />{" "}
                      </span>
                    </label>
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* profile Edit Modal */}



      <div
        className="modal fade"
        id="tickedit"
        tabIndex={-1}
        aria-labelledby="modal"
        aria-hidden="true"
       >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="myModalLabel">
                Edit Details
              </h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label for="name" className="form-label">
                  Name:
                </label>

                <input
                  type="text"
                  value={newstaff.name}
                  onChange={handleChangeEdit}
                  className="form-control"
                  id="name"
                  name="name"
                />
              </div>

              <div className="mb-3">
                <label for="number" className="form-label">
                  Phone Number:
                </label>

                <input
                  type="number"
                  value={newstaff.number}
                  maxLength={10}
                  onChange={ handleChangeEdit}
                  className="form-control"
                  id="number"
                  name ="number"
                />
              </div>

              {/* {(currentType === "teacher" || */}
              {/* // currentType === "Accountant" || */}
              {/* // currentType === "admin") && ( */}
              <div className="mb-3">
                <label for="email" className="form-label">
                  Email:
                </label>

                <input
                  type="email"
                  value={newstaff.email}
                  onChange={ handleChangeEdit}
                  className="form-control"
                  id="email"
                  name="email"
                />
              </div>
              {/* )} */}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
                className="btn btn-primary"
                id="submitBtn"
              onClick={()=>handleStaffUpdate(userData?._id)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>





    </>
  );
}

const TeacherExamList = ({ teahcerid }) => {
  const [examlistData, setExamlistData] = useState([]);
  const titles = ["ID", "Name", "Exam Type", "Class", "Exam Date", "View"];
  const fetchExamList = async () => {
    const { data } = await axios.get(
      `${SERVER}/examlist?teahcerid=${teahcerid}`,
      { withCredentials: true }
    );
    setExamlistData(data);
  };

  useEffect(() => {
    fetchExamList();
  }, []);
  return (
    <InstilTable
      tableState={TableState.SUCCESS}
      titles={titles}
      rows={examlistData?.map((item, idx) => ({
        [titles[0]]: idx + 1,
        [titles[1]]: item?.exam_name,
        [titles[2]]: item?.exam_type?.exam_name,
        [titles[3]]: item?.class_id?.name,
        [titles[4]]: moment(item.exam_date).format("D MMM YYYY"),
        [titles[5]]: (
          <Link
            to={`/examlist/${item._id}`}
            className=" btn btn btn-outline-primary "
          >
            <AiOutlineEye />
          </Link>
        ),
      }))}
    />
  );
};

const TeacherAssignments = ({ teahcerid }) => {
  const [assignmentsData, setassignmentsData] = useState([]);
  const activeSession = useActiveSession();
  const titles = ["No.", "Class", "Topic", "View Submission"];
  const navigate = useNavigate();
  const fetchAssigments = async () => {
    const { data } = await axios.get(
      `${SERVER}/assignments/all?teahcerid=${teahcerid}&sessionId=${activeSession?._id}`,
      { withCredentials: true }
    );
    if (data.success) {
      setassignmentsData(data.assigments);
    }
  };

  useEffect(() => {
    if (activeSession) {
      fetchAssigments();
    }
  }, [activeSession]);
  return (
    <InstilTable
      tableState={TableState.SUCCESS}
      titles={titles}
      rows={assignmentsData?.map((item, idx) => ({
        [titles[0]]: item?.isDeleted ? (
          <FcDeleteDatabase size={20} />
        ) : (
          <e>{idx + 1}</e>
        ),
        [titles[1]]: item.class_id.name + "/" + item.section_id.name,
        [titles[2]]: item.topic,
        [titles[3]]: (
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
      }))}
    />
  );
};

const TeacherStudentDoubts = ({ teacherid }) => {
  const [doubts, setdoubts] = useState([]);
  const fetchDoubts = async () => {
    const { data } = await axios.get(
      `${SERVER}/StudentDoubt/studentDoubts?teacherid=${teacherid}`,
      { withCredentials: true }
    );
    setdoubts(data.studentDoubts);
  };

  useEffect(() => {
    fetchDoubts();
  }, []);
  return (
    <InstilTable
      tableState={TableState.SUCCESS}
      titles={["Sr. no", "Student", "Date", "Doubt"]}
      rows={doubts?.map((doubt, idx) => ({
        "Sr. no": idx + 1,
        Student: doubt?.student[0]?.name,
        Date: moment(doubt.date).format("D MMM"),
        Doubt:
          doubt?.doubt.length <= 35
            ? doubt.doubt
            : doubt.doubt.substr(0, 35) + "...",
      }))}
    />
  );
};

