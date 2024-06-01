import React, { useEffect, useState } from "react";
import {
  MdOutlineAssignment,
  MdAssignmentTurnedIn,
  MdOutlineAutoGraph,
} from "react-icons/md";
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
import Todolist, { AssignmentCard } from "../dashtest/Todolist";
import SmallBox from "./dashboardMaterials/DashBox";
import { TodoCard } from "./TeacherDashboard";
import { Link } from "react-router-dom";
import { IoAddCircle } from "react-icons/io5";
import AskDoubtModal from "../StudentDoubt/AskDoubtModal";
import { SERVER } from "../../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ReactApexChart from "react-apexcharts";
import { StudentTeacherWiseDoubtsGraph } from "../Graphs/admin/TeacherProgressAdmin";
import moment from "moment";

function StudentMobile() {
  const navigation = useNavigate();
  const [recentAssignment, setRecentAssignment] = useState([]);
  const [unUploadedAssignments, setUnUploadedAssignments] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [myDoubts, setMyDoubts] = useState([]);
  const [Dashdata, setDashData] = useState([]);
  const [event, setEvent] = useState([]);
  const [notice, setNotice] = useState([]);
  const [studentExamperformance, setstudentExamperformance] = useState(null);

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
  const a = [
    {
      title: "Assignment Uploads",
      completed: Dashdata?.assignmentcount?.uploadedAssignments,
      total: Dashdata?.assignmentcount?.totalAssignments,
      icon: <MdOutlineAssignment size={50} />,
    },
    {
      title: "My Attendence",
      completed: Dashdata?.attendance?.presentCount,
      total: Dashdata?.attendance?.totalWorkingDays,
      icon: <MdAssignmentTurnedIn size={50} />,
    },
    {
      title: "My Doubt",
      completed: Dashdata?.doubtcount?.nullDoubts,
      total: Dashdata?.doubtcount?.totalDoubt,
      icon: <LiaNewspaper size={50} />,
    },
  ];
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
            <div className="border-0 d-flex flex-column gap-3">
              <h3 className="fw-bold">Dashboard</h3>
              {/* First */}
              <div className="row" style={{ width: "98vw" }}>
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
                          <div
                            className="card-header py-3 d-flex justify-content-between align-items-center"
                            onClick={() => navigation("/uploadassignments")}
                          >
                            <div className="info-header">
                              <h6 className="mb-0 fw-bold ">
                                Recent Assignments Listings
                              </h6>
                            </div>
                          </div>
                          <div className="card-body">
                            {recentAssignment?.length > 0 ? (
                              <table class="table table-striped">
                                <thead>
                                  <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Subject</th>
                                    <th scope="col">Due Date</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {recentAssignment?.map((item, index) => (
                                    <tr
                                      onClick={() =>
                                        navigation("/uploadassignments")
                                      }
                                    >
                                      <th scope="row">{index + 1}</th>
                                      <td>
                                        {item?.topic?.length > 3
                                          ? item.topic.slice(0, 10) + "..."
                                          : item.topic}
                                      </td>
                                      <td>
                                        {item?.subject_id?.name
                                          ? item.subject_id.name
                                          : "No data"}
                                      </td>
                                      <td>
                                        {moment(item?.last_date).format(
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
                    {/* UnSubmitted Assignments */}
                    <div className="carousel-item">
                      <div
                        className="w-100 bg-info rounded"
                        style={{ height: 350 }}
                      >
                        <div className="card h-100">
                          <div
                            className="card-header  py-3 d-flex justify-content-between align-items-center"
                            onClick={() => navigation("/uploadassignments")}
                          >
                            <div className="info-header">
                              <h6 className="mb-0 fw-bold">
                                Unsubmitted Assignments
                              </h6>
                            </div>
                          </div>
                          <div className="card-body">
                            {unUploadedAssignments?.length > 0 ? (
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
                                  {unUploadedAssignments?.map((item, index) => (
                                    <tr
                                      onClick={() =>
                                        navigation("/uploadassignments")
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
                                        {moment(item?.last_date).format(
                                          "DD MMM YY"
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <div className="d-flex justify-content-center aling-items-center">
                                No Pending Assignment!
                              </div>
                            )}
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
                          <div
                            className="card-header py-3 d-flex justify-content-between align-items-center"
                            onClick={() => navigation("/examlist")}
                          >
                            <div className="info-header">
                              <h6 className="mb-0 fw-bold">Upcoming Exams</h6>
                            </div>
                          </div>
                          <div className="card-body">
                            {upcomingExams?.length > 0 ? (
                              <table class="table table-striped">
                                <thead>
                                  <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Title</th>
                                    <th scope="col">Time</th>
                                    <th scope="col">Exam Date</th>
                                  </tr>
                                </thead>

                                <tbody>
                                  {upcomingExams?.map((item, index) => (
                                    <tr
                                      onClick={() =>
                                        navigation("/examlist/" + item?._id)
                                      }
                                    >
                                      <th scope="row">{index + 1}</th>
                                      <td>
                                        {item?.exam_name?.length > 13
                                          ? item.exam_name.slice(0, 10) + "..."
                                          : item.exam_name}
                                      </td>
                                      <td>
                                        {item?.exam_time
                                          ? item.exam_time
                                          : "No data"}
                                      </td>
                                      <td>
                                        {moment(item?.exam_date).format(
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
                    {/* Doubts */}
                    <div className="carousel-item">
                      <div
                        className="w-100 bg-info rounded"
                        style={{ height: 350 }}
                      >
                        <div className="card h-100">
                          <div
                            className="card-header py-3 d-flex justify-content-between align-items-center"
                            onClick={() => navigation("/StudentDoubt")}
                          >
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
                                  onClick={() => navigation("/StudentDoubt")}
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
              {/* Second */}
              <StudentExamPerformanceGraph
                data={studentExamperformance ? studentExamperformance : null}
              />
              {/* Third */}
              <SubjectWise studentid={Dashdata?.myId} />
              {/* Forth */}
              <TotalClasses studentid={Dashdata?.myId} />
              {/* Fifth */}
              <Progress studentid={Dashdata?.myId} />
              {/* Sixth */}
              <TotalMarks studentid={Dashdata?.myId} />
              {/* Seventh */}
              <TotalAssignment studentid={Dashdata?.myId} />
              {/* Eigth */}
              <div>
                <StudentTeacherWiseDoubtsGraph />
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
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

export default StudentMobile;
