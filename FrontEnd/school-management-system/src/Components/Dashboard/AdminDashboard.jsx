import FeeDash from "./dashboardMaterials/D1/FeeDash";
import AttendenceDash from "./dashboardMaterials/D1/AttendenceDash";
import DoubtDash from "./dashboardMaterials/D1/DoubtDash";
import QueryDash from "./dashboardMaterials/D1/QueryDash";
import TotalData from "./dashboardMaterials/D2/TotalData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useState } from "react";
import AdminD from "./dashboardMaterials/AdminD/AdminD";
import ComplainD from "./dashboardMaterials/ComplainD/ComplainD";
import AnonyCOmplainD from "./dashboardMaterials/ComplainD/AnonyComplainD";
import { DonutChart } from "./dashboardMaterials/Graphs/Donut";
import { TimeSeriesChart } from "./dashboardMaterials/Graphs/TimeSeries";
import {
  ClassCourseProgressGraph,
  RadialChart,
  TeacherDoubtPerformanceGraph,
} from "./dashboardMaterials/Graphs/Radial";
import {
  ColumnChart,
  ColumnChartPerform,
} from "./dashboardMaterials/Graphs/Column";
import { HeatMap } from "./dashboardMaterials/Graphs/HeatMap";
import { SERVER } from "../../config";
import SplineArea from "./dashboardMaterials/Graphs/SplineArea";
import {
  getAllClassApi,
  getAllStaffsApi,
  getAssigmentsCount,
  getClassExamsCout,
  getClassSectionsApi,
} from "./apis";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import Swal2 from "sweetalert2";

export default function AdminDashboard() {
  const [startDate, setStartDate] = useState();
  const [data, setData] = useState({});
  const [allClasses, setallClasses] = useState([]);
  const [allstaffs, setallstaffs] = useState([]);
  const [notice, setNotice] = useState([]);

  // doubt performance related state------------------------

  const getDashBoardData = async (payload) => {
    // console.log(payload);

    const response = await fetch(`${SERVER}/dashboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    // console.log(response);
    const data = await response.json();
    // console.log(data);
    setData(data);
  };

  useEffect(() => {
    getDashBoardData({
      startDate: new Date(),
      endDate: new Date(),
    });

    //    console.log("Best teachers: ",data.bestTeachers)
  }, []);

  const fetchNotices = async () => {
    await axios
      .get(`${SERVER}/notice/`, { withCredentials: true })
      .then((res) => setNotice(res.data.Notices));
  };
  useEffect(() => {
    fetchNotices();
  }, []);
  useEffect(() => {
    if (data.doubtP?.teachPerform) {
      let max = [];
      let bst = data.doubtP.teachPerform;
      // console.log(data?.doubtP);
    }
  }, [data]);

  const handleDate = async (e) => {
    if (!e.target) {
      setStartDate(e);
      return getDashBoardData({
        startDate: new Date(e),
        endDate: new Date(),
      });
    }
    const startDate =
      e.target.name === "today"
        ? new Date()
        : e.target.name === "lastWeek"
        ? new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
        : e.target.name === "lastMonth"
        ? new Date(new Date().setMonth(new Date().getMonth() - 1))
        : new Date(e.value);
    getDashBoardData({
      startDate,
      endDate: new Date(),
    });
  };

  // getting all the classesss
  const fetchAllClass = async () => {
    const response = await getAllClassApi();
    setallClasses(response);
  };

  const fetchAllActiveStaffs = async () => {
    const response = await getAllStaffsApi();
    let filterdata = response.map((item) => ({
      name: item.name,
      _id: item._id,
    }));
    setallstaffs(filterdata);
  };
  useEffect(() => {
    fetchAllClass();
    fetchAllActiveStaffs();
  }, []);

  return (
    <div style={{ width: "calc(100vw - 302px)" }}>
      <div className="border-0 mb-4">
        <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
          <h3 className="fw-bold mb-0">Dashboard</h3>
          <NoticeAdd fetchNotices={fetchNotices} />
          <div className="col-auto d-none w-sm-100">
            <div
              className="btn-group"
              role="group"
              aria-label="Basic outlined example"
            >
              <button
                type="button"
                className="btn btn-outline-primary"
                name="today"
                onClick={handleDate}
              >
                Today
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                name="lastWeek"
                onClick={handleDate}
              >
                Last Week
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                name="lastMonth"
                onClick={handleDate}
              >
                Last Month
              </button>
            </div>
            <div style={{ marginLeft: "2em" }}>
              <DatePicker
                selected={startDate}
                max={new Date().toISOString().split("T")[0]}
                onChange={handleDate}
                maxDate={new Date()}
                className="btn btn-outline-primary"
                placeholderText="Select Custom Date"
              />
            </div>
          </div>
        </div>
      </div>

      {/* row-1 */}
      <div className="row mb-3">
        <div className="col-md-8">
          <div className="card">
            <div className="row card-body">
              <FeeDash fee={data.fee} />
              <AttendenceDash attendance={data.attendance} />
              <DoubtDash doubt={data.doubt} />
              <QueryDash query={data.query} />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <div className="card-body bg-primary">
              <div className="row">
                <div className="col-lg-2">
                  <span className="avatar lg bg-white rounded-circle text-center d-flex align-items-center justify-content-center">
                    <i className="icofont-rupee fs-2"></i>
                  </span>
                </div>
                <div style={{ width: "5px" }}></div>
                <div className="col-lg-5">
                  <h1 className="mt-3 mb-0 fw-bold text-white">Fee</h1>
                </div>
              </div>

              <span className="text-white">
                INR {data?.fee?.paid || 0} - <b>Collected</b>
              </span>
              <br />
              <span className="text-white">
                INR {data?.fee?.due || 0} - <b>Pending</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* row-2 */}
      <div className="row mb-3">
        <div className="col-lg-4">
          <div className="card">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{ width: "100%" }}
                className="card-header  d-flex justify-content-between bg-transparent border-bottom-0"
              >
                <h6 className="mb-0 fw-bold ">Total Students</h6>
                <h4 className="mb-0 fw-bold ">
                  {data?.total?.students &&
                    Number(data.total.students.boys ?? 0) +
                      Number(data.total.students.girls ?? 0)}
                </h4>
              </div>
              <div className="card-body">
                {/* <div className="mt-3"> */}
                <DonutChart students={data?.total?.students} />
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card p-3">
            <TotalData total={data.total} />
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card py-2">
            <TimeSeriesChart
              data={data.time_series_data}
              totalC={data.totalWC}
            />
          </div>
        </div>
      </div>

      {/* row-3 */}
      <div className="row mb-3">
        <div className="col-12">
          <div className="card">
            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
              <h6 className="mb-0 fw-bold ">Staff Attendance</h6>
            </div>
            <SplineArea data={data.staff_attendanceReport} />
          </div>
        </div>
      </div>

      {/* row-4 */}
      <div className="row mb-3">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              {/* classes conducted report */}
              <ColumnChartPerform
                classes={allClasses.length > 0 ? allClasses : null}
              />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              {/* classes conducted report */}
              <ClassCourseProgressGraph
                classes={allClasses.length > 0 ? allClasses : null}
              />
            </div>
          </div>
        </div>
      </div>

      {/* row-5 */}
      <div className="row mb-3">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
              <h6 className="mb-0 fw-bold ">Semester Performance</h6>
            </div>
            <ColumnChart data={data.classToppers} />
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
              <h6 className="mb-0 fw-bold ">Class wise Examinations</h6>
            </div>
            <ClassWiseExaminationCount
              classes={allClasses.length > 0 ? allClasses : null}
            />
          </div>
        </div>
      </div>

      {/* row-6 */}
      <div className="row mb-3">
        <div className="col-lg-8">
          <div className="card h-100 ">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
              <div className="info-header">
                <h6 className="mb-0 fw-bold ">Total Assignments</h6>
              </div>
            </div>
            <TotalAssignmentGraph
              classes={allClasses.length > 0 ? allClasses : null}
            />
          </div>
        </div>

        <div className="col-lg-4">
          <TeacherDoubtPerformanceGraph
            allstaffs={allstaffs ?? null}
            data={data.teachDoubtPerformance}
          />
        </div>
      </div>
      <div className="row d-flex justify-content-center mb-5">
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
      <div className="row mb-5">
        <HeatMap classes={data.secAttt?.classes} />
      </div>
      {/* row-7 */}
      <div className="row mb-3">
        <div className="col-lg-6">
          <ComplainD complaints={data.complaints} />
        </div>
        <div className="col-lg-6">
          <AnonyCOmplainD complaints={data.anonoymousComplaints} />
        </div>
      </div>

      {/* row-8 */}
      <div className="row mb-3">
        <div className="col-lg-6">
          <ClassTopperList data={data.classToppers} />
        </div>
        <div className="col-lg-6">
          <BestTeachersList
            allstaffs={allstaffs ?? null}
            data={data.teachDoubtPerformance}
          />
        </div>
      </div>

      <div className="row mb-3 justify-content-center">
        <div className="col-lg-6 bg-white h-100">
          <AdminD />
        </div>
      </div>
    </div>
  );
}

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

function BestTeachersList({ allstaffs, data }) {
  let performanceReport =
    (data &&
      data.map((item) => {
        let teacherData = allstaffs.find((item2) => item2._id === item._id);
        let finalObject = {
          name: "",
          id: "",
          solved: 0,
          pending: 0,
          total: 0,
          performance: 0,
        };
        if (teacherData) {
          let performance = (item.totalRating / (item.count * 5)) * 100;

          finalObject.name = teacherData.name;
          finalObject.id = teacherData._id;
          finalObject.solved = item.solved;
          finalObject.pending = item.pending;
          finalObject.total = item.count;
          finalObject.performance = performance;
        }
        return finalObject;
      })) ||
    [];
  performanceReport = performanceReport.filter(
    (item) => item.performance !== 0
  );
  performanceReport.sort((a, b) => b.performance - a.performance);
  const top5Teachers = performanceReport.slice(0, 5);
  return (
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold ">Best Teachers</h6>
      </div>
      <table id="patient-table" className="table table-hover align-middle mb-0">
        <thead>
          <tr>
            {/* <th>Id</th> */}
            <th>Teacher Name</th>
            <th>Performance</th>
            <th>Solved</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {top5Teachers.map((item, idx) => {
            return (
              <tr key={idx}>
                <td>
                  <img
                    src={"assets/images/xs/avatar1.jpg"}
                    className="avatar sm rounded-circle me-2"
                    alt="profile-image"
                  />
                  {item.name}
                </td>
                <td>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    aria-valuenow="25"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {item.performance.toFixed(2)}%
                  </div>
                </td>
                <td>{item.solved}</td>
                <td>{item.total}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ClassWiseExaminationCount({ classes }) {
  const [selectedClass, setselectedClass] = useState(null);
  const [data, setdata] = useState(null);

  const options = {
    chart: {
      height: 300,
      type: "bar",
    },
    colors: [
      "var(--chart-color1)",
      "var(--chart-color2)",
      "var(--chart-color3)",
    ],
    plotOptions: {
      bar: {
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: data && data.map((item) => "section " + item.sectionname),
    },
    yaxis: {
      title: {
        text: "Exam Count",
      },
    },
    fill: {
      opacity: 1,
    },
  };

  const fetchclasswiseexamcount = async (id) => {
    setselectedClass(id);
    const { data, success } = await getClassExamsCout(id);
    if (success) {
      setdata(data);
    }
  };

  const series = [
    {
      name: "Exam Count",
      data: data && data.map((item) => item.examCount),
    },
  ];

  useEffect(() => {
    if (classes && classes.length > 0) {
      fetchclasswiseexamcount(classes[0]._id);
    }
  }, [classes]);

  return (
    <div>
      <select
        className="btn btn-outline"
        onChange={(e) => fetchclasswiseexamcount(e.target.value)}
      >
        <option value="">Select class</option>
        {classes &&
          classes?.map((item) => (
            <option
              key={item._id}
              value={item._id}
              selected={item._id === selectedClass}
            >{`class ${item.name}`}</option>
          ))}
      </select>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={320}
      />
    </div>
  );
}

const TotalAssignmentGraph = ({ classes }) => {
  const [userData, setUserData] = useState([]);
  const [chartData, setChartData] = useState({ series: [], options: {} });
  const [selectedClass, setselectedClass] = useState(null);
  const [selectedSection, setselectedSection] = useState(null);
  const [allsections, setallsections] = useState([]);

  // useEffect(() => {}, []);

  const fetchClassSectionsHandler = async (classId) => {
    setselectedClass(classId);
    const {
      data: { data },
      status,
    } = await getClassSectionsApi(classId);
    if (status === 200) {
      let update = data.map((item) => ({
        _id: item._id,
        name: item.name,
      }));
      setallsections(update);
      if (update.length > 0) {
        setselectedSection(update[0]._id);
      }
    }
  };

  const getDataFromSection = async (sectionid) => {
    const { data, success } = await getAssigmentsCount(
      selectedClass,
      sectionid
    );
    if (success) {
      setUserData(data);
    }
  };

  useEffect(() => {
    if (classes && classes.length > 0) {
      fetchClassSectionsHandler(classes[0]._id);
    }
  }, [classes]);

  useEffect(() => {
    if (selectedSection) {
      getDataFromSection(selectedSection);
    }
  }, [selectedSection]);

  useEffect(() => {
    const subjects = {};
    userData.forEach((data) => {
      const { month, subjects: monthSubjects } = data;
      Object.keys(monthSubjects).forEach((subjectId) => {
        const subjectName = monthSubjects[subjectId].subjectName;
        if (!subjects[subjectName]) {
          subjects[subjectName] = {
            name: subjectName,
            data: [],
          };
        }
        subjects[subjectName].data.push(monthSubjects[subjectId].noOfAsgn);
      });
    });

    const series = Object.values(subjects);

    const options = {
      series,
      chart: {
        type: "bar",
        stacked: true,
      },

      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            total: {
              enabled: true,
              offsetX: 0,
              style: {
                fontSize: "10px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      xaxis: {
        categories: userData.map((data) => data.month),
        labels: {
          formatter: function (val) {
            return val;
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " assignments";
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
      },
    };

    setChartData({ series, options });
  }, [userData]);

  return (
    <div className="card-body">
      <div>
        <select
          className="btn btn-outline"
          onChange={(e) => fetchClassSectionsHandler(e.target.value)}
        >
          <option value="">Select class</option>
          {classes &&
            classes?.map((item) => (
              <option
                key={item._id}
                value={item._id}
                selected={item._id === selectedClass}
              >{`class ${item.name}`}</option>
            ))}
        </select>

        <select
          className="btn btn-outline"
          onChange={(e) => setselectedSection(e.target.value)}
        >
          <option value="">Select Section</option>
          {allsections &&
            allsections?.map((item) => (
              <option
                key={item._id}
                value={item._id}
                selected={item._id === selectedSection}
              >{`class ${item.name}`}</option>
            ))}
        </select>
      </div>
      <div id="apex-timeline">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={250}
        />
      </div>
    </div>
  );
};

const NoticeAdd = ({ fetchNotices }) => {
  const [showDateInput, setShowDateInput] = useState(false);
  const [noticeInputs, setNoticeInputs] = useState({
    title: "",
    desc: "",
    type: "general",
    date: "",
  });
  const [file, setFile] = useState(null);
  const noticeInputChange = (e) => {
    setNoticeInputs({ ...noticeInputs, [e.target.name]: e.target.value });
    if (!Object.values(noticeInputs).some((item) => item === "")) {
      // setisdisable(false);
    }
  };
  const handleAddNotice = async () => {
    try {
      const noticeData = new FormData();

      for (const key in noticeInputs) {
        noticeData.append(key, noticeInputs[key]);
      }
      noticeData.append("material", file);

      let response = await fetch(`${SERVER}/notice/addnotice`, {
        method: "POST",
        body: noticeData,
        credentials: "include",
      });
      response = await response.json();
      if (response) {
        setFile(null);
        setNoticeInputs({
          title: "",
          desc: "",
          type: "general",
          date: "",
        });
        setShowDateInput(false);
        fetchNotices();
        Swal2.fire({
          title: "Notice Added",
          // text: "successfully ",
          icon: "success",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <button
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addNoticeModal"
      >
        Add Notice
      </button>
      {/* Add Notice */}
      <div
        class="modal fade"
        id="addNoticeModal"
        tabindex="-1"
        aria-labelledby="addNoticeModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addNoticeModalLabel">
                Add Notice
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <div className="d-flex flex-column gap-3">
                  <label htmlFor="name">Title</label>
                  <input
                    type="text"
                    name="title"
                    className=" form-control"
                    value={noticeInputs.title}
                    onChange={noticeInputChange}
                  />
                  <label htmlFor="desc">Description</label>
                  <textarea
                    value={noticeInputs.desc}
                    onChange={noticeInputChange}
                    class="form-control"
                    id="desc"
                    name="desc"
                    rows="3"
                    placeholder="Enter notice description"
                  ></textarea>

                  <div className="d-flex gap-3">
                    <div className="w-75">
                      <label htmlFor="material">Add Material</label>
                      <input
                        className="form-control"
                        type="file"
                        id="material"
                        accept=".pdf"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file || file.type !== "application/pdf") {
                            alert("Please select a PDF file");
                            return;
                          } else {
                            setFile(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                    <div className="w-25">
                      <label htmlFor="type">Type</label>
                      <select
                        class="form-control"
                        id="noticeType"
                        name="type"
                        value={noticeInputs.type}
                        onChange={noticeInputChange}
                      >
                        <option value="general">General</option>
                        <option value="event">Event</option>
                        <option value="holiday">Holiday</option>
                        <option value="exam">Exam</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="w-50 form-check form-check">
                      <input
                        type="checkbox"
                        className="form-check-input text-lg"
                        name="event"
                        checked={showDateInput}
                        onChange={() => setShowDateInput(!showDateInput)}
                      />
                      <label
                        class="form-check-label"
                        style={{ fontSize: 15 }}
                        for="event"
                      >
                        Add to Event
                      </label>{" "}
                    </div>
                    {showDateInput && (
                      <div className="w-50">
                        <label htmlFor="eventDate">Event Date:</label>
                        <input
                          type="date"
                          id="eventDate"
                          name="date"
                          className="form-control"
                          onChange={noticeInputChange}
                          value={noticeInputs.date}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={handleAddNotice}
                disabled={
                  noticeInputs.title.trim() === "" ||
                  noticeInputs.desc.trim() === "" ||
                  (showDateInput && noticeInputs.date === "")
                }
                type="button"
                class="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Submit Notice
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
