import React, { useEffect, useState } from "react";
import { SERVER } from "../../../config";
import ApexCharts from "react-apexcharts";
import Chart from "apexcharts";

const TotalClasses = ({ studentid }) => {
  const [graphData, setGraphData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [chartOptions, setChartOptions] = useState({ series: [] });
  const type = localStorage.getItem("type");

  useEffect(() => {
    const fetchClasses = async () => {
      let noOfClass = null;
      if (type === "student" || type === "parent") {
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
    setSelectedMonth(e);
    renderChart();
  };

  const renderChart = () => {
    if (selectedMonth === "") return;

    const filteredData = graphData?.find(
      (data) => data.month === selectedMonth
    );
    const options = {
      series: [
        {
          name: "Number of Classes",
          data: filteredData.subjects.map((subject) => subject.noOfClasses),
        },
      ],
      chart: {
        type: "bar",
        height: 300,
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
    // setC(options);
    // if (chart) {
    //   chart.destroy();
    // }

    // const chartInstance = new Chart(document.getElementById("chart"), options);
    // setChart(chartInstance);
    // chartInstance.render();
    setChartOptions(options);
  };
  console.log({ chartOptions });

  useEffect(() => {
    if (selectedMonth !== "") {
      renderChart(selectedMonth);
    }
  }, [selectedMonth]);

  return (
    // <div className="bg-light h-100">
    //   <select
    //     className="form-select"
    //     onChange={handleMonthChange}
    //     value={selectedMonth}
    //   >
    //     <option value="">Select Month</option>
    //     {graphData.map((data, index) => (
    //       <option key={index} value={data.month}>
    //         {data.month}
    //       </option>
    //     ))}
    //   </select>
    //   <div id="chart"></div>
    // </div>

    <div className="card h-100 shadow-lg">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <div className="info-header">
          <h6 className="mb-0 fw-bold ">Total Classes</h6>
        </div>
        <button
          className="btn btn-sm btn-link  dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        ></button>
        <ul className="dropdown-menu border-0 shadow dropdown-menu-end">
          {graphData?.map((data, index) => (
            <li key={index}>
              <a
                className="dropdown-item py-2 rounded"
                onClick={() => handleMonthChange(data.month)}
              >
                {data.month}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="card-body">
        <div>
          <ApexCharts
            options={chartOptions}
            series={chartOptions?.series}
            type="bar"
            height={250}
          />
          {/* <h2>{}</h2> */}
        </div>
      </div>
    </div>
  );
};

export default TotalClasses;
