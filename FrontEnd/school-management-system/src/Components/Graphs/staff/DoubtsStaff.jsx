import React, { useEffect, useState } from "react";
import ApexCharts from "apexcharts";
import { SERVER } from "../../../config";

const DoubtsStaff = ({ teacherId }) => {
  console.log(teacherId, "teacherId");
  const [chartData, setChartData] = useState([]);
  const type = localStorage.getItem("type");

  useEffect(() => {
    const fetchDoubts = async () => {
      let doubtsData = null;
      if (type === "teacher") {
        try {
          const doubtsResponse = await fetch(`${SERVER}/graph/staff/doubt`, {
            method: "POST",
            credentials: "include",
          });
          doubtsData = await doubtsResponse.json();
          setChartData(doubtsData);
        } catch (error) {
          console.error("Error fetching doubts data:", error);
        }
      } else if (type === "admin") {
        try {
          const doubtsResponse = await fetch(`${SERVER}/graph/staff/doubt`, {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              teacher_id: teacherId,
            }),
          });
          doubtsData = await doubtsResponse.json();
          setChartData(doubtsData);
        } catch (error) {
          console.error("Error fetching doubts data:", error);
        }
      }
    };
    fetchDoubts();
  }, [teacherId]);

  useEffect(() => {
    if (chartData.length > 0) {
      renderChart();
    }
  }, [chartData]);

  const renderChart = () => {
    const totalCount = chartData.length;
    const clearedCount = chartData.filter(
      (doubt) => doubt.status === true
    ).length;
    const unansweredCount = chartData.filter(
      (doubt) => doubt.status === false
    ).length;
    const feedbackReceivedCount = chartData.filter(
      (doubt) => doubt.feedback !== null
    ).length;

    const clearedPercentage = ((clearedCount / totalCount) * 100).toFixed(0);
    const unansweredPercentage = ((unansweredCount / totalCount) * 100).toFixed(
      0
    );
    const feedbackReceivedPercentage = (
      (feedbackReceivedCount / totalCount) *
      100
    ).toFixed(0);

    const options = {
      series: [
        clearedPercentage,
        unansweredPercentage,
        feedbackReceivedPercentage,
      ],
      chart: {
        height: 390,
        type: "radialBar",
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 270,
          hollow: {
            margin: 5,
            size: "30%",
            background: "transparent",
            image: undefined,
          },
          dataLabels: {
            name: {
              show: true,
              offsetY: -10,
              //   formatter: function (val, opts) {
              //     return opts.w.globals.labels[opts.seriesIndex];
              //   },
            },
            value: {
              show: true,
              offsetY: 5,
              formatter: function (val) {
                return val + "%";
              },
            },
          },
        },
      },
      colors: ["#1ab7ea", "#E48F45", "#7B66FF", "#E48F45"],
      labels: [
        "Answered Doubts: " + clearedCount,
        "Unanswered Doubts: " + unansweredCount,
        "Feedback Received: " + feedbackReceivedCount,
      ],
      legend: {
        show: true,
        floating: true,
        fontSize: "13px",
        position: "left",
        offsetX: -30,
        offsetY: 15,
        labels: {
          useSeriesColors: true,
        },
        markers: {
          size: 0,
        },
      },
    };

    const chart = new ApexCharts(document.getElementById("chart"), options);
    chart.render();
  };

  return (
    <div className="container mt-4">
      <div id="chart"></div>
    </div>
  );
};

export default DoubtsStaff;
