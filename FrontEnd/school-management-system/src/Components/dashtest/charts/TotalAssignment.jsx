import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { SERVER } from "../../../config";
import { getTypeToken } from "../../../Context/localStorage";

const TotalAssignment = ({ studentid }) => {
  const [userData, setUserData] = useState([]);
  const [chartData, setChartData] = useState({ series: [], options: {} });

  const type = getTypeToken();

  useEffect(() => {
    getData();
  }, [studentid]);

  const getData = async () => {
    let graph = null;

    if (type === "student" || type === "parent") {
      const graphdata = await fetch(`${SERVER}/graph/student/marks`, {
        method: "POST",
        credentials: "include",
      });
      graph = await graphdata.json();
      setUserData(graph);
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
      setUserData(graph);
    }
  };

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
    <div className="card h-100 shadow-lg">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <div className="info-header">
          <h6 className="mb-0 fw-bold ">Total Assignments</h6>
        </div>
      </div>
      <div className="card-body">
        <div id="apex-timeline">
          <ApexCharts
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={250}
          />
        </div>
      </div>
    </div>
  );
};

export default TotalAssignment;
