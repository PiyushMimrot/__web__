import ReactApexChart from "react-apexcharts";
import { useEffect, useState } from "react";
import {
  getClassSectionsApi,
  getTeacherAssigmentsCount,
  getTotalClassesSubjectWise,
} from "../../apis";

export function ColumnChart({ data }) {
  const options = {
    chart: {
      height: 350,
      type: "bar",
    },
    colors: [
      "var(--chart-color1)",
      "var(--chart-color2)",
      "var(--chart-color3)",
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: data && data.map((item) => "Class " + item.classname),
    },
    yaxis: {
      title: {
        text: "Marks",
      },
    },
    fill: {
      opacity: 1,
    },
    // tooltip: {
    //   y: {
    //     formatter: function (val) {
    //       return val;
    //     },
    //   },
    // },
  };

  const toppers = [];

  // Iterate over each class
  data &&
    data.forEach((classData) => {
      classData.results.forEach((result, resultIndex) => {
        // Check if a topper object exists for the current index
        if (!toppers[resultIndex]) {
          toppers[resultIndex] = {
            name: `Topper${resultIndex + 1}`,
            data: [],
          };
        }
        // Push the sumOfMarks to the data array of the corresponding topper
        toppers[resultIndex].data.push(result.sumOfMarks);
      });
    });

  return (
    <ReactApexChart
      options={options}
      series={toppers ?? []}
      type="bar"
      height={350}
      // width={500}
    />
  );
}

export function ColumnChartPerform({ datas, classes }) {
  // const defaultData = {
  //   data: [
  //     { name: "English", data: [2, 1, 2, 3] },
  //     { name: "Maths", data: [4, 1, 6, 3] },
  //   ],
  //   labels: ["Jan", "Oct", "Nov", "Dec"],
  // };

  const [data, setData] = useState(null);
  const [selectClass, setselectClass] = useState(null);
  const [selectedSection, setselectedSection] = useState(null);
  const [allsections, setallsections] = useState([]);

  const monthNamesMap = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "Aug",
    "09": "Sept",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };

  const getAllSections = async (classId) => {
    setselectClass(classId);
    const {
      data: { data },
      status,
    } = await getClassSectionsApi(classId);
    if (status === 200) {
      let update = data.map((item) => ({
        _id: item._id,
        name: item.name,
      }));
      setallsections(update);
      // if (initial) {
      if (update.length > 0) {
        setselectedSection(update[0]._id);
        fetchTotalClasses(classId, update[0]._id);
      }
      // }
    }
  };

  const fetchTotalClasses = async (classId, sectionId) => {
    const details = {
      classId,
      sectionId,
    };
    let response = await getTotalClassesSubjectWise(details);
    setData(response);
  };

  const resultArray = [];
  const subjectMap = new Map();

  data &&
    data?.forEach((item) => {
      item.subjects.forEach((subject) => {
        if (!subjectMap.has(subject.name)) {
          subjectMap.set(subject.name, {
            name: subject.name,
            data: [subject.totalClasses],
          });
        } else {
          subjectMap.get(subject.name).data.push(subject.totalClasses);
        }
      });
    });

  subjectMap.forEach((subject) => {
    resultArray.push(subject);
  });

  const options = {
    chart: {
      stacked: true,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
              fontWeight: 900,
            },
          },
        },
      },
    },
    xaxis: {
      categories: (data && data?.map((item) => monthNamesMap[item._id])) || [],
    },
    legend: {
      position: "right",
      offsetY: 40,
    },
    fill: {
      opacity: 1,
    },
  };

  useEffect(() => {
    if (classes) {
      getAllSections(classes[0]._id);
    }
  }, [classes]);
  return (
    <>
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold ">Total Classes (Subject Wise)</h6>
        <div className="">
          <select
            placeholder="Select a class"
            className="btn btn-outline"
            onChange={(e) => getAllSections(e.target.value)}
          >
            {classes && classes.length === 0 && <option>no classes</option>}
            {classes &&
              classes?.map((cls, idx) => {
                return (
                  <option key={idx} value={cls._id} defaultChecked={idx === 0}>
                    Class {cls.name}
                  </option>
                );
              })}
          </select>

          <select
            className="btn btn-outline"
            onChange={(e) => fetchTotalClasses(selectClass, e.target.value)}
          >
            {allsections.length === 0 && <option>no sections</option>}
            {allsections.map((item) => (
              <option
                key={item._id}
                value={item._id}
                selected={item._id === selectedSection}
              >{`Section ${item.name}`}</option>
            ))}
          </select>
        </div>

        <div></div>
      </div>
      <ReactApexChart
        options={options}
        series={(data && resultArray) || []}
        type="bar"
        height={350}
      />
    </>
  );
}

export function TeacherWiseAssigmentGraph({ classes, teacherid }) {
  const [selectClass, setselectClass] = useState(null);
  const [data, setData] = useState(null);

  const FetchData = async (classId) => {
    let response = null;
    if (teacherid) {
      response = await getTeacherAssigmentsCount(classId, teacherid);
    } else {
      response = await getTeacherAssigmentsCount(classId);
    }
    setData(response.data);
    setselectClass(classId);
  };

  const sections = [...new Set(data && data.map((item) => item.section_name))];
  const subjects = [...new Set(data && data.map((item) => item.subject_name))];

  const seriesData = subjects.map((subject) => ({
    name: subject,
    data: sections.map((section) => {
      const item = data.find(
        (d) => d.section_name === section && d.subject_name === subject
      );
      return item ? item.count : 0;
    }),
  }));

  const options = {
    chart: {
      stacked: true,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 10,
        dataLabels: {
          total: {
            enabled: true,
            style: {
              fontSize: "13px",
              fontWeight: 900,
            },
          },
        },
      },
    },
    xaxis: {
      categories: sections,
    },
    legend: {
      position: "right",
      offsetY: 40,
    },
    fill: {
      opacity: 1,
    },
  };

  useEffect(() => {
    if (classes) {
      FetchData(classes[0]._id);
    }
  }, [classes]);
  return (
    <>
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold ">Total Assigments</h6>
        <div className="">
          <select
            placeholder="Select a class"
            className="btn btn-outline"
            onChange={(e) => FetchData(e.target.value)}
          >
            {classes && classes.length === 0 && <option>no classes</option>}
            {classes &&
              classes?.map((cls, idx) => {
                return (
                  <option key={idx} value={cls._id} defaultChecked={idx === 0}>
                    Class {cls.name}
                  </option>
                );
              })}
          </select>
        </div>

        <div></div>
      </div>
      <ReactApexChart
        options={options}
        series={seriesData}
        type="bar"
        height={350}
      />
    </>
  );
}
