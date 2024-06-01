import ReactApexChart from "react-apexcharts";
import { useState } from "react";
import { getClassSectionsApi, getSectionCourseProgressApi } from "../../apis";
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

  const tempData = [
    { name: "Topper 1", data: [257, 250, 255, 96] },
    { name: "Topper 2", data: [167, 150, 190, 63] },
    { name: "Topper 3", data: [100, 70, 155, 75] },
  ];

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
      // series={tempData}
      type="bar"
      height={350}
      // width={500}
    />
  );
}

export function ProgressChart({ classes }) {
  const [data, setData] = useState(null);
  const [selectClass, setselectClass] = useState(null);
  const [allsections, setallsections] = useState([]);
  const [allcourseProgressMonth, setallcourseProgressMonth] = useState([]);
  const [courseProgressData, setcourseProgressData] = useState(null);

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
    }
  };

  const fetchSectionProgress = async (sectionid) => {
    let { data, section } = await getSectionCourseProgressApi(sectionid);
    setcourseProgressData(data[0]);
    setallcourseProgressMonth(data);
  };
  console.log({ allcourseProgressMonth });
  console.log({ data });
  return (
    // { marks: { $exists: false }, "assignment_id.staffid": ObjectId("") }

    <>
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold ">Progress</h6>
        {/* <h2>{item.}</h2> */}
        <div>
          <select
            placeholder="Select a class"
            className="btn btn-outline"
            onClick={(e) => getAllSections(e.target.value)}
          >
            <option>Class</option>
            {classes?.map((cls, idx) => {
              return (
                <option key={idx} value={cls._id}>
                  Class {cls.name}
                </option>
              );
            })}
          </select>

          <select
            className="btn btn-outline"
            // onChange={(e) => fetchTotalClasses(e.target.value)}
            onChange={(e) => fetchSectionProgress(e.target.value)}
          >
            <option>Section</option>
            {allsections.map((item) => (
              <option
                key={item._id}
                value={item._id}
                // selected={item._id === selectedClass}
              >{`Section ${item.name}`}</option>
            ))}
          </select>
          {allcourseProgressMonth.length > 0 && (
            <select
              className="btn btn-outline"
              onChange={(e) =>
                setcourseProgressData(allcourseProgressMonth[e.target.value])
              }
            >
              {/* <option>Select Month</option> */}
              {allcourseProgressMonth.map((item, index) => (
                <option
                  key={index}
                  value={index}
                  // selected={item._id === selectedClass}
                >{` ${item.month} Month`}</option>
              ))}
            </select>
          )}
        </div>
      </div>
      {/* <ReactApexChart
        options={options}
        series={(data && resultArray) || defaultData.data}
        type="bar"
        height={350}
      /> */}
      <RadialChartMultiple data={courseProgressData} />
    </>
  );
}
