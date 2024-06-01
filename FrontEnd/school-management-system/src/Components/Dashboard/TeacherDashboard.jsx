import React, { useEffect, useState } from "react";
import {
  ColumnChartPerform,
  TeacherWiseAssigmentGraph,
} from "./dashboardMaterials/Graphs/Column";
import axios from "axios";
import { SERVER } from "../../config";
import { Link, useNavigate } from "react-router-dom";
import DonutChartForMyAttendence from "./dashboardMaterials/Graphs/Donut2";
import {
  MdOutlineAssignment,
  MdAssignmentTurnedIn,
  MdOutlineAutoGraph,
} from "react-icons/md";
import { LiaNewspaper } from "react-icons/lia";
import SmallBox from "./dashboardMaterials/DashBox";
import { ClassCourseProgressGraph } from "./dashboardMaterials/Graphs/Radial";
import moment from "moment";
import Swal from "sweetalert2";
import { TeacherDoubtsGraph } from "../Graphs/admin/TeacherProgressAdmin";

function TeacherDashboard() {
  const navigation = useNavigate();

  const [myClasses, setMyClasses] = useState([]);
  const [recentAssignments, setRecentAssignments] = useState([]);
  const [myAttendence, setMyAttendemce] = useState([]);
  const [recentExams, setRecentExams] = useState([]);
  const [unsolvedDoubts, setUnsolvedDoubts] = useState([]);
  const [classToppersList, setclassToppersList] = useState([]);
  const [upcomingDeadline, setUpcomingDeadline] = useState([]);
  const [dashCount, setDashCount] = useState([]);
  const [notice, setNotice] = useState([]);
  useEffect(() => {
    (async () => {
      await axios
        .get(`${SERVER}/hasAllDetail`, { withCredentials: true })
        .then((res) => {
          if (res.data.nullCount > 0) {
            Swal.fire({
              title: "",
              text: "Please add you personal details",
              icon: "warning", // You can use other icons like 'success', 'error', 'question'
              showCancelButton: true,
              confirmButtonColor: "#3085d6", // Optional: Change color of OK button
              cancelButtonColor: "#d33", // Optional: Change color of Cancel button
              confirmButtonText: "Add",
              cancelButtonText: "Later!",
            }).then((result) => {
              if (result.isConfirmed) {
                navigation("/profile");
              }
            });
          }
        });
    })();
  }, []);
  useEffect(() => {
    (async () =>
      await axios
        .get(`${SERVER}/classes`, { withCredentials: true })
        .then((response) => setMyClasses(response.data)))();
    (async () =>
      await axios
        .get(`${SERVER}/dashboard/teacher`, { withCredentials: true })
        .then((response) => {
          setRecentAssignments(response.data?.data.RecentAssignment);
          setMyAttendemce(response.data?.data.TeacherMonthAttendace);
          setUnsolvedDoubts(response?.data.data.StudentUnsolvedDoubts);
          setclassToppersList(response?.data.data.classToppers);
          setUpcomingDeadline(response?.data.data.Deadlines);
          setDashCount(response?.data.data.Dash);
          setNotice(response?.data.data.Notices);
        }))();
  }, []);
  const handleSelectedClassExam = async (classId) => {
    await axios
      .get(`${SERVER}/dashboard/teacher/class/` + classId, {
        withCredentials: true,
      })
      .then((response) => setRecentExams(response.data.data));
  };

  const a = [
    {
      title: "Student Attendence",
      completed: dashCount?.studentattendenceCounts
        ? !dashCount?.studentattendenceCounts?.msg
          ? dashCount?.studentattendenceCounts[0]?.presentStudents
          : 0
        : 0,
      total: dashCount?.studentattendenceCounts
        ? !dashCount?.studentattendenceCounts?.msg
          ? dashCount?.studentattendenceCounts[0]?.totalStudents
          : 0
        : 0,
      icon: <MdOutlineAssignment size={50} />,
    },
    {
      title: "My Attendence",
      completed: myAttendence?.presentCount ? myAttendence?.presentCount : 0,
      total: myAttendence?.totalWorkingDays
        ? myAttendence?.totalWorkingDays
        : 0,
      icon: <MdAssignmentTurnedIn size={50} />,
    },
    {
      title: "Library Contribution",
      completed: dashCount?.librarycount
        ? dashCount?.librarycount[0]?.teacherCount
        : 0,
      total: dashCount?.librarycount
        ? dashCount?.librarycount[0]?.totalCount
        : 0,
      icon: <MdOutlineAutoGraph size={40} />,
    },
    {
      title: "Student Doubts",
      completed: dashCount?.studentdoubtscount
        ? dashCount?.studentdoubtscount[0]?.solvedCount
        : 0,
      total: dashCount?.studentdoubtscount
        ? dashCount?.studentdoubtscount[0]?.totalCount
        : 0,
      icon: <LiaNewspaper size={50} />,
    },
  ];
  return (
    <div
      style={{ width: "calc(100vw - 302px)" }}
      className="d-flex flex-column gap-5"
    >
      <div className="row px-2">
        {a?.map((item, index) => (
          <div key={index} className="col-3 d-flex justify-content-center">
            <SmallBox data={item} />
          </div>
        ))}
      </div>
      {/* Row 1 */}
      <div className="row">
        {/* Carousel1 */}
        <div className="col-6">
          <div
            id="carouselExampleIndicators"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {/*Recent Assignments Listings */}
              <div className="carousel-item active">
                <div className="w-100 bg-info rounded" style={{ height: 350 }}>
                  <div className="card h-100">
                    <div className="card-header pt-3 d-flex justify-content-between align-items-center">
                      <div className="info-header">
                        <h6
                          className="mb-0 fw-bold gap-1 d-flex"
                          onClick={() => navigation("/assignment")}
                        >
                          {/* <MdOutlineAssignment /> */}
                          Recent Assignments Listings
                        </h6>
                      </div>
                    </div>
                    <div className="card-body ">
                      {recentAssignments?.length > 0 ? (
                        <table class="table table-striped">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Title</th>
                              <th scope="col">Subject</th>
                              <th scope="col">Last Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentAssignments?.map((item, index) => (
                              <tr
                                onClick={() =>
                                  navigation("/viewAssignment/" + item._id)
                                }
                              >
                                <th scope="row">{index + 1}</th>
                                <td>
                                  {item?.topic?.length > 10
                                    ? item.topic.slice(0, 10) + "..."
                                    : item.topic}
                                </td>
                                <td>
                                  {item?.subject_id?.name
                                    ? item.subject_id.name
                                    : "No data"}
                                </td>
                                <td>
                                  {moment(item?.last_date).format("DD MMM YY")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="d-flex justify-content-center aling-items-center">
                          No Assignments to show!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Unsubmitted Assignments */}
              {/* <div className="carousel-item">
                <div className="w-100 bg-info rounded" style={{ height: 350 }}>
                  <div className="card h-100">
                    <div className="card-header py-3 d-flex justify-content-between align-items-center">
                      <div className="info-header">
                        <h6 className="mb-0 fw-bold ">
                          UnSubmitted Assignments
                        </h6>
                      </div>
                    </div>
                    <div className="card-body">
                      
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
        {/* Carousel2 */}
        <div className="col-6">
          <div
            id="carouselExampleIndicators2"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {/* Recent Exam Listings */}
              <div className="carousel-item active">
                <div className="w-100 bg-info rounded" style={{ height: 350 }}>
                  <div className="card h-100">
                    <div className="card-header  d-flex justify-content-between align-items-center">
                      <div className="info-header d-flex justify-content-between w-100 ">
                        <h6
                          className="mb-0 fw-bold pt-2"
                          onClick={() => navigation("/examlist")}
                        >
                          Recent Exam Listings{" "}
                        </h6>
                        <select
                          className="btn btn-outline border  mt-0 me-5"
                          onChange={(e) =>
                            handleSelectedClassExam(e.target.value)
                          }
                        >
                          <option>Select Class</option>
                          {myClasses?.map((item, idx) => {
                            return (
                              <option key={idx} value={item._id}>
                                Class {item.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="card-body">
                      {recentExams.length > 0 ? (
                        <table class="table table-striped">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Title</th>
                              <th scope="col">Exam Date</th>
                              <th scope="col">Exam Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentExams?.map((item, index) => (
                              <tr
                                onClick={() =>
                                  navigation("/examlist/" + item._id)
                                }
                              >
                                <th scope="row">{index + 1}</th>
                                <td>
                                  {item?.exam_name > 3
                                    ? item.exam_name.slice(0, 13) + "..."
                                    : item.exam_name}
                                </td>
                                <td>{item?.exam_time}</td>
                                <td>
                                  {moment(item?.exam_date).format("DD MMM YY")}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="d-flex justify-content-center align-items-center">
                          No Exams to show!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Upcoming Deadlines */}
              <div className="carousel-item">
                <div className="w-100 bg-info rounded" style={{ height: 350 }}>
                  <div className="card h-100">
                    <div className="card-header pt-3 d-flex justify-content-between align-items-center">
                      <div className="info-header">
                        <h6 className="mb-0 fw-bold ">Upcoming Deadlines</h6>
                      </div>
                    </div>
                    <div className="card-body ">
                      {upcomingDeadline?.length > 0 ? (
                        <table class="table table-striped">
                          <thead>
                            <tr>
                              <th scope="col">#</th>
                              <th scope="col">Title</th>
                              <th scope="col">Type</th>
                              <th scope="col">Date</th>
                            </tr>
                          </thead>

                          <tbody>
                            {upcomingDeadline?.map((item, index) => (
                              <tr
                              // onClick={() =>
                              //   navigation("/viewAssignment/" + item._id)
                              // }
                              >
                                <th scope="row">{index + 1}</th>
                                <td>
                                  {item?.exam_name
                                    ? item?.exam_name?.length > 3
                                      ? item.exam_name.slice(0, 10) + "..."
                                      : item.exam_name
                                    : item?.topic?.length > 3
                                    ? item.topic.slice(0, 10) + "..."
                                    : item.topic}
                                </td>
                                <td>
                                  {item?.exam_name ? "Exam" : "Assignment"}
                                </td>
                                <td>
                                  {item?.exam_name
                                    ? moment(item?.exam_date).format(
                                        "DD MMM YY"
                                      )
                                    : moment(item?.last_date).format(
                                        "DD MMM YY"
                                      )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="d-flex justify-content-center aling-items-center">
                          No Deadlines to show!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleIndicators2"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleIndicators2"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="row d-flex justify-content-center">
        <div className="col-8">
          <div
            id="carouselnotice"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              {notice?.map((item, index) => (
                <div className={`carousel-item ${index === 1 && `active`}`}>
                  <div
                    className=""
                    style={{
                      height: 350,
                      backgroundImage: `url('/assets/images/gallery/${
                        item?.type === "holiday"
                          ? `holiday.png`
                          : item?.type === "event"
                          ? `event.png`
                          : `exam.png`
                      }')`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                  >
                    <div className="px-5 h-100">
                      <div className="h-50 d-flex align-items-center justify-content-center">
                        <h5
                          className="pt-4 text-center"
                          style={{ marginLeft: 75, marginRight: 75 }}
                        >
                          {item?.title}
                        </h5>
                      </div>
                      <div
                        className="h-50 text-center"
                        style={{ marginLeft: 120, marginRight: 120 }}
                      >
                        <p>{item?.desc}</p>
                        {item?.material && (
                          <a
                            className="btn btn-outline-primary"
                            href={`${SERVER}/notice/${item.material}`}
                            download="addmultiplestudent_sample.xlsx"
                          >
                            More
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselnotice"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselnotice"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 3 */}
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            {/* classes conducted report */}
            <ColumnChartPerform
              classes={myClasses.length > 0 ? myClasses : null}
            />
          </div>
        </div>
        <div className="col-md-4">
          {/* Classes Progress */}
          <ClassCourseProgressGraph
            classes={myClasses.length > 0 ? myClasses : null}
          />
        </div>
      </div>

      {/* Row 4 */}
      <div className="row mb-5" style={{ height: 350 }}>
        <div className="col-4">
          <div className="card bg-white h-100">
            <div className="card-header py-3">
              <h6 className="mb-0 fw-bold ">My Attendence(This Month)</h6>
            </div>
            {/* <RadialChartMultiple /> */}
            <div className="flex text-end">
              <h3 className="fw-bold me-3 mb-5">
                {myAttendence?.totalWorkingDays}
              </h3>
            </div>
            <DonutChartForMyAttendence attendence={myAttendence} />
          </div>
        </div>
        <div className="col-4 ">
          <div className="card bg-white h-100">
            <ClassTopperList data={classToppersList} />
          </div>
        </div>
        <div className="col-4">
          <div className="card h-100">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
              <div className="info-header">
                <h6
                  className="mb-0 fw-bold "
                  onClick={() => navigation("/StudentDoubts")}
                >
                  My UnSolved Doubts{" "}
                </h6>
              </div>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-3">
                {unsolvedDoubts?.map((item, index) => (
                  <Link to={"/StudentDoubts"}>
                    <button
                      key={index}
                      type="button"
                      className="btn btn-warning"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title={
                        "Asked on " +
                        moment(item.createdAt).format("D MMM YYYY")
                      }
                    >
                      {item?.studentId?.name}
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 5 */}
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            {/* classes conducted report */}
            <TeacherWiseAssigmentGraph
              classes={myClasses.length > 0 ? myClasses : null}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            {/* classes conducted report */}
            <TeacherDoubtsGraph />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeacherDashboard;

{
  /* <div className="card">
                    <div className="card-header py-3 d-flex justify-content-between align-items-center">
                      <div className="info-header">
                        <h6 className="mb-0 fw-bold ">Assignments </h6>
                      </div>
                    </div>
                    <div className="card-body">
                      <ol className="list-group list-group-numbered">
                        <p>Title</p>
                      </ol>
                    </div>
                  </div> */
}

export const TodoCard = ({ title, date, desc, badge }) => {
  return (
    <li
      className=" list-group-item d-flex justify-content-between align-items-start my-2 border border-2"
      style={{ height: 75 }}
    >
      <div className="w-100">
        <div className="d-flex justify-content-between">
          <e className="fw-bold">{title}</e>
          <span
            className="badge bg-primary rounded-pill"
            style={{ height: 15 }}
          >
            {badge}
          </span>
        </div>
        <div style={{ fontSize: 10 }} className="text-truncate">
          <e>{date}</e>
          <p>{desc}</p>
        </div>
      </div>
    </li>
  );
};

function ClassTopperList({ data }) {
  return (
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold ">Class Toppers</h6>
      </div>
      <table id="patient-table" className="table table-hover align-middle mb-0">
        <thead>
          <tr>
            <th>No.</th>
            <th>Student Name</th>
            <th>Class</th>
            <th>Total marks</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item, idx) => (
            <tr>
              <td>{idx + 1}.</td>
              <td>
                <img
                  src="assets/images/xs/avatar3.jpg"
                  className="avatar sm rounded-circle me-2"
                  alt="profile-image"
                />
                {item.results.length > 0
                  ? item.results[0]["studentname"]
                  : null}
              </td>
              <td>{item.classname}</td>
              <td>
                {item.results.length > 0 ? item.results[0]["sumOfMarks"] : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const StripTable = (data) => {
  return (
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Title</th>
          <th scope="col">Subject</th>
          <th scope="col">Date</th>
        </tr>
      </thead>
      <tbody>
        {data?.map((item, index) => (
          <tr>
            <th scope="row">{index}</th>
            <td>{title}</td>
            <td>{badge}</td>
            <td>{date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
