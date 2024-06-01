import { useEffect, useState } from "react";
import axios from "axios";
import { SERVER } from "../../../config";
import ApexChart from "react-apexcharts";

export const TeacherDoubtsGraph = ({ teacherid }) => {
  const [doubtsData, setdoubtsData] = useState(null);
  const options2 = {
    chart: {
      height: 300,
      type: "bar",
    },
    colors: [
      "var(--chart-color1)",
      "var(--chart-color2)",
      "var(--chart-color3)",
    ],
    plotOptions: {
      bar: {
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: ["Solved", "Un-Solved"],
    },
    yaxis: {
      title: {
        text: "Doubt Count",
      },
    },
    fill: {
      opacity: 1,
    },
  };

  const options = {
    chart: {
      type: "bar",
      stacked: true,
    },

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
      categories:
        doubtsData && doubtsData.map((entry) => `${entry.year}-${entry.month}`),
      title: {
        text: "Months",
      },
    },
    yaxis: {
      title: {
        text: "Counts",
      },
    },
    legend: {
      position: "top",
    },
  };

  const series = [
    {
      name: "Solved",
      data: doubtsData && doubtsData.map((entry) => entry.solvedCount),
    },
    {
      name: "Unsolved",
      data: doubtsData && doubtsData.map((entry) => entry.unsolvedCount),
    },
  ];

  const fetchTeacherDoubts = async () => {
    let url = teacherid ? `?teacherId=${teacherid}` : "";
    const { data } = await axios.get(`${SERVER}/graph/staff/doubtStack${url}`, {
      withCredentials: true,
    });
    if (data.success) {
      setdoubtsData(data.data);
    }
  };
  useEffect(() => {
    fetchTeacherDoubts();
  }, []);
  return (
    <div className="card">
      <h6 className="p-2 fw-bold">Doubts Graph</h6>
      <ApexChart
        options={options}
        series={series}
        type="bar"
        height={360}
        width={500}
      />
    </div>
  );
};

export const StudentDoubtsGraph = ({ studentid }) => {
  const [doubtsData, setdoubtsData] = useState(null);
  const options2 = {
    chart: {
      height: 300,
      type: "bar",
    },
    colors: [
      "var(--chart-color1)",
      "var(--chart-color2)",
      "var(--chart-color3)",
    ],
    plotOptions: {
      bar: {
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: ["Solved", "Un-Solved"],
    },
    yaxis: {
      title: {
        text: "Doubt Count",
      },
    },
    fill: {
      opacity: 1,
    },
  };

  const options = {
    chart: {
      type: "bar",
      stacked: true,
    },

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
      categories:
        doubtsData && doubtsData.map((entry) => `${entry.year}-${entry.month}`),
      title: {
        text: "Months",
      },
    },
    yaxis: {
      title: {
        text: "Counts",
      },
    },
    legend: {
      position: "top",
    },
  };

  const series = [
    {
      name: "Solved",
      data: doubtsData && doubtsData.map((entry) => entry.solvedCount),
    },
    {
      name: "Unsolved",
      data: doubtsData && doubtsData.map((entry) => entry.unsolvedCount),
    },
  ];

  const fetchTeacherDoubts = async () => {
    let url = studentid ? `?studentId=${studentid}` : "";
    const { data } = await axios.get(
      `${SERVER}/graph/student/doubtStack${url}`,
      {
        withCredentials: true,
      }
    );
    if (data.success) {
      setdoubtsData(data.data);
    }
  };
  useEffect(() => {
    fetchTeacherDoubts();
  }, []);
  return (
    <div className="card">
      <h6 className="p-3 fw-bold">Doubts Graph</h6>
      <ApexChart
        options={options}
        series={series}
        type="bar"
        height={360}
        width={500}
      />
    </div>
  );
};

export const StudentTeacherWiseDoubtsGraph = () => {
  const [doubtsData, setdoubtsData] = useState(null);
  const [allteachers, setallteachers] = useState(null);
  const [selectedTeacher, setselectedTeacher] = useState(null);

  const options = {
    chart: {
      type: "bar",
      stacked: true,
    },

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
      categories:
        doubtsData && doubtsData.map((entry) => `${entry.year}-${entry.month}`),
      title: {
        text: "Months",
      },
    },
    yaxis: {
      title: {
        text: "Counts",
      },
    },
    legend: {
      position: "top",
    },
  };

  const series = [
    {
      name: "Solved",
      data: doubtsData && doubtsData.map((entry) => entry.solvedCount),
    },
    {
      name: "Unsolved",
      data: doubtsData && doubtsData.map((entry) => entry.unsolvedCount),
    },
  ];

  const fetchTeacherDoubts = async (teacherid) => {
    setselectedTeacher(teacherid);
    const { data } = await axios.get(
      `${SERVER}/graph/student/doubtStack/${teacherid}`,
      {
        withCredentials: true,
      }
    );
    if (data.success) {
      setdoubtsData(data.data);
    }
  };

  const fetchAllTeachers = async () => {
    const { data } = await axios.get(
      `${SERVER}/StudentDoubt/studentClassTeacher`,
      {
        withCredentials: true,
      }
    );
    setallteachers(data?.data?.teachers);
    if (data?.data?.teachers.length > 0) {
      fetchTeacherDoubts(data.data.teachers[0]._id);
    }
  };
  useEffect(() => {
    fetchAllTeachers();
  }, []);
  return (
    <div className="card">
      <h6 className="p-2 fw-bold">Doubts Graph</h6>
      <div>
        <select
          name="teacherId"
          onChange={(e) => fetchTeacherDoubts(e.target.value)}
          className="btn  btn-warning-outline "
        >
          <option value="" defaultChecked>
            Select a teacher
          </option>
          {allteachers &&
            allteachers.map((teacher) => (
              <option
                key={teacher._id}
                value={teacher._id}
                selected={selectedTeacher === teacher._id}
              >
                {teacher.name}
              </option>
            ))}
        </select>
      </div>
      <ApexChart
        options={options}
        series={series}
        type="bar"
        height={360}
        width={500}
      />
    </div>
  );
};
