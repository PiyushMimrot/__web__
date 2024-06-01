import React, { useEffect, useState } from "react";
import { SERVER } from "../../../config";
import ApexChart from "react-apexcharts";
import { getTypeToken } from "../../../Context/localStorage";

const MarksOfSubject = ({ studentid }) => {
  const [finalData, setFinalData] = useState({
    subject: null,
    totalScore: 0,
    gainedScore: 0,
  });

  const [subjects, setSubjects] = useState([]);
  const [graphData, setGraphData] = useState([]);

  const type = getTypeToken();
  const [chartOptions, setChartOptions] = useState({
    chart: {
      height: 250,
      type: "radialBar",
    },
    series: [67],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 15,
          size: "70%",
        },
        dataLabels: {
          showOn: "always",
          name: {
            offsetY: -10,
            show: true,
            color: "#888",
            fontSize: "13px",
          },
          value: {
            color: "#111",
            fontSize: "30px",
            show: true,
          },
        },
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Report"],
  });
  useEffect(() => {
    fetchInfo();
    getData();
  }, [studentid]);

  const fetchInfo = async () => {
    const sessionData = await fetch(`${SERVER}/sessions/active`, {
      credentials: "include",
    });
    const session = await sessionData.json();
    // console.log(session, "session");

    let subject = null;
    if (type === "student" || type === "parent") {
      const getSubject = await fetch(`${SERVER}/subject/getSubject`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: session?.data._id,
        }),
      });
      subject = await getSubject.json();
      setSubjects(subject?.subjects);
    } else if (type === "admin" || type === "teacher") {
      const getSubject = await fetch(`${SERVER}/subject/getSubject`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: session?.data._id,
          student_id: studentid,
        }),
      });
      subject = await getSubject.json();
      setSubjects(subject?.subjects);
    }
  };

  const getData = async () => {
    let graph = null;

    if (type === "student" || type === "parent") {
      const graphdata = await fetch(`${SERVER}/graph/student/marks`, {
        credentials: "include",
        method: "POST",
      });
      graph = await graphdata.json();
      setGraphData(graph);
    } else if (type === "admin" || type === "teacher") {
      const graphdata = await fetch(`${SERVER}/graph/student/marks`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: studentid,
        }),
      });
      graph = await graphdata.json();
      setGraphData(graph);
    }

    let totalMarks = 0;
    let marksGained = 0;

    graph.forEach((ele) => {
      totalMarks += ele.totalMarks;
      marksGained += ele.marksGained;
    });

    setFinalData({
      subject: "All",
      totalScore: totalMarks,
      gainedScore: marksGained,
    });
  };

  useEffect(() => {
    const total = finalData.totalScore;
    const gained = finalData.gainedScore;
    let gainedPercentage = 0;
    if (!(total == 0)) {
      gainedPercentage = ((gained / total) * 100).toFixed(1);
    }

    setChartOptions({
      ...chartOptions,
      series: [gainedPercentage],
    });
  }, [finalData]);

  const MarksSubject = (subjectInfo) => {
    // console.log(subjectId, "subjctid")
    // console.log(subjectInfo);
    const { _id, name } = subjectInfo;
    const subjectId = _id;
    let totalMarks = 0;
    let marksGained = 0;

    graphData.forEach((monthData) => {
      const { subjects } = monthData;
      if (subjects.hasOwnProperty(subjectId)) {
        const subjectDetails = subjects[subjectId];
        totalMarks += subjectDetails.totalNumber;
        marksGained += subjectDetails.numberGained;
      }
    });

    setFinalData({
      subject: name,
      totalScore: totalMarks,
      gainedScore: marksGained,
    });
    // console.log(`Total Marks for subject ${subjectId}: ${totalMarks}`);
    // console.log(`Marks Gained for subject ${subjectId}: ${marksGained}`);
  };

  return (
    <div className="card h-100 shadow-lg">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <div className="info-header">
          <h6 className="mb-0 fw-bold ">Subject Wise</h6>
        </div>
        <button
          className="btn btn-sm btn-link  dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        ></button>
        <ul className="dropdown-menu border-0 shadow dropdown-menu-end">
          {subjects?.map((subject, idx) => (
            <li key={idx}>
              <a
                className="dropdown-item py-2 rounded"
                onClick={() =>
                  MarksSubject({ _id: subject?._id, name: subject?.name })
                }
              >
                {subject?.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="card-body">
        <div id="apex-timeline">
          <ApexChart
            options={chartOptions}
            series={chartOptions.series}
            type="radialBar"
            height={280}
          />
        </div>
      </div>
    </div>
  );
};

export default MarksOfSubject;
