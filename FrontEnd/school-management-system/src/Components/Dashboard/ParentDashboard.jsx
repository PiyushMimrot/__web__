import React, { useEffect, useState } from "react";
import { MdOutlineAssignment, MdAssignmentTurnedIn } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { Calendar, Badge } from "antd";

import { LiaNewspaper } from "react-icons/lia";
import SubjectWise from "../dashtest/charts/SubjectWise";
import Performance from "../dashtest/charts/Performance";
import SubjectAnalytics from "../dashtest/charts/SubjectAnalytics";
import TotalAssignment from "../dashtest/charts/TotalAssignment";
import TotalMarks from "../dashtest/charts/TotalMarks";
import TotalClasses from "../dashtest/charts/TotalClasses";
import Progress from "../dashtest/charts/Progress";
import { TodoCard } from "./TeacherDashboard";
import { Link } from "react-router-dom";
import { IoAddCircle } from "react-icons/io5";
import AskDoubtModal from "../StudentDoubt/AskDoubtModal";
import { SERVER } from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ReactApexChart from "react-apexcharts";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { TbXboxX } from "react-icons/tb";
import { StudentDoubtsGraph } from "../Graphs/admin/TeacherProgressAdmin";

function ParentDashboard() {
  const navigation = useNavigate();
  const [recentAssignment, setRecentAssignment] = useState([]);
  const [unUploadedAssignments, setUnUploadedAssignments] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [myDoubts, setMyDoubts] = useState([]);
  const [Dashdata, setDashData] = useState([]);
  const [event, setEvent] = useState([]);
  const [notice, setNotice] = useState([]);
  const [studentExamperformance, setstudentExamperformance] = useState(null);
  const [todaysProgress, settodaysProgress] = useState([]);
  const [currentItem, setcurrentItem] = useState();
  const [myId, setMyId] = useState();
  useEffect(() => {
    (async () => {
      console.log("Hello");
      const r = await axios
        .get(`${SERVER}/sessions/active`, { withCredentials: true })
        .then((res) => res.data.data._id)
        .then(async (session_id) => {
          //
          await axios
            .post(
              `${SERVER}/studentAlign/getstudentidsession`,
              { session_id },
              { withCredentials: true }
            )
            .then((res) => res.data)
            .then(async (data) => {
              await axios
                .post(
                  `${SERVER}/dashboard/student`,
                  { sectionId: data.section_id, sessionId: data.session_id },
                  { withCredentials: true }
                )
                .then((r) => {
                  const result = r?.data?.data;
                  setRecentAssignment(result?.RecentAssignment);
                  setUpcomingExams(result?.UpcomingExams);
                  setUnUploadedAssignments(result?.MyUnUploadedAssignments);
                  setMyDoubts(result?.MyDoubts);
                  setDashData(result?.Dash);
                  setstudentExamperformance(
                    result?.StudentExamPerformanceGraph
                  );
                  setNotice(result?.Notices);
                  settodaysProgress(result?.TodaysProgress?.data);
                  setMyId(result?.TodaysProgress?.myId);
                });
            });
        });
    })();
    const fetchInfo = async () => {
      const data = await fetch(`${SERVER}/calender/getevent`, {
        credentials: "include",
      });
      if (!data.ok) {
        throw new Error(`HTTP error! Status: ${data.status}`);
      }
      const dateEvent = await data.json();
      setEvent(dateEvent);
    };
    fetchInfo();
  }, []);

  // Calendar
  const getListData = (value) => {
    const formattedDate = value.format("YYYY-MM-DD");
    const filteredEvents = event.filter(
      (event) => event.date === formattedDate
    );
    return filteredEvents.map((event) => ({
      type: event.type || "success",
      content: event.title,
    }));
  };
  const monthCellRender = (value) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        {/* <span>Backlog number</span> */}
      </div>
    ) : null;
  };
  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <div className=" d-flex flex-wrap justify-content-center align-items-center gap-1">
        {listData?.map((item) => (
          <e key={item.content}>
            <Badge status={item.type} />
          </e>
        ))}
      </div>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };
  //Average
  const averages = studentExamperformance?.reduce(
    (acc, item) => {
      acc.studentCount += item.student;
      acc.avgMarksSum += item.avg_marks;
      acc.maxMarksSum += item.max_marks;
      return acc;
    },
    { studentCount: 0, avgMarksSum: 0, maxMarksSum: 0 }
  );
  return (
    <div>
      <div className="body d-flex py-3">
        <div className="container-xxl">
          <div className="row gap-3 mb-3 row-deck ">
            <div className="border-0 d-flex flex-column gap-5">
              {/* First */}
              <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                {/* Heading */}
                <h3 className="fw-bold mb-0">Dashboard</h3>
                {/* Today,last week,(calender).............. */}
                <div className="col-auto d-none w-sm-100">
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Basic outlined example"
                  >
                    <button type="button" className="btn btn-outline-primary">
                      Today
                    </button>
                    <button type="button" className="btn btn-outline-primary">
                      Last Week
                    </button>
                    <button type="button" className="btn btn-outline-primary">
                      Last Month
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-primary ms-5"
                    id="datepicker"
                  >
                    <i className="icofont-calendar"></i> Select Custom Date
                  </button>
                </div>
              </div>

              {/* Third */}
              <div
                className="row"
                style={{
                  height: Window.width > 600 ? 310 : "",
                  overflow: "auto",
                }}
              >
                <div className="col-lg-6 card">
                  <h5 className="fw-bold pt-3">Today's Progress</h5>
                  <table
                    id="patient-table"
                    className="table table-hover align-middle mb-0"
                  >
                    <thead>
                      <tr>
                        <th>S.NO.</th>
                        <th>Subject</th>
                        <th>View</th>
                        <th>Attended</th>
                      </tr>
                    </thead>
                    <tbody>
                      {todaysProgress.length > 0 &&
                        todaysProgress.map((item, idx) => (
                          <tr>
                            <td>{idx + 1}.</td>
                            <td>{item?.classHistory?.subjectId?.name}</td>
                            <td>
                              <button
                                className="btn btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#my-modal"
                                onClick={() => setcurrentItem(item)}
                              >
                                View
                              </button>
                            </td>
                            <td>
                              {item?.absentees?.find(
                                (i) => i?.studentId?._id === myId
                              ) ? (
                                <TbXboxX color="red" size={20} />
                              ) : (
                                <RiCheckboxCircleFill color="green" size={20} />
                              )}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div className="col-lg-6">
                  {/* <AssignmentCard /> */}
                  <ParentQuery />
                </div>
              </div>
              {/* MOdal */}
              <div
                class="modal fade"
                id="my-modal"
                tabindex="-1"
                aria-labelledby="my-modal-title"
                aria-hidden="true"
              >
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title" id="my-modal-title">
                        Progress Details
                      </h5>
                      <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      ></button>
                    </div>
                    <div class="modal-body">
                      {currentItem?.progressData?.map((i) => (
                        <div className="d-flex justify-content-between mx-5">
                          <p>
                            {i?.chapterId?.name}(
                            {
                              i?.chapterId?.topics?.find(
                                (e) => e?._id === i?.topicId
                              )?.topic
                            }
                            )
                          </p>
                          <p className="text-success">+{i?.progress}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* third-2 */}
              <div
                className="row "
                style={{ height: Window.width > 600 ? 350 : "" }}
              >
                <div className="col-lg-6">
                  <Calendar
                    cellRender={cellRender}
                    fullscreen={false}
                    style={{ height: "100%" }}
                    className="bg-primary shadow-lg"
                    onSelect={() => navigation("/calender")}
                  />
                </div>
                <div className="col-lg-6">
                  {/* <AssignmentCard /> */}

                  <div
                    id="carouselExampleControls"
                    className="carousel slide h-100 shadow-lg rounded-lg"
                    data-bs-ride="carousel"
                  >
                    <div className="carousel-inner h-100 bg-white">
                      {/* Recent Assignments */}
                      <div className="carousel-item active">
                        <div
                          className="w-100 bg-info rounded"
                          style={{ height: 350 }}
                        >
                          <div className="card h-100">
                            <div className="card-header py-3 d-flex justify-content-between align-items-center">
                              <div className="info-header">
                                <h6 className="mb-0 fw-bold ">
                                  Recent Assignments Listings
                                </h6>
                              </div>
                            </div>
                            <div className="card-body">
                              <div className="d-flex flex-wrap">
                                {recentAssignment?.map((item) => (
                                  <div
                                    className="w-50 px-2"
                                    onClick={() =>
                                      navigation("/uploadassignments")
                                    }
                                  >
                                    <TodoCard
                                      title={
                                        item?.topic?.length > 3
                                          ? item.topic.slice(0, 10) + "..."
                                          : item.topic
                                      }
                                      date={
                                        "Due: " + item?.last_date?.slice(0, 10)
                                      }
                                      desc={
                                        // a.length > 3 &&
                                        // "Desc: " + a.slice(0, 18) + "..."
                                        "...."
                                      }
                                      badge={
                                        item?.subject_id?.name
                                          ? item.subject_id.name
                                          : "No data"
                                      }
                                    />
                                  </div>
                                ))}
                                <div className=" w-50 px-2 d-flex justify-content-center align-items-center">
                                  <Link
                                    to="/uploadassignments"
                                    className="btn btn-primary"
                                  >
                                    See All
                                  </Link>
                                </div>
                              </div>
                              {/* ) : (
                          <div className="d-flex justify-content-center aling-items-center">
                            No Assignments to show!
                          </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* UnSubmitted Assignments */}
                      <div className="carousel-item">
                        <div
                          className="w-100 bg-info rounded"
                          style={{ height: 350 }}
                        >
                          <div className="card h-100">
                            <div className="card-header py-3 d-flex justify-content-between align-items-center">
                              <div className="info-header">
                                <h6 className="mb-0 fw-bold">
                                  Unsubmitted Assignments
                                </h6>
                              </div>
                            </div>
                            <div className="card-body">
                              <div className="d-flex flex-wrap">
                                {unUploadedAssignments?.map((item) => (
                                  <div
                                    className="w-50 px-2"
                                    onClick={() =>
                                      navigation("/uploadAssignments")
                                    }
                                  >
                                    <TodoCard
                                      title={
                                        item?.topic?.length > 3
                                          ? item.topic.slice(0, 10) + "..."
                                          : item.topic
                                      }
                                      date={
                                        "Due: " + item?.last_date?.slice(0, 10)
                                      }
                                      desc={
                                        // a.length > 3 &&
                                        // "Desc: " + a.slice(0, 18) + "..."
                                        "...."
                                      }
                                      badge={
                                        item?.subject_id?.name
                                          ? item.subject_id.name
                                          : "No data"
                                      }
                                    />
                                  </div>
                                ))}
                                <div className=" w-50 px-2 d-flex justify-content-center align-items-center">
                                  <Link
                                    to="/uploadassignments"
                                    className="btn btn-primary"
                                  >
                                    See All
                                  </Link>
                                </div>
                              </div>
                              {/* ) : (
                          <div className="d-flex justify-content-center aling-items-center">
                            No Assignments to show!
                          </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Upcoming Exams */}
                      <div className="carousel-item">
                        <div
                          className="w-100 bg-info rounded"
                          style={{ height: 350 }}
                        >
                          <div className="card h-100">
                            <div className="card-header py-3 d-flex justify-content-between align-items-center">
                              <div className="info-header">
                                <h6 className="mb-0 fw-bold">Upcoming Exams</h6>
                              </div>
                            </div>
                            <div className="card-body">
                              <div className="d-flex flex-wrap">
                                {upcomingExams?.map((item) => (
                                  <div
                                    className="w-50 px-2"
                                    onClick={() =>
                                      navigation("/examlist/" + item._id)
                                    }
                                  >
                                    <TodoCard
                                      title={
                                        item?.exam_name?.length > 3
                                          ? item.exam_name.slice(0, 10) + "..."
                                          : item.exam_name
                                      }
                                      date={
                                        "On: " + item?.exam_date?.slice(0, 10)
                                      }
                                      desc={
                                        // a.length > 3 &&
                                        // "Desc: " + a.slice(0, 18) + "..."
                                        "...."
                                      }
                                      badge={
                                        item?.exam_time
                                          ? item.exam_time
                                          : "No data"
                                      }
                                    />
                                  </div>
                                ))}
                                <div className=" w-50 p-2 d-flex justify-content-center">
                                  <div className="w-50 py-3 justify-content-center align-items-center">
                                    <Link
                                      to="/examlist"
                                      className="btn btn-primary"
                                    >
                                      See All
                                    </Link>
                                  </div>
                                </div>
                              </div>
                              {/* ) : (
                          <div className="d-flex justify-content-center aling-items-center">
                            No Assignments to show!
                          </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Doubts */}
                      <div className="carousel-item">
                        <div
                          className="w-100 bg-info rounded"
                          style={{ height: 350 }}
                        >
                          <div className="card h-100">
                            <div className="card-header py-3 d-flex justify-content-between align-items-center">
                              <div className="info-header d-flex justify-content-between w-100">
                                <h6 className="mb-0 fw-bold">Pending Doubts</h6>
                                <div className="d-flex gap-1">
                                  <e>
                                    <e className="text-warning">
                                      {" "}
                                      <GoDotFill />
                                    </e>
                                    Unsolved
                                  </e>
                                  <e>
                                    <e className="text-success">
                                      {" "}
                                      <GoDotFill />
                                    </e>
                                    Feedback
                                  </e>
                                </div>
                              </div>
                            </div>
                            <div className="card-body">
                              <div className="d-flex flex-wrap gap-2">
                                {myDoubts?.map((item, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    class={
                                      item.status === false
                                        ? "btn btn-warning"
                                        : " btn btn-success"
                                    }
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title={
                                      item.status
                                        ? "Solved on " +
                                          item?.updatedAt.slice(0, 10)
                                        : "Asked on " +
                                          item?.createdAt.slice(0, 10)
                                    }
                                  >
                                    {item?.doubt && item.doubt.slice(0, 10)}
                                  </button>
                                ))}
                              </div>
                              {/* ) : (
                          <div className="d-flex justify-content-center aling-items-center">
                            No Assignments to show!
                          </div> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target="#carouselExampleControls"
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
                      data-bs-target="#carouselExampleControls"
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

              {/* Forth */}
              <div className="row">
                <div className="col-8 mt-5">
                  <div
                    id="carouselnotice"
                    className="carousel slide"
                    data-bs-ride="carousel"
                  >
                    <div className="carousel-inner">
                      {notice?.map((item, index) => (
                        <div
                          className={`carousel-item ${
                            index === 1 && `active`
                          } `}
                        >
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
                <div className="col-4 mt-5">
                  <SubjectAnalytics
                    studentid={Dashdata?.myId}
                    data={{
                      myavg: averages?.studentCount
                        ? (
                            averages?.studentCount /
                            studentExamperformance?.length
                          )?.toFixed(2)
                        : "00.00",
                      classavg: studentExamperformance
                        ? (
                            averages?.avgMarksSum /
                            studentExamperformance?.length
                          )?.toFixed(2)
                        : 0,
                    }}
                  />
                </div>
              </div>

              {/* Fifth */}
              <div className="row " style={{ height: 350 }}>
                <div className="col-8">
                  <StudentExamPerformanceGraph
                    data={
                      studentExamperformance ? studentExamperformance : null
                    }
                  />
                </div>
                <div className="col-4">
                  <SubjectWise studentid={Dashdata?.myId} />
                </div>
              </div>

              {/* Sixth */}
              <div className="row" style={{ height: 350 }}>
                <div className="col-8 mt-4">
                  <TotalClasses studentid={Dashdata?.myId} />
                </div>
                <div className="col-4 mt-4">
                  <Progress studentid={Dashdata?.myId} />
                </div>
              </div>

              {/* Seventh */}
              <div className="row mt-4">
                <div className="col-lg-6">
                  <TotalMarks studentid={Dashdata?.myId} />
                </div>
                <div className="col-lg-6">
                  <TotalAssignment studentid={Dashdata?.myId} />
                </div>
              </div>

              {/* eight */}
              <div className="row">
                <div className="col-lg-8">
                  <StudentDoubtsGraph />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <DoubtSectionModule />
        </div>
      </div>
    </div>
  );
}

const DoubtSectionModule = () => {
  const [Staff, SetStaffs] = useState([]);
  const [Students, setStudents] = useState([]);

  const Staffs = () => {
    try {
      fetch(`${SERVER}/StudentDoubt/studentClassTeacher`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setStudents(data.data.studentDetail);
          SetStaffs(data.data.teachers);
        });
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const handleSubmit = async (newDoubt) => {
    newDoubt = {
      ...newDoubt,
      classId: Students.Class_id,
      sectionId: Students.section_id,
    };

    try {
      const formData = new FormData();
      for (const key in newDoubt) {
        formData.append(key, newDoubt[key]);
      }

      await fetch(`${SERVER}/StudentDoubt/student-doubts`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      Swal.fire({
        title: "Success",
        text: "Doubt is Submited Successfully",
        icon: "success",
        timer: 3000,
      });
    } catch (error) {
      console.error("Error creating material:", error);
    }
  };

  useEffect(() => {
    Staffs();
  }, []);
  return (
    <div>
      <span
        className="text-primary me-4 mb-3"
        style={{
          position: "fixed",
          bottom: "16px",
          right: "18px",
          cursor: "pointer",
          fontSize: "3.5rem",
        }}
        data-bs-toggle="modal"
        data-bs-target="#askDoubt"
        type="button"
      >
        <IoAddCircle />
      </span>
      <AskDoubtModal
        title={"Ask Doubt"}
        formId={"askDoubt"}
        teachers={Staff}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

const StudentExamPerformanceGraph = ({ data }) => {
  const options = {
    chart: {
      id: "line-chart",
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [5, 5, 5],
      curve: "smooth",
      dashArray: [5, 5, 0],
    },
    xaxis: {
      categories: data && data.map((item) => item.exam_name),
    },
    yaxis: {
      title: {
        text: "Total Marks",
      },
    },
    tooltip: {
      shared: true,
    },
  };

  const series = [
    {
      name: "Topper Marks",
      data: data && data.map((item) => item.max_marks),
      curve: "smooth",
    },
    {
      name: "Average Marks",
      data: data && data.map((item) => Number(item.avg_marks.toFixed("1"))),
      curve: "smooth",
    },
    {
      name: "My Marks",
      data: data && data.map((item) => item.student),
      curve: "smooth",
    },
  ];

  return (
    <div className="card h-100 shadow-lg">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <div className="info-header">
          <h6 className="mb-0 fw-bold ">Average Graph</h6>
        </div>
      </div>
      <div className="card-body">
        <div id="apex-timeline">
          <ReactApexChart
            options={options}
            series={series}
            type="line"
            height={280}
          />
        </div>
      </div>
    </div>
  );
};

const ParentQuery = () => {
  const [allteachers, setallteachers] = useState(null);
  const [selectedTeacher, setselectedTeacher] = useState(null);
  const [complainD, setComplainD] = useState({
    complainTitle: "",
    complainDesc: "",
  });

  const handleChange = (e) => {
    complainD[e.target.name] = e.target.value;
    setComplainD({ ...complainD });
  };

  const fetchAllTeachers = async () => {
    const { data } = await axios.get(
      `${SERVER}/StudentDoubt/studentClassTeacher`,
      {
        withCredentials: true,
      }
    );
    setallteachers(data?.data?.teachers);
  };

  const handleAddQuery = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    complainD["complainTo"] = { toId: selectedTeacher._id, category: "staff" };

    try {
      for (const key in complainD) {
        if (key === "complainTo") {
          formData.append("complainTo", JSON.stringify(complainD.complainTo));
        } else {
          formData.append(key, complainD[key]);
        }
      }

      await fetch(`${SERVER}/complain/add/query`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setselectedTeacher(null);
            setComplainD({ complainTitle: "", complainDesc: "" });
            Swal.fire({
              title: "Success",
              text: "Query Added Successfully",
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

  useEffect(() => {
    fetchAllTeachers();
  }, []);
  return (
    <>
      <div className="card">
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">S.No</th>
                <th scope="col">Teacher</th>
                <th scope="col">Conncet For Query</th>
              </tr>
            </thead>
            <tbody>
              {allteachers &&
                allteachers.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}.</td>
                    <td>{item?.name}</td>
                    <td>
                      <button
                        data-bs-toggle="modal"
                        data-bs-target="#querytospecificTeacher"
                        className="btn btn-success"
                        onClick={() => setselectedTeacher(item)}
                      >
                        Connect
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="modal fade"
        id="querytospecificTeacher"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <form
            onSubmit={handleAddQuery}
            name="complainForm"
            className="modal-content"
          >
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="addholidayLabel">
                Query To {selectedTeacher && selectedTeacher?.name} Sir
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <div className="col-sm-12">
                <label htmlFor="depone" className="form-label">
                  Query Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="complainTitle"
                  value={complainD["complainTitle"]}
                  onChange={handleChange}
                />
              </div>

              <div className="col-sm-12">
                <label htmlFor="depone" className="form-label">
                  Query Description
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  name="complainDesc"
                  value={complainD["complainDesc"]}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-success"
                data-bs-dismiss="modal"
                disabled={
                  complainD.complainDesc === "" ||
                  complainD.complainTitle === ""
                    ? true
                    : false
                }
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ParentDashboard;
