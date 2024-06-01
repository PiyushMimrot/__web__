import React, { useEffect, useState } from "react";
import { SERVER } from "../../../config";
import ApexCharts from "apexcharts";

const NoOfClasses = ({studentid}) => {
  const [graphData, setGraphData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [chart, setChart] = useState(null);
  const type = localStorage.getItem("type");

  useEffect(() => {
    const fetchClasses = async () => {
      let noOfClass = null;
      if (type === "student") {
        const classesResponse = await fetch(
          `${SERVER}/graph/student/classprogress/noofclasses`,
          { credentials: "include", method: "POST" }
        );
        noOfClass = await classesResponse.json();
        setGraphData(noOfClass);
      } else if (type === "admin" || type === "teacher") {
        const classesResponse = await fetch(
          `${SERVER}/graph/student/classprogress/noofclasses`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              student_id: studentid,
            }),
          }
        );
        noOfClass = await classesResponse.json();
        setGraphData(noOfClass);
      }
    };

    fetchClasses();
  }, [studentid]);

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    renderChart(e.target.value);
  };

  const renderChart = (selectedMonth) => {
    if (selectedMonth === "") return;

    const filteredData = graphData.find((data) => data.month === selectedMonth);

    const options = {
      series: [
        {
          name: "Number of Classes",
          data: filteredData.subjects.map((subject) => subject.noOfClasses),
        },
      ],
      chart: {
        type: "bar",
        height: 350,
      },
      xaxis: {
        categories: filteredData.subjects.map((subject) => subject.subjectName),
      },
      tooltip: {
        enabled: true,
        enabledOnSeries: undefined,
        shared: true,
        followCursor: false,
        intersect: false,
        inverseOrder: false,
        custom: undefined,
        fillSeriesColor: false,
        theme: false,
        style: {
          fontSize: "12px",
          fontFamily: undefined,
        },
        onDatasetHover: {
          highlightDataSeries: true,
        },
        x: {
          show: true,
          format: "yyyy-MM",
          formatter: undefined,
        },
        y: {
          formatter: undefined,
          title: {
            formatter: (seriesName) => "Classes",
          },
        },
        z: {
          formatter: undefined,
          title: "Size: ",
        },
        marker: {
          show: true,
        },
        items: {
          display: "flex",
        },
        fixed: {
          enabled: false,
          position: "topRight",
          offsetX: 0,
          offsetY: 0,
        },
      },
    };

    if (chart) {
      chart.destroy();
    }

    const chartInstance = new ApexCharts(
      document.getElementById("chart"),
      options
    );
    setChart(chartInstance);
    chartInstance.render();
  };

  useEffect(() => {
    if (selectedMonth !== "") {
      renderChart(selectedMonth);
    }
  }, [selectedMonth]);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-4">
          <select
            className="form-select"
            onChange={handleMonthChange}
            value={selectedMonth}
          >
            <option value="">Select Month</option>
            {graphData.map((data, index) => (
              <option key={index} value={data.month}>
                {data.month}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div id="chart"></div>
    </div>
  );
};

export default NoOfClasses;
