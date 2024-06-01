import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { SERVER } from "../../../../config";

function generateData(count, yrange) {
  var i = 0;
  var series = [];
  while (i < count) {
    var x = "w" + (i + 1).toString();
    var y =
      Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    series.push({
      x: x,
      y: y,
    });
    i++;
  }
  return series;
}
const options = {
  chart: {
    height: 350,
    type: "heatmap",
  },
  dataLabels: {
    enabled: false,
  },
  colors: ["#f7c56b"],
  // title: {
  //     text: 'Class'
  // },
};

export function HeatMap({ classes }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (classes && classes.length > 0) handleClassChange(classes[0]._id);
  }, [classes]);

  const handleClassChange = async (id) => {
    const resp = await fetch(`${SERVER}/dashboard/heatmap`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        classId: id,
      }),
      credentials: "include",
    });
    const json = await resp.json();

    // const result = json.map((item) => {
    //   const attendanceData = item.attendance.reduce((acc, entry) => {
    //     const date = new Date(entry._id);
    //     // Assuming that generateData is a function that generates random data within a specified range
    //     acc[date.getDate() - 1] = (entry.count / item.totalStudents) * 100;
    //     return acc;
    //   }, Array(30).fill(0));
    //   return {
    //     name: item.name,
    //     data: attendanceData,
    //   };
    // });
    setData(json);
  };
  // console.log(data);
  // var series = [
  //   {
  //     name: "Metric1",
  //     data: generateData(18, {
  //       min: 0,
  //       max: 90,
  //     }),
  //   },
  //   {
  //     name: "Metric2",
  //     data: generateData(18, {
  //       min: 0,
  //       max: 90,
  //     }),
  //   },
  //   {
  //     name: "Metric3",
  //     data: generateData(18, {
  //       min: 0,
  //       max: 90,
  //     }),
  //   },
  //   {
  //     name: "Metric4",
  //     data: generateData(18, {
  //       min: 0,
  //       max: 90,
  //     }),
  //   },
  //   {
  //     name: "Metric5",
  //     data: generateData(18, {
  //       min: 0,
  //       max: 90,
  //     }),
  //   },
  //   {
  //     name: "Metric6",
  //     data: generateData(18, {
  //       min: 0,
  //       max: 90,
  //     }),
  //   },
  //   {
  //     name: "Metric7",
  //     data: generateData(18, {
  //       min: 0,
  //       max: 90,
  //     }),
  //   },
  //   {
  //     name: "Metric8",
  //     data: generateData(18, {
  //       min: 0,
  //       max: 90,
  //     }),
  //   },
  //   {
  //     name: "Metric9",
  //     data: generateData(18, {
  //       min: 0,
  //       max: 90,
  //     }),
  //   },
  // ];

  const options2 = {
    chart: {
      type: "heatmap",
    },
    dataLabels: {
      enabled: false,
    },
    colors: ["#008FFB"],
    title: {
      text: "Student Attendance Heatmap",
    },
    xaxis: {
      // enabled: false,
      // type: "datetime",
    },
  };

  const series2 =
    data &&
    data.map((item, index) => ({
      name: "Section " + item?.section_name,
      data: item.monthoverall.map((percentage) => ({
        x: percentage?.day,
        y: percentage?.percentage,
      })),
    }));

  return (
    <div className="col-xl-12 col-lg-12 col-md-12 flex-column">
      <div className="row g-3">
        <div className="col-md-12">
          <div className="card light-white-bg">
            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
              <h6 className="mb-0 fw-bold ">Class Attendance Heat Map</h6>
              <div className="col-lg-5">
                <select
                  placeholder="Select a class"
                  className="btn btn-outline"
                  onChange={(e) => handleClassChange(e.target.value)}
                >
                  <option value="" disabled={true}>
                    Select Class
                  </option>
                  {classes?.map((cls, idx) => {
                    return (
                      <option key={idx} value={cls._id}>
                        Class {cls.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="card-body">
              <div className="mt-3">
                <ReactApexChart
                  options={options2}
                  series={(data && series2) || []}
                  type="heatmap"
                  height={350}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
