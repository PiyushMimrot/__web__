import React from "react";
import ApexCharts from "react-apexcharts";

const data = [
  {
    x: "Task 1",
    y: [new Date("2023-12-15").getTime(), new Date("2023-12-18").getTime()],
  },
  {
    x: "Task 2",
    y: [new Date("2023-12-12").getTime(), new Date("2023-12-17").getTime()],
  },
];

const options = {
  chart: {
    type: "rangeBar",
    height: 250,
  },
  xaxis: {
    type: "datetime",
  },
};

function Performance() {
  return (
    <div className="card h-100 shadow-lg">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <div className="info-header">
          <h6 className="mb-0 fw-bold ">Performance Timeline</h6>
        </div>
        <button
          className="btn btn-sm btn-link  dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        ></button>
        <ul className="dropdown-menu border-0 shadow dropdown-menu-end">
          <li>
            <a className="dropdown-item py-2 rounded" href="#">
              Last 7 days
            </a>
          </li>
          <li>
            <a className="dropdown-item py-2 rounded" href="#">
              Last 30 days
            </a>
          </li>
          <li>
            <a className="dropdown-item py-2 rounded" href="#">
              Last 60 days
            </a>
          </li>
        </ul>
      </div>
      <div className="card-body">
        <div id="apex-timeline">
          <ApexCharts
            options={options}
            series={data}
            type="rangeBar"
            height={options.chart.height}
          />
        </div>
      </div>
    </div>
  );
}

export default Performance;
