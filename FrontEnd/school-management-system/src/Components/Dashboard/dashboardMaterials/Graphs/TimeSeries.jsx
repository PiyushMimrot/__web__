import ReactApexChart from "react-apexcharts";

export function TimeSeriesChart({ data, totalC }) {
  const options = {
    chart: {
      type: "area",
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      width: 5,
    },
    // series: [{
    //     data: randomizeArray(sparklineData)
    // }],
    colors: ["#ff4560"],
    title: {
      text: `INR ${totalC?.toFixed(2)}`,
      offsetX: 0,
      style: {
        fontSize: "24px",
        cssClass: "apexcharts-yaxis-title",
      },
    },
    subtitle: {
      text: "Last Week's Collection",
      offsetX: 0,
      style: {
        fontSize: "14px",
        cssClass: "apexcharts-yaxis-title",
      },
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={data ?? []}
      type="area"
      height={290}
    />
  );
}
