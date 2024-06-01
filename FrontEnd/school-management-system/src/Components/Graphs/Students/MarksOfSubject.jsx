import React, { useEffect, useState } from "react";
import { SERVER } from "../../../config";
import ReactApexChart from "react-apexcharts";

const MarksOfSubject = ({ studentid }) => {
  // console.log(studentid, "studentid")

  const demoData = [
    {
      month: "February",
      year: 2023,
      subjects: {
        "655a3fcfd4c33881adf1c2f2": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "655a3fd9d4c33881adf1c2f6": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "655a3fe1d4c33881adf1c2fa": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "656213ac90d819c2be152ed6": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
      },
      marksGained: 0,
      totalMarks: 0,
      totalAsgn: 0,
    },
    {
      month: "March",
      year: 2023,
      subjects: {
        "655a3fcfd4c33881adf1c2f2": {
          totalNumber: 550,
          numberGained: 500,
          noOfAsgn: 2,
        },
        "655a3fd9d4c33881adf1c2f6": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "655a3fe1d4c33881adf1c2fa": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "656213ac90d819c2be152ed6": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
      },
      marksGained: 500,
      totalMarks: 550,
      totalAsgn: 2,
    },
    {
      month: "April",
      year: 2023,
      subjects: {
        "655a3fcfd4c33881adf1c2f2": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "655a3fd9d4c33881adf1c2f6": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "655a3fe1d4c33881adf1c2fa": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "656213ac90d819c2be152ed6": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
      },
      marksGained: 0,
      totalMarks: 0,
      totalAsgn: 0,
    },
    {
      month: "May",
      year: 2023,
      subjects: {
        "655a3fcfd4c33881adf1c2f2": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "655a3fd9d4c33881adf1c2f6": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "655a3fe1d4c33881adf1c2fa": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "656213ac90d819c2be152ed6": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
      },
      marksGained: 0,
      totalMarks: 0,
      totalAsgn: 0,
    },
    {
      month: "June",
      year: 2023,
      subjects: {
        "655a3fcfd4c33881adf1c2f2": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "655a3fd9d4c33881adf1c2f6": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "655a3fe1d4c33881adf1c2fa": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "656213ac90d819c2be152ed6": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
      },
      marksGained: 0,
      totalMarks: 0,
      totalAsgn: 0,
    },
    {
      month: "July",
      year: 2023,
      subjects: {
        "655a3fcfd4c33881adf1c2f2": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "655a3fd9d4c33881adf1c2f6": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "655a3fe1d4c33881adf1c2fa": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "656213ac90d819c2be152ed6": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
      },
      marksGained: 0,
      totalMarks: 0,
      totalAsgn: 0,
    },
    {
      month: "August",
      year: 2023,
      subjects: {
        "655a3fcfd4c33881adf1c2f2": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "655a3fd9d4c33881adf1c2f6": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "655a3fe1d4c33881adf1c2fa": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "656213ac90d819c2be152ed6": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
      },
      marksGained: 0,
      totalMarks: 0,
      totalAsgn: 0,
    },
    {
      month: "September",
      year: 2023,
      subjects: {
        "655a3fcfd4c33881adf1c2f2": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "655a3fd9d4c33881adf1c2f6": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "655a3fe1d4c33881adf1c2fa": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "656213ac90d819c2be152ed6": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
      },
      marksGained: 0,
      totalMarks: 0,
      totalAsgn: 0,
    },
    {
      month: "October",
      year: 2023,
      subjects: {
        "655a3fcfd4c33881adf1c2f2": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "655a3fd9d4c33881adf1c2f6": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "655a3fe1d4c33881adf1c2fa": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "656213ac90d819c2be152ed6": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
      },
      marksGained: 0,
      totalMarks: 0,
      totalAsgn: 0,
    },
    {
      month: "November",
      year: 2023,
      subjects: {
        "655a3fcfd4c33881adf1c2f2": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
        "655a3fd9d4c33881adf1c2f6": {
          totalNumber: 100,
          numberGained: 15,
          noOfAsgn: 1,
        },
        "655a3fe1d4c33881adf1c2fa": {
          totalNumber: 80,
          numberGained: 80,
          noOfAsgn: 1,
        },
        "656213ac90d819c2be152ed6": {
          totalNumber: 0,
          numberGained: 0,
          noOfAsgn: 0,
        },
      },
      marksGained: 95,
      totalMarks: 180,
      totalAsgn: 2,
    },
  ];

  const [finalData, setFinalData] = useState({
    subject: null,
    totalScore: 0,
    gainedScore: 0,
  });

  const [subjects, setSubjects] = useState([]);
  const [graphData, setGraphData] = useState([]);

  const type = localStorage.getItem("type");

  // console.log(type, "type")
  // console.log(graphData, "graphData")

  const [chartOptions, setChartOptions] = useState({
    chart: {
      height: 280,
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

  //console.log(subjects, "subjects");
  //console.log(selectedSubjectId, "selectedSubjectId");
  // console.log(graphData, "graphData");
  // console.log(finalData, "finalData");

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
    if (type === "student") {
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

    if (type === "student") {
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
    <div>
      <div className="container mt-5">
        <select
          className="form-select"
          id="subject"
          aria-label="Select example"
          onChange={(e) => MarksSubject(JSON.parse(e.target.value))}
        >
          <option selected disabled>
            Select Subject
          </option>
          {subjects?.map((subject, idx) => (
            <option value={JSON.stringify(subject)} key={idx}>
              {subject?.name}
            </option>
          ))}
        </select>

        <ReactApexChart
          options={chartOptions}
          series={chartOptions.series}
          type="radialBar"
          height={280}
        />
      </div>
    </div>
  );
};

export default MarksOfSubject;
