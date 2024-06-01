import ReactApexChart from "react-apexcharts";

export default function DonutChart2({ attendence }) {
  const options = {
    align: "center",
    chart: {
      height: 250,
      type: "donut",
      align: "center",
    },
    labels: ["Present", "Absent"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      show: true,
    },
    colors: ["var(--chart-color4)", "var(--chart-color3)"],
    responsive: [
      {
        breakpoint: 45,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <ReactApexChart
      options={options}
      series={[attendence?.presentCount, attendence?.absentCount]}
      type="donut"
      width={320}
    />
  );
}
