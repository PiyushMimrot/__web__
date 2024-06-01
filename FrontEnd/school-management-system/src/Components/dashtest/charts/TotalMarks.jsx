import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { SERVER } from "../../../config";
import { getTypeToken } from "../../../Context/localStorage";

const TotalMarks = ({ studentid }) => {
  const [userData, setUserData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [subjectNames, setSubjectNames] = useState({});
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
    if (userData.length > 0) {
      const subjectKeys = Object.keys(userData[0]?.subjects || {});

      if (subjectKeys.length === 0) {
        console.error("Invalid userData structure:", userData);
        return;
      }

      const formattedData = userData.map(({ month, subjects }) => {
        const subjectData = {};
        subjectKeys.forEach((key) => {
          subjectData[key] = subjects[key]?.numberGained || 0;
        });

        return {
          name: month,
          ...subjectData,
        };
      });

      setChartData(formattedData);

      const names = {};
      subjectKeys.forEach((key) => {
        names[key] = userData[0]?.subjects[key]?.subjectName || key;
      });
      setSubjectNames(names);
    }
  }, [userData]);

  const options = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories:
        chartData.length > 0 ? chartData.map((item) => item.name) : [],
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
  };

  const seriesData = Object.keys(chartData[0] || {})
    .filter((key) => key !== "name")
    .map((subjectKey) => ({
      name: subjectNames[subjectKey] || subjectKey,
      data: chartData.map((item) => item[subjectKey]),
    }));

  const apexChartData = seriesData;

  return (
    <div className="card h-100 shadow-lg">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <div className="info-header">
          <h6 className="mb-0 fw-bold ">Total Gained Marks</h6>
        </div>
      </div>
      <div className="card-body">
        <div id="apex-timeline">
          {/* <ApexCharts
            options={options}
            series={data}
            type="rangeBar"
            height={options.chart.height}
          /> */}
          <ApexCharts
            options={options}
            series={apexChartData}
            type="bar"
            height={250}
          />
        </div>
      </div>
    </div>
  );
};

export default TotalMarks;
