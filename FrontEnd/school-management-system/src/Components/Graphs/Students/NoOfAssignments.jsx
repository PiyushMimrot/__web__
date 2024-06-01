import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { SERVER } from "../../../config";

const NoOfAssignments = ({studentid}) => {
  //   const demoData = [
  //     {
  //       month: "February",
  //       year: 2023,
  //       subjects: {
  //         "655a3fcfd4c33881adf1c2f2": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "English",
  //         },
  //         "655a3fd9d4c33881adf1c2f6": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Hindi",
  //         },
  //         "655a3fe1d4c33881adf1c2fa": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Maths",
  //         },
  //         "656213ac90d819c2be152ed6": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Sanskrit",
  //         },
  //       },
  //       marksGained: 0,
  //       totalMarks: 0,
  //       totalAsgn: 0,
  //     },
  //     {
  //       month: "March",
  //       year: 2023,
  //       subjects: {
  //         "655a3fcfd4c33881adf1c2f2": {
  //           totalNumber: 550,
  //           numberGained: 80,
  //           noOfAsgn: 2,
  //           subjectName: "English",
  //         },
  //         "655a3fd9d4c33881adf1c2f6": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Hindi",
  //         },
  //         "655a3fe1d4c33881adf1c2fa": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Maths",
  //         },
  //         "656213ac90d819c2be152ed6": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Sanskrit",
  //         },
  //       },
  //       marksGained: 80,
  //       totalMarks: 550,
  //       totalAsgn: 2,
  //     },
  //     {
  //       month: "April",
  //       year: 2023,
  //       subjects: {
  //         "655a3fcfd4c33881adf1c2f2": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "English",
  //         },
  //         "655a3fd9d4c33881adf1c2f6": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Hindi",
  //         },
  //         "655a3fe1d4c33881adf1c2fa": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Maths",
  //         },
  //         "656213ac90d819c2be152ed6": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Sanskrit",
  //         },
  //       },
  //       marksGained: 0,
  //       totalMarks: 0,
  //       totalAsgn: 0,
  //     },
  //     {
  //       month: "May",
  //       year: 2023,
  //       subjects: {
  //         "655a3fcfd4c33881adf1c2f2": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "English",
  //         },
  //         "655a3fd9d4c33881adf1c2f6": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Hindi",
  //         },
  //         "655a3fe1d4c33881adf1c2fa": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Maths",
  //         },
  //         "656213ac90d819c2be152ed6": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Sanskrit",
  //         },
  //       },
  //       marksGained: 0,
  //       totalMarks: 0,
  //       totalAsgn: 0,
  //     },
  //     {
  //       month: "June",
  //       year: 2023,
  //       subjects: {
  //         "655a3fcfd4c33881adf1c2f2": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "English",
  //         },
  //         "655a3fd9d4c33881adf1c2f6": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Hindi",
  //         },
  //         "655a3fe1d4c33881adf1c2fa": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Maths",
  //         },
  //         "656213ac90d819c2be152ed6": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Sanskrit",
  //         },
  //       },
  //       marksGained: 0,
  //       totalMarks: 0,
  //       totalAsgn: 0,
  //     },
  //     {
  //       month: "July",
  //       year: 2023,
  //       subjects: {
  //         "655a3fcfd4c33881adf1c2f2": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "English",
  //         },
  //         "655a3fd9d4c33881adf1c2f6": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Hindi",
  //         },
  //         "655a3fe1d4c33881adf1c2fa": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Maths",
  //         },
  //         "656213ac90d819c2be152ed6": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Sanskrit",
  //         },
  //       },
  //       marksGained: 0,
  //       totalMarks: 0,
  //       totalAsgn: 0,
  //     },
  //     {
  //       month: "August",
  //       year: 2023,
  //       subjects: {
  //         "655a3fcfd4c33881adf1c2f2": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "English",
  //         },
  //         "655a3fd9d4c33881adf1c2f6": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Hindi",
  //         },
  //         "655a3fe1d4c33881adf1c2fa": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Maths",
  //         },
  //         "656213ac90d819c2be152ed6": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Sanskrit",
  //         },
  //       },
  //       marksGained: 0,
  //       totalMarks: 0,
  //       totalAsgn: 0,
  //     },
  //     {
  //       month: "September",
  //       year: 2023,
  //       subjects: {
  //         "655a3fcfd4c33881adf1c2f2": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "English",
  //         },
  //         "655a3fd9d4c33881adf1c2f6": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Hindi",
  //         },
  //         "655a3fe1d4c33881adf1c2fa": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Maths",
  //         },
  //         "656213ac90d819c2be152ed6": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Sanskrit",
  //         },
  //       },
  //       marksGained: 0,
  //       totalMarks: 0,
  //       totalAsgn: 0,
  //     },
  //     {
  //       month: "October",
  //       year: 2023,
  //       subjects: {
  //         "655a3fcfd4c33881adf1c2f2": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "English",
  //         },
  //         "655a3fd9d4c33881adf1c2f6": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Hindi",
  //         },
  //         "655a3fe1d4c33881adf1c2fa": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Maths",
  //         },
  //         "656213ac90d819c2be152ed6": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Sanskrit",
  //         },
  //       },
  //       marksGained: 0,
  //       totalMarks: 0,
  //       totalAsgn: 0,
  //     },
  //     {
  //       month: "November",
  //       year: 2023,
  //       subjects: {
  //         "655a3fcfd4c33881adf1c2f2": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "English",
  //         },
  //         "655a3fd9d4c33881adf1c2f6": {
  //           totalNumber: 100,
  //           numberGained: 40,
  //           noOfAsgn: 1,
  //           subjectName: "Hindi",
  //         },
  //         "655a3fe1d4c33881adf1c2fa": {
  //           totalNumber: 80,
  //           numberGained: 20,
  //           noOfAsgn: 1,
  //           subjectName: "Maths",
  //         },
  //         "656213ac90d819c2be152ed6": {
  //           totalNumber: 0,
  //           numberGained: 0,
  //           noOfAsgn: 0,
  //           subjectName: "Sanskrit",
  //         },
  //       },
  //       marksGained: 60,
  //       totalMarks: 180,
  //       totalAsgn: 2,
  //     },
  //   ];

  const [userData, setUserData] = useState([]);
  const [chartData, setChartData] = useState({ series: [], options: {} });

  const type = localStorage.getItem("type");

  //   console.log(userData, "userData");
  // console.log(chartData, "chartData")


  useEffect(() => {
    getData();
  }, [studentid]);

  const getData = async () => {
    let graph = null;

    if(type === 'student'){
      const graphdata = await fetch(`${SERVER}/graph/student/marks`, {
        method: 'POST',
        credentials: "include",
      });
      graph = await graphdata.json();
      setUserData(graph);
    }else if(type === 'admin' || type === 'teacher'){
      const graphdata = await fetch(`${SERVER}/graph/student/marks`, {
        method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id: studentid,
          }),
      });
      graph = await graphdata.json();
      setUserData(graph);
    }
  };

  useEffect(() => {
    const subjects = {};
    userData.forEach((data) => {
      const { month, subjects: monthSubjects } = data;
      Object.keys(monthSubjects).forEach((subjectId) => {
        const subjectName = monthSubjects[subjectId].subjectName;
        if (!subjects[subjectName]) {
          subjects[subjectName] = {
            name: subjectName,
            data: [],
          };
        }
        subjects[subjectName].data.push(monthSubjects[subjectId].noOfAsgn);
      });
    });

    const series = Object.values(subjects);

    const options = {
      series,
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
      },

      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            total: {
              enabled: true,
              offsetX: 0,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      stroke: {
        width: 1,
        colors: ["#fff"],
      },
      title: {
        text: "Total Assignments of Each Subject by Month",
      },
      xaxis: {
        categories: userData.map((data) => data.month),
        labels: {
          formatter: function (val) {
            return val;
          },
        },
      },
      yaxis: {
        title: {
          text: "Total Assignments",
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return val + " assignments";
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: "top",
        horizontalAlign: "left",
        offsetX: 40,
      },
    };

    setChartData({ series, options });
  }, [userData]);

  return (
    <div>
      <Chart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default NoOfAssignments;
