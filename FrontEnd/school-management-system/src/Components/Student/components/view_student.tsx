import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import SubjectWise from "../../dashtest/charts/SubjectWise.jsx";
import TotalAssignment from "../../dashtest/charts/TotalAssignment.jsx";
import SubjectAnalytics from "../../dashtest/charts/SubjectAnalytics.jsx";
import Progress from "../../dashtest/charts/Progress.jsx";
import TotalClasses from "../../dashtest/charts/TotalClasses.jsx";
import Performance from "../../dashtest/charts/Performance.jsx";
import TotalMarks from "../../dashtest/charts/TotalMarks.jsx";
import { InstilTable, TableState } from "../../MainComponents/InstillTable.js";
import ViewDoubt from "../../StudentDoubt/ViewDoubt.jsx";
import { SERVER } from "../../../config.js";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import { AiFillEye } from "react-icons/ai";
import { FcExpired } from "react-icons/fc";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import moment from "moment";
import { AiOutlineEye } from "react-icons/ai";
import { BsReceipt } from "react-icons/bs";
import ViewRecipet from "../../FeeCollection/ViewRecipet.jsx";
import ReactApexChart from "react-apexcharts";
import { StudentDoubtsGraph } from "../../Graphs/admin/TeacherProgressAdmin.jsx";
import { FiEdit } from "react-icons/fi";
import Swal from "sweetalert2";
type ExamProp = Partial<{
  _id: string;
  exam_subject: string;
  exam_subject_name_id: {
    _id: string;
    name: string;
  };
  marksObtain: string;
  exam_id: {
    _id: string;
    exam_type: string;
    exam_name: string;
    exam_date: string;
    exam_time: string;
    exam_duration: string;
    class_id: string;
    admin_id: string;
    school_id: string;
    status: boolean;
    isDeleted: boolean;
  };
  student_id: string;
  school_id: string;
  sectionId: string;
  admin: string;
  status: boolean;
  isDeleted: boolean;
}>;


function StudentView() {
  const navigation = useNavigate();
  const location = useLocation();
  const { sectionId } = location.state;
  const { studentId } = useParams();
  const currentDate = new Date().toISOString().split("T")[0];
  const [doubts, setDoubts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [uploaded, setUploaded] = useState([]);
  const [view, setView] = useState({});
  const [tableState, setTableState] = useState(TableState.LOADING);
  const [feeHistory, setfeeHistory] = useState(null);
  const [examHistory, setexamHistory] = useState({});
  const [reciptDetails, setreciptDetails] = useState(null);

  // console.log("student",location.state);
  const { userData } = location.state
console.log("studentId------------------",studentId)
console.log("studentId------------------",userData?.number)


  const [newStudent, setNewStudent] = useState({});

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };


  const handleStudentUpdate = async (userDataId) => {
    try {
      const response = await fetch(
        `${SERVER}/courseplatform/studentinformation/${userData?.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent)
      })
      const data = await response.json();
      if (data.success) {
        Swal.fire({
          title: "Success",
          text: "Staff updated successfully",
          icon: "success",
        });
        getStudentParent(studentId)

      }

    }

    catch (error) {
      console.error("Error:", error.message);
    }
  };



  const handleFileUpload = async (e, type) => {
    const fileData = new FormData();
    fileData.append(type, e.target.files[0])
    axios
      .put(
        `${SERVER}/courseplatform/editStudent/${userData?.id}`,
        fileData,
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.success) {
          Swal.fire({
            title: "Success",
            text: "Student updated successfully",
            icon: "success",
          });

        }
      });
  }
  const fetchDoubt = async () => {
    try {
      const response = await fetch(
        `${SERVER}/StudentDoubt/student-doubts/${studentId}`,
        {
          credentials: "include",
        }
      )
        .then((res) => res.json())
        .then((data) => setDoubts(data));
    } catch (error) {
      console.error("Error fetching doubts:", error);
    }
  };

  const fetchAssignment = async () => {
    try {

      axios
        .get(`${SERVER}/sessions/active`, { withCredentials: true })
        .then((res) => res.data.data._id)
        .then(async (sessionId) => {
          await axios
            .post(
              `${SERVER}/assignments/getassignmentbysection`,
              { session_id: sessionId, section_id: sectionId, studentId },
              { withCredentials: true }
            )
            .then((res) => {
              setAssignments(res.data.assignments);
              setUploaded(res.data.uploadedAssignments);
            });
        });
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const fetchExams = async () => {
    // .get(`${SERVER}/examlist/bySection/${sectionId}/${studentId}`, {
    // const { data } = await axios.get(
    //   `${SERVER}/examlist/studentView/${studentId}`,
    //   {
    //     withCredentials: true,
    //   }
    // );
    // console.log(data.data);
    await axios
      .get(`${SERVER}/examlist/studentView/${studentId}`, {
        withCredentials: true,
      })
      .then((res) => {
        const groupedByExamId = res?.data?.data?.reduce(
          (acc: any, document: any) => {
            const examId = document?.exam_id?._id;
            acc[examId] = acc[examId] || [];
            acc[examId].push(document);
            return acc;
          },
          {}
        );
        setexamHistory(groupedByExamId);
      });
  };

  const fetchFees = async () => {
    const res = await axios.get(`${SERVER}/courseplatform/fees/${studentId}`, {
      withCredentials: true,
    });
    // console.log(res.data.data, "fees");
    if (res.data.data.length > 0) {
      setfeeHistory(res.data.data);
    } else {
      setfeeHistory(null);
    }
  };

  function convertToMonthName(dateString: string) {
    const [year, month] = dateString.split("-");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthName = monthNames[parseInt(month, 10) - 1];
    return `${year} ${monthName}`;
  }

  useEffect(() => {
    (async () => {
      setTableState(TableState.LOADING);
      fetchDoubt();
      fetchAssignment();
      fetchExams();
      fetchFees();
      setTableState(TableState.SUCCESS);
    })();
  }, []);


  const [studentData, setStudentData] = useState("");

  const [Parent, setParent] = useState("");

  const getStudentParent = async (studentId) => {
    // console.log("object",studentId);
    let url = studentId ? `${userData?.number}?student_id=${studentId}` : studentId;
    try {
      const response = await fetch(`${SERVER}/courseplatform/searchStudent/${url}`, {
        method: "GET",
        credentials: "include",

        headers: {
          "Content-Type": "application/json"
        }
      }
      )
      const data = await response.json();
      console.log("data==================", data.data)
      setStudentData(data.data)
      setParent(data.studentParent);

    }
    catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getStudentParent(studentId)
  }, [])



  return (
    <>
      <ul className="nav nav-tabs nav-justified " role="tablist">
        <li className="nav-item" role="presentation">
          <a
            className="nav-link active text-primary"
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
        <li className="nav-item" role="presentation">
          <a
            className="nav-link text-primary"
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
        <li className="nav-item" role="presentation">
          <a
            className="nav-link text-primary"
            id="justified-tab-2"
            data-bs-toggle="tab"
            href="#justified-tabpanel-2"
            role="tab"
            aria-controls="justified-tabpanel-2"
            aria-selected="false"
          >
            {" "}
            Fee
          </a>
        </li>
        <li className="nav-item" role="presentation">
          <a
            className="nav-link text-primary"
            id="justified-tab-3"
            data-bs-toggle="tab"
            href="#justified-tabpanel-3"
            role="tab"
            aria-controls="justified-tabpanel-3"
            aria-selected="true"
          >
            {" "}
            Profile
          </a>
        </li>
      </ul>

      <div className="tab-content py-5" id="tab-content">
        {/* Tab1 Data */}
        <div
          className="tab-pane active"
          id="justified-tabpanel-0"
          role="tabpanel"
          aria-labelledby="justified-tab-0"
        >
          <div className=" d-flex flex-column gap-5">
            {/* <div className="row d-flex justify-content-between mt-2 px-5">
              {a.map((item) => (
                <SmallBox data={item} />
              ))}
            </div> */}
            <div className="row">
              <div className="col-lg-4">
                <SubjectWise studentid={studentId} />
              </div>
              <div className="col-lg-4 mt-md-3">
                <SubjectAnalytics studentid={studentId} />
              </div>
              <div className="col-lg-4 mt-md-3">
                <Progress studentid={studentId} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <TotalClasses studentid={studentId} />
              </div>
              <div className="col-lg-6 mt-md-3">
                <TotalAssignment studentid={studentId} />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <TotalMarks studentid={studentId} />
              </div>
              <div className="col-lg-6 mt-md-3">
                <StudentExamPerformanceGraph studentid={studentId} />
              </div>
            </div>

            <div className="row">
              <div className="col">
                <StudentDoubtsGraph studentid={studentId} />
              </div>
            </div>
          </div>
        </div>

        {/* Tab2 */}
        <div
          className="tab-pane"
          id="justified-tabpanel-1"
          role="tabpanel"
          aria-labelledby="justified-tab-1"
        >
          {/* Doubt History */}
          <div className="d-flex justify-content-center">
            <div className="w-75">
              <h5 className="mb-0 fw-bold text-center">Doubt History</h5>
              <InstilTable
                tableState={tableState}
                titles={["Sr. no", "Teacher", "View", "Status"]}
                rows={doubts.map((doubt, idx) => ({
                  "Sr. no": idx + 1,
                  Teacher: doubt?.teacherId?.name,
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
                  Status: doubt.feedback
                    ? [...Array(Number(doubt.feedback))].map((item, idx) => {
                      return <FaStar color="orange" />;
                    })
                    : doubt.status
                      ? "Feedback Pending"
                      : "Unsolved",
                }))}
              />
            </div>
          </div>
          {/* Assignment History */}
          <div className="d-flex justify-content-center mt-5">
            <div className="w-75">
              <h5 className="mb-0 fw-bold text-center">Assignment History</h5>
              <InstilTable
                tableState={tableState}
                titles={[
                  "Assignment Name",
                  "View Details",
                  "Status",
                  "Days Remaining",
                ]}
                rows={assignments?.map((assignment: any, idx) => ({
                  "Assignment Name": assignment?.topic,
                  "View Details": (
                    <button
                      className="btn btn-outline-warning"
                      data-bs-toggle="modal"
                      // data-bs-target={`#view${assignment._id}`}
                      onClick={() =>
                        navigation("/viewAssignment/" + assignment._id)
                      }
                    >
                      <AiFillEye className="fs-5" />
                    </button>
                  ),
                  Status: uploaded?.find(
                    (item) => item?.assignment_id === assignment._id
                  ) ? (
                    <button
                      style={{ fontSize: 10 }}
                      type="button"
                      className="btn"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title={
                        "Uploaded on " +
                        uploaded
                          .find(
                            (item) => item?.assignment_id === assignment?._id
                          )
                          ?.createdAt.slice(0, 10)
                      }
                    >
                      {uploaded.find(
                        (item) => item?.assignment_id === assignment?._id
                      )?.marks ? (
                        uploaded.find(
                          (item) => item?.assignment_id === assignment?._id
                        )?.marks +
                        "/" +
                        assignment?.totalMarks
                      ) : (
                        <IoCheckmarkDoneCircle size={20} color="green" />
                      )}
                    </button>
                  ) : assignment?.last_date.split("T")[0] < currentDate ? (
                    <button
                      type="button"
                      className="btn"
                      data-bs-toggle="tooltip"
                      data-bs-placement="bottom"
                      title={
                        "Expired on " + assignment.date_created.slice(0, 10)
                      }
                    >
                      <FcExpired size={25} />
                    </button>
                  ) : (
                    <button type="button" className="btn">
                      <RxCross2 size={20} color="red" />
                    </button>
                  ),
                  "Days Remaining": (() => {
                    const lastDate = new Date(
                      assignment?.last_date.split("T")[0]
                    );
                    const currentDate = new Date();

                    const timeDifference =
                      lastDate.getTime() - currentDate.getTime();
                    const daysRemaining = Math.ceil(
                      timeDifference / (1000 * 3600 * 24)
                    );
                    return <span>{daysRemaining} days</span>;
                  })(),
                }))}
              />
            </div>
          </div>

          {/* Exam History */}
          <div className="d-flex justify-content-center mt-5">
            <div className="w-75">
              <h5 className="mb-0 fw-bold text-center">Exam History</h5>
              <ExamListView groupedData={examHistory} />
            </div>
          </div>
        </div>

        {/* Tab-3 */}
        <div
          className="tab-pane"
          id="justified-tabpanel-2"
          role="tabpanel"
          aria-labelledby="justified-tab-2"
        >
          {/* Fee History */}
          <div className="d-flex justify-content-center">
            <div className="w-75">
              <h5 className="mb-3 fw-bold text-center">Fee History</h5>
              <div className="">
                <div className="card p-3">
                  <table className="table table-striped table-hover mt-2">
                    <thead>
                      <tr>
                        {/* <th scope="col">S.No</th> */}
                        <th scope="col">Date</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Mode</th>
                        <th scope="col">Months</th>
                        <th scope="col">Reciept</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feeHistory ? (
                        feeHistory?.map((item, index) => {
                          let dateArray = item.month.map((item2) => {
                            let x = convertToMonthName(item2);
                            return x;
                          });
                          return (
                            <tr>
                              {/* <th scope="row">{index + 1}</th> */}
                              <td>{moment(item.date).format("DD/MM/YYYY")}</td>
                              <td>{item.amount.toFixed(1)}</td>
                              <td>
                                {item.payment_mode === 1 ? "cash" : "online"}
                              </td>
                              <td>{dateArray.join(", ")}</td>
                              <td>
                                <button
                                  data-bs-toggle="modal"
                                  data-bs-target="#ShowReciept"
                                  className=" btn btn btn-outline-primary"
                                  onClick={() => setreciptDetails(item?._id)}
                                >
                                  <BsReceipt />{" "}
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <td colSpan={4} className="pt-3">
                          <center>No Records Found</center>
                        </td>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* {Tab 4 Data} */}

        <div
          className="tab-pane"
          id="justified-tabpanel-3"
          role="tabpanel"
          aria-labelledby="justified-tab-3" >

          < div className="d-flex flex-column align-items-center ">
            {/* Personal details */}
            <div className=" d-flex w-100 justify-content-end align-items-end"></div>
            <div className="card mb-3 shadow-lg w-100">
              <div className="row g-0">
                <div className="col-md-8">
                  <div className="card-body">
                    <div className="d-flex justify-content-between ">
                      <div>
                        <p style={{ fontSize: 10 }}>Name</p>
                        <h5>{studentData?.name}</h5>
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
                          <p style={{ fontSize: 10 }}>Father Name </p>
                          <p>{Parent?.fathername}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: 10 }}>Mother Name </p>
                          <p>{Parent?.mothername}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: 10 }}>Parent Phone Number </p>
                          <p>{Parent?.phoneNumber}</p>
                        </div>

                        <div>
                          <p style={{ fontSize: 10 }}>Phone Number</p>
                          <p> {studentData.number}</p>
                        </div>

                        <div>
                          <p style={{ fontSize: 10 }}>Student DOB </p>
                          <p>{studentData?.dob?.slice(0, 10)}</p>
                        </div>
                        {/* <div>
                        <p style={{ fontSize: 10 }}>Aadhar Number</p>
                        <br />
                        {userData?.adherNumber ? <p>{userData?.adherNumber}</p> : "Not available"}
                      </div> */}
                        <div>
                          <p style={{ fontSize: 10 }}>Gender</p>
                          <p>{studentData?.gender}</p>
                        </div><div>
                          <p style={{ fontSize: 10 }}>Nationality</p>
                          <p>{userData?.nationality}</p>
                        </div><div>
                          <p style={{ fontSize: 10 }}>Religion</p>
                          <p>{userData?.religion}</p>
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
                      onError={(p) => {
                        p.target.src = "/assets/images/gallery/no-image.png";
                      }}
                    />
                  </>
                  <>
                    <input
                      type="file"
                      className="custom-file-input d-none"
                      id="photo"
                      onChange={(p) => handleFileUpload(p, "photo")}
                    />
                    <p className="text-white">Student ID : {studentData?.studentId}</p>
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
      {/* Doubt Modal */}
      <ViewDoubt formId={"viewDoubt"} doubt={view} />
      <ViewRecipet modalid="ShowReciept" transcation_id={reciptDetails} />

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
                  value={newStudent?.name}
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
                  value={newStudent.number}
                  maxLength={10}
                  onChange={handleChangeEdit}
                  className="form-control"
                  id="number"
                  name="number"
                />
              </div>


              {/* <div className="mb-3">
                <label for="email" className="form-label">
                  Email:
                </label>

                <input
                  type="email"
                  value={newStudent.email}
                  onChange={handleChangeEdit}
                  className="form-control"
                  id="email"
                  name="email"
                />
              </div> */}

            </div>

            <div className="modal-footer">
              <button
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
                className="btn btn-primary"
                id="submitBtn"
                onClick={() => handleStudentUpdate(userData?.id)}
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

const ExamListView = ({ groupedData }) => {
  return (
    <div>
      {Object.keys(groupedData).map((examId) => (
        <div className="card  p-2 mt-2">
          <h5>{groupedData[examId][0]["exam_id"]["exam_name"]}</h5>
          <table className="table  table-hover" key={examId}>
            {/* <h3>Exam ID: {examId}</h3> */}
            <thead>
              <tr>
                <th scope="col">S.NO</th>
                <th scope="col">subject</th>
                <th scope="col">marks</th>
              </tr>
            </thead>
            <tbody>
              {groupedData[examId].map((item, index) => (
                <tr>
                  <td key={item._id}> {index + 1} </td>
                  <td> {item.exam_subject_name_id.name}</td>
                  <td> {item.marksObtain}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

const StudentExamPerformanceGraph = ({ studentid }) => {
  const [data, setdata] = useState(null);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        `${SERVER}/graph/student/performance/${studentid}`,
        {
          withCredentials: true,
        }
      );
      console.log(data);
      if (data.success) {
        setdata(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

export default StudentView;

<div className="modal fade" id="exampleModalCenter" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered" role="document">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLongTitle">Modal title</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        ...
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
