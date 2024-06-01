import ReactApexChart from "react-apexcharts";

export function DonutChart({ students }) {
  const options = {
    align: "center",
    chart: {
      height: 200,
      type: "donut",
      align: "center",
    },
    labels: ["Boys", "Girls"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      show: true,
    },
    colors: ["var(--chart-color4)", "var(--chart-color3)"],
    // series: [students?.boys, students?.girls],
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
      series={[students?.boys, students?.girls]}
      type="donut"
      width={320}
    />
  );
}
