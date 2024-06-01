import ReactApexChart from "react-apexcharts";

const options = {
  chart: {
    height: 350,
    type: "bubble",
    toolbar: {
      show: false,
    },
  },
  colors: ["var(--chart-color1)", "var(--chart-color2)"],
  dataLabels: {
    enabled: false,
  },
  // series: [{
  //         name: 'Bubble1',
  //         data: generateData(new Date('11 Feb 2019 GMT').getTime(), 20, {
  //             min: 10,
  //             max: 60
  //         })
  //     },
  //     {
  //         name: 'Bubble2',
  //         data: generateData(new Date('11 Feb 2019 GMT').getTime(), 20, {
  //             min: 10,
  //             max: 60
  //         })
  //     }
  // ],
  fill: {
    opacity: 0.8,
  },
  // title: {
  //     text: 'Simple Bubble Chart'
  // },
  xaxis: {
    tickAmount: 12,
    type: "category",
  },
  yaxis: {
    max: 70,
  },
};
export function Bubble({ data }) {
  console.log(data);
  return (
    <ReactApexChart
      options={options}
      series={data ?? []}
      type="bubble"
      height={350}
    />
  );
}
