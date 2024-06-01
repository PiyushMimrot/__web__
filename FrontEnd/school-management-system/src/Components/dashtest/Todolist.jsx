import axios from "axios";
import React, { useEffect, useState } from "react";
import { SERVER } from "../../config";
import {
  FaArrowAltCircleLeft,
  FaArrowLeft,
  FaArrowRight,
  FaArrowAltCircleRight,
} from "react-icons/fa";

const dummyData = [
  {
    title: "English",
    desc: "pending at 26/12/2023",
    badge: "Assignment",
  },
  {
    title: "Hindi",
    desc: "pending at 28/12/2023",
    badge: "Assignment",
  },
  {
    title: "LCM",
    desc: "not resolved",
    badge: "Doubt",
  },
];
const dummyComplaint = [
  {
    title: "Complaint 1",
    desc: "Complaint desc",
    feedback: null,
  },
  {
    title: "Complaint 2",
    desc: "Complaint desc 2",
    feedback: true,
  },
];

function Todolist() {
  // const [assignments, setAssignments] = useState([]);
  const [exams, setExams] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [doubts, setDoubts] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const today = new Date();

  const fetchExams = async () => {
    await axios
      .get(`${SERVER}/examlist`, { withCredentials: true })
      .then((response) => {
        const update = response.data.filter(
          (item) => new Date(item.exam_date) < today
        );
        setExams(update);
      });
  };
  const fetchExamResults = async () => {
    await axios
      .get(`${SERVER}/testing/`, { withCredentials: true })
      .then((response) => setExamResults(response.data));
  };
  // const fetchAssignments = async () => {
  //   await axios
  //     .get(`${SERVER}/sessions/active`, { withCredentials: true })
  //     .then((response) => response.data.data._id)
  //     .then(async (sessionId) => {
  //       const res = await axios.post(
  //         `${SERVER}/subject/getSubject`,
  //         { session_id: sessionId },
  //         { withCredentials: true }
  //       );
  //       return { sessionId, data: res.data };
  //     })
  //     .then(
  //       async (finalData) =>
  //         await axios.post(
  //           `${SERVER}/assignments/getassignmentbysection`,
  //           {
  //             session_id: finalData.sessionId,
  //             section_id: finalData.data.studentAlign.section_id,
  //           },
  //           { withCredentials: true }
  //         )
  //     )
  //     .then((result) => {
  //       const update = result.data.filter(
  //         (item) => new Date(item.last_date) > today
  //       );
  //       setAssignments(update);
  //     });
  // };
  const fetchDoubts = async () => {
    await axios
      .get(`${SERVER}/StudentDoubt/student-doubts`, { withCredentials: true })
      .then((response) => setDoubts(response.data));
  };
  const fetchComplaints = async () => {
    await axios
      .get(`${SERVER}/complain/myComplains`, { withCredentials: true })
      .then((response) => setComplaints(response.data));
  };
  useEffect(() => {
    // fetchAssignments();
    fetchExams();
    fetchExamResults();
    fetchDoubts();
    fetchComplaints();
  }, []);
  console.log({ examResults });
  return (
    <div
      id="carouselExampleControls"
      className="carousel slide h-100"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner h-100">
        {/* Assignment */}
        {/* <div className="carousel-item active h-100"></div> */}
        {/* Exam */}
        <div className="carousel-item h-100 bg-light">
          <div className="card">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
              <div className="info-header">
                <h6 className="mb-0 fw-bold ">Upcoming </h6>
              </div>
            </div>
            <div className="card-body">
              <ol className="list-group list-group-numbered">
                {exams?.map((item) => (
                  <TodoCard
                    title={item?.exam_name}
                    desc={item?.exam_date}
                    badge={item?.exam_type?.exam_name}
                  />
                ))}
              </ol>
            </div>
          </div>
          {/* Exam Results */}
          <div className="card">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
              <div className="info-header">
                <h6 className="mb-0 fw-bold ">Exam Results</h6>
              </div>
            </div>
            <div className="card-body">
              <ol className="list-group list-group-numbered">
                {examResults?.map((item) => (
                  <TodoCard
                    title={item.exam_subject_name_id.name}
                    desc={item?.exam_id.exam_date}
                    badge={item?.marksObtain}
                  />
                ))}
              </ol>
            </div>
          </div>
        </div>
        {/* Doubt */}
        <div className="carousel-item h-100">
          <div className="card">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
              <div className="info-header">
                <h6 className="mb-0 fw-bold ">My Doubts</h6>
              </div>
            </div>
            <div className="card-body">
              <ol className="list-group list-group-numbered">
                {doubts?.map((item) => (
                  <TodoCard
                    title={item.teacherId.name}
                    desc={item.doubt}
                    badge={item.feedback}
                  />
                ))}
              </ol>
            </div>
          </div>
        </div>
        {/* Complain */}
        <div className="carousel-item h-100">
          <div className="card">
            <div className="card-header py-3 d-flex justify-content-between align-items-center">
              <div className="info-header">
                <h6 className="mb-0 fw-bold ">My Complaints</h6>
              </div>
            </div>
            <div className="card-body">
              <ol className="list-group list-group-numbered">
                {dummyComplaint?.map((item) => (
                  <TodoCard
                    title={item.title}
                    desc={item.desc}
                    badge={item.feedback}
                  />
                ))}
              </ol>
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
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleControls"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}

export default Todolist;

const TodoCard = ({ title, desc, badge }) => {
  console.log(typeof desc);
  return (
    <li
      className="list-group-item d-flex justify-content-between align-items-start my-2 border border-2"
      style={{ height: 75 }}
    >
      <div className="ms-2 me-auto">
        <div className="fw-bold">{title}</div>
        <p style={{ fontSize: 10 }} className="text-truncate d-block">
          {/* {item?.desc ? item.desc : "No data"} */}
          {desc}
        </p>
      </div>
      <span className="badge bg-primary rounded-pill">
        {badge ? "Solved" : "UnSolved"}
      </span>
    </li>
  );
};

export const AssignmentCard = () => {
  const today = new Date();

  const [assignments, setAssignments] = useState([]);
  const fetchAssignments = async () => {
    await axios
      .get(`${SERVER}/sessions/active`, { withCredentials: true })
      .then((response) => response.data.data._id)
      .then(async (sessionId) => {
        const res = await axios.post(
          `${SERVER}/subject/getSubject`,
          { session_id: sessionId },
          { withCredentials: true }
        );
        return { sessionId, data: res.data };
      })
      .then(
        async (finalData) =>
          await axios.post(
            `${SERVER}/assignments/getassignmentbysection`,
            {
              session_id: finalData.sessionId,
              section_id: finalData.data.studentAlign.section_id,
            },
            { withCredentials: true }
          )
      )
      .then((result) => {
        const update = result.data.filter(
          (item) => new Date(item.last_date) > today
        );
        setAssignments(update);
      });
  };
  console.log({ assignments });
  useEffect(() => {
    fetchAssignments();
  }, []);
  return (
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <div className="info-header">
          <h6 className="mb-0 fw-bold ">Assignments</h6>
        </div>
      </div>
      <div className="card-body">
        <ol className="list-group list-group-numbered">
          {assignments?.map((item) => (
            <TodoCard
              title={item?.topic}
              desc={item?.last_date}
              badge={item?.category}
            />
          ))}
        </ol>
      </div>
    </div>
  );
};
