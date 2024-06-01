import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { SERVER } from '../../../config';

const TotalMarksPerMonth = ({studentid}) => {
  const [userData, setUserData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [subjectNames, setSubjectNames] = useState({});
  const type = localStorage.getItem("type");

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
    if (userData.length > 0) {
      const subjectKeys = Object.keys(userData[0]?.subjects || {});

      if (subjectKeys.length === 0) {
        console.error('Invalid userData structure:', userData);
        return;
      }

      const formattedData = userData.map(({ month, subjects }) => {
        const subjectData = {};
        subjectKeys.forEach((key) => {
          subjectData[key] = subjects[key]?.numberGained || 0;
        });

        return {
          name: month,
          ...subjectData,
        };
      });

      setChartData(formattedData);

      const names = {};
      subjectKeys.forEach((key) => {
        names[key] = userData[0]?.subjects[key]?.subjectName || key;
      });
      setSubjectNames(names);
    }
  }, [userData]);


  const options = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: chartData.length > 0 ? chartData.map((item) => item.name) : [],
    },
    yaxis: {
      title: {
        text: 'Gained Marks',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
  };

  const seriesData = Object.keys(chartData[0] || {})
    .filter((key) => key !== 'name')
    .map((subjectKey) => ({
      name: subjectNames[subjectKey] || subjectKey,
      data: chartData.map((item) => item[subjectKey]),
    }));

  const apexChartData = seriesData;
  

  return (
    <div>
      <Chart options={options} series={apexChartData} type="bar" height={350} />
    </div>
  );
};

export default TotalMarksPerMonth;
