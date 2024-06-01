import React from "react";
import ApexCharts from "react-apexcharts";

function SubjectAnalytics({ studentid, data }) {
  const options = {
    chart: {
      height: 250,
      type: "radialBar",
    },
    series: [data?.classavg, data?.myavg],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: true,
            label: "Average",
            formatter: function (w) {
              return "";
            },
          },
        },
      },
    },
    labels: ["Class", "My"],
  };
  return (
    <div className="card h-100 shadow-lg">
      <div className="card-body">
        <h6 className="mb-3 fw-bold ">Exam Average</h6>
        <div className="d-flex justify-content-end text-center">
          <div className="p-2" style={{ fontSize: 10 }}>
            <h6 className="mb-0 fw-bold" style={{ fontSize: 10 }}>
              {data?.classavg}
            </h6>
            <small className="text-muted">Class Avg</small>
          </div>
          <div className="p-2 ms-4" style={{ fontSize: 10 }}>
            <h6 className="mb-0 fw-bold" style={{ fontSize: 10 }}>
              {data?.myavg}
            </h6>
            <small className="text-muted">My Avg</small>
          </div>
        </div>
        <div className="" id="incomeanalytics">
          <ApexCharts
            options={options}
            series={options.series}
            type="radialBar"
            height={options.chart.height}
          />
        </div>
      </div>
    </div>
  );
}

export default SubjectAnalytics;
