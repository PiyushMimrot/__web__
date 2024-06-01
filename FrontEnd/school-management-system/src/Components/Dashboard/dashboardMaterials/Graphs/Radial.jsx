import ReactApexChart from "react-apexcharts";
import { getClassSectionsApi, getSectionCourseProgressApi } from "../../apis";
import { useEffect, useState } from "react";

export function RadialChart({ data }) {
  console.log(data);
  const options = {
    chart: {
      height: 250,
      type: "radialBar",
    },
    colors: ["var(--chart-color1)"],
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%",
        },
      },
    },
    // series: [70],
    labels: ["Doubt Resolved"],
  };

  return (
    <ReactApexChart
      options={options}
      series={data ?? [70]}
      type="radialBar"
      height={300}
    />
  );
}

export function TeacherDoubtPerformanceGraph({ allstaffs, data }) {
  const [selectedTeacher, setselectedTeacher] = useState(null);
  const [selectedPerformance, setselectedPerformance] = useState(null);

  const handlerPerfomancePercentage = (teacherId) => {
    let teacherData = data.find((item) => item._id === teacherId);
    if (teacherData) {
      // let performance = (teacherData.solved / teacherData.count) * 100;
      let performance =
        (teacherData.totalRating / (teacherData.count * 5)) * 100;
      setselectedPerformance([
        performance.toFixed(2),
        teacherData.solved,
        teacherData.pending,
        teacherData.count,
      ]);
    } else {
      setselectedPerformance([0, 0, 0, 0]);
    }
    setselectedTeacher(teacherId);
  };

  const options = {
    chart: {
      height: 250,
      type: "radialBar",
    },
    colors: [
      "var(--chart-color1)",
      "var(--chart-color2)",
      "var(--chart-color3)",
      "var(--chart-color4)",
    ],
    plotOptions: {
      radialBar: {
        // hollow: {
        //   size: "70%",
        // },
        track: {
          strokeWidth: 100,
        },
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "20px",
          },
          total: {
            show: false,
            label: "Performance",
            formatter: function () {
              if (selectedPerformance) {
                return selectedPerformance[0];
                // return 56;
              } else {
                return 0;
              }
            },
          },
        },
      },
    },
    // series: [70],
    labels: ["solved", "pending", "total"],
  };

  const option2 = {
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
          },
          value: {
            show: true,
          },
        },
      },
    },
    colors: [
      "var(--chart-color1)",
      "var(--chart-color2)",
      "var(--chart-color3)",
      "var(--chart-color4)",
    ],
    labels: ["Act %", "solved", "pending", "total"],
    legend: {
      show: selectedPerformance && true,
      floating: selectedPerformance && true,
      fontSize: "16px",
      position: "left",
      offsetX: 16,
      offsetY: 15,
      labels: {
        useSeriesColors: true,
      },
      markers: {
        size: 0,
      },
      formatter: function (seriesName, opts) {
        return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
      },
      itemMargin: {
        vertical: 3,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  useEffect(() => {
    if (data && allstaffs) {
      console.log(allstaffs);
      if (allstaffs.length > 0) {
        handlerPerfomancePercentage(allstaffs[0]._id);
      }
    }
  }, [data, allstaffs]);

  return (
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <div className="row">
          <div className="col-lg-7">
            <h6 className="mb-0 fw-bold ">
              Doubt <p>Performance</p>{" "}
            </h6>
          </div>
          <div className="col-lg-5">
            <select
              className="btn btn-outline"
              onChange={(e) => handlerPerfomancePercentage(e.target.value)}
            >
              <option>Select Teacher</option>
              {allstaffs &&
                allstaffs.map((teacher, idx) => {
                  return (
                    <option
                      key={idx}
                      value={teacher._id}
                      selected={teacher._id === selectedTeacher}
                    >
                      {teacher.name}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>
      </div>
      <div className="card-body">
        <ReactApexChart
          options={option2}
          series={selectedPerformance ?? []}
          // series={[]}
          type="radialBar"
          height={300}
        />
      </div>
    </div>
  );
}

export function ClassCourseProgressGraph({ classes }) {
  const [selectedClass, setselectedClass] = useState(null);
  const [selectedSection, setselectedSection] = useState(null);
  const [allSections, setallSections] = useState([]);
  const [courseProgressData, setcourseProgressData] = useState(null);
  const [allcourseProgressMonth, setallcourseProgressMonth] = useState([]);

  const fetchClassSectionsHandler = async (classId) => {
    setselectedClass(classId);
    const {
      data: { data },
      status,
    } = await getClassSectionsApi(classId);
    // console.log(data);
    if (status === 200) {
      let update = data.map((item) => ({
        _id: item._id,
        name: item.name,
      }));
      setallSections(update);
      if (update.length > 0) {
        fetchSectionProgress(update[0]._id);
      }
    }
  };

  const fetchSectionProgress = async (sectionid) => {
    setselectedSection(sectionid);
    let { data, section } = await getSectionCourseProgressApi(sectionid);
    // console.log(data);
    setcourseProgressData(data[0]);
    setallcourseProgressMonth(data);
  };

  const Labels = courseProgressData?.subjects.map((item) => item.name);
  const seriesData = courseProgressData?.subjects.map((item) => item.progress);
  const options = {
    chart: {
      height: 200,
      type: "radialBar",
    },
    colors: [
      "var(--chart-color1)",
      "var(--chart-color2)",
      "var(--chart-color3)",
      "var(--chart-color4)",
    ],
    plotOptions: {
      radialBar: {
        track: {
          strokeWidth: 100,
        },
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "20px",
          },
          total: {
            show: true,
            label: "Overall Avg",
            formatter: function () {
              if (seriesData) {
                let tempSeries = seriesData.map((item) => Number(item));
                let x =
                  tempSeries &&
                  tempSeries.reduce((acc, v) => acc + parseFloat(v)) /
                    tempSeries.length;
                return x.toFixed(2);
              } else {
                return "";
              }
            },
          },
        },
      },
    },
    // series: [44, 55, 67, 83],
    labels: (courseProgressData && Labels) || [],
  };

  useEffect(() => {
    if (classes) {
      fetchClassSectionsHandler(classes[0]._id);
    }
  }, [classes]);

  return (
    <div className="card h-100">
      <div className="card-header py-3 justify-content-between bg-transparent border-bottom-0">
        <div className="row">
          <h6 className="mb-0 fw-bold ">Class Course Progress </h6>
        </div>

        <div className="row mt-2">
          <div className="col">
            <select
              className="btn btn-outline"
              onChange={(e) => fetchClassSectionsHandler(e.target.value)}
            >
              {/* <option value="">Select class</option> */}
              {classes &&
                classes?.map((item) => (
                  <option
                    key={item._id}
                    value={item._id}
                    selected={item._id === selectedClass}
                  >{`class ${item.name}`}</option>
                ))}
            </select>
          </div>

          <div className="col">
            <select
              className="btn btn-outline"
              onChange={(e) => fetchSectionProgress(e.target.value)}
            >
              <option>Select Sec</option>
              {allSections.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                  selected={item._id === selectedSection}
                >{`Section ${item.name}`}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="card-body">
        <ReactApexChart
          options={options}
          series={(courseProgressData && seriesData) || []}
          type="radialBar"
          height={250}
        />
      </div>
    </div>
  );
}
