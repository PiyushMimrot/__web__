import ReactApexChart from "react-apexcharts";

const SplineArea = ({ data = [] }) => {
  const defaultData = {
    data: [
      { name: "Present", data: [45, 36, 50, 44] },
      { name: "Absent", data: [5, 14, 0, 6] },
    ],
    months: ["2024-01-01", "2024-01-02", "2024-01-03", "2024-01-04"],
  };

  let months = data.map((item) => item.day);

  const options = {
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: (data && months) || defaultData.months,
    },
  };

  //   for 50 teachers stafff
  const seriesData = [
    {
      name: "Present",
      data: data.map((item) => item.present),
    },
    {
      name: "Absent",
      data: data.map((item) => item.absent),
    },
  ];

  // console.log(options);
  // console.log(seriesData);
  return (
    <ReactApexChart
      options={options}
      series={(data && seriesData) || defaultData.data}
      type="area"
      height={350}
    />
  );
};

export default SplineArea;
