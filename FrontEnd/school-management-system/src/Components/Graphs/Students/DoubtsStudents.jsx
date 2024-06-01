import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { SERVER } from "../../../config";
const DoubtsStudents = ({ studentid }) => {
  const [doubts, setDoubts] = useState([]);

  const type = localStorage.getItem("type");

  //console.log(doubts, "doubts")

  useEffect(() => {
    fetchInfo();
  }, [studentid]);

  const fetchInfo = async () => {
    let doubt = null;

    if (type === "student") {
      const doubtsData = await fetch(`${SERVER}/graph/student/teacherDoubts`, {
        credentials: "include",
        method: "POST",
      });
      doubt = await doubtsData.json();
      setDoubts(doubt);
    } else {
      const doubtsData = await fetch(`${SERVER}/graph/student/teacherDoubts`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: studentid,
        }),
      });
      doubt = await doubtsData.json();
      setDoubts(doubt);
    }
  };

  const getChartData = () => {
    const data = doubts.map((item) => {
      const answered = item.doubts.filter((doubt) => doubt.status).length;
      const unanswered = item.doubts.filter((doubt) => !doubt.status).length;

      return {
        teacherName: item.teacherName,
        answered,
        unanswered,
      };
    });

    return data;
  };

  const chartData = getChartData();

  const options = {
    chart: {
      type: "donut",
    },
    series: chartData.map((data) => data.answered + data.unanswered),
    labels: chartData.map(
      (data) =>
        `${data.teacherName} - Answered: ${data.answered}, Unanswered: ${data.unanswered}`
    ),
    colors: ["#008FFB", "#FF4560"],
    fill: {
      type: "gradient",
    },
  };

  return (
    <div>
      <Chart
        options={options}
        series={options.series}
        type="donut"
        height={350}
      />
    </div>
  );
};

export default DoubtsStudents;
