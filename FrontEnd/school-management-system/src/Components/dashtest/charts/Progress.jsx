import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import { SERVER } from "../../../config";
import { getTypeToken } from "../../../Context/localStorage";

const Progress = ({ studentid }) => {
  const [subjects, setSubjects] = useState([]);
  const [topicCounts, setTopicCounts] = useState([]);
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const type = getTypeToken();

  // console.log(topicCounts, "topicCounts");
  // console.log(subjectProgress, "subjectProgress");
  // console.log(graphData, "graphData");

  useEffect(() => {
    fetchInfo();
    fetchSubjectProgress();
  }, [studentid]);

  // useEffect(() => {
  //   const calculateTotalProgress = () => {
  //     const progressData = {};

  //     //progress for each subject
  //     topicCounts.forEach((topic) => {
  //       progressData[topic.subjectId] = {
  //         progress: 0,
  //         subjectName: topic.subjectName,
  //         topicCount: topic.topicCount,
  //       };
  //     });

  //     // Calculate total progress for each subject
  //     const flattenedData = [].concat(
  //       ...subjectProgress.map((data) => data.subjects)
  //     );

  //     // Calculate progress
  //     flattenedData.forEach((subject) => {
  //       const { subjectId } = subject;
  //       if (!progressData[subjectId]) {
  //         progressData[subjectId] = {
  //           progress: 0,
  //           subjectName: subject.subjectName,
  //           topicCount: subject.topicCount,
  //         };
  //       }
  //       subject.chapters.forEach((chapter) => {
  //         chapter.topics.forEach((topic) => {
  //           progressData[subjectId].progress += topic.progress;
  //         });
  //       });
  //     });

  //     // Calculate current progress percentage and value for each subject
  //     return Object.keys(progressData).map((subjectId) => {
  //       const { progress, subjectName, topicCount } = progressData[subjectId];
  //       const currentProgressPercentage = (
  //         (progress / (topicCount * 100)) *
  //         100
  //       ).toFixed(2);
  //       return {
  //         subjectId,
  //         subjectName,
  //         currentProgressPercentage: `${currentProgressPercentage}%`,
  //         currentProgressValue: progress,
  //       };
  //     });
  //   };

  //   const totalSubjectProgress = calculateTotalProgress();
  //   setGraphData(totalSubjectProgress);
  // }, [topicCounts, subjectProgress]);

  const fetchInfo = async () => {
    const sessionData = await fetch(`${SERVER}/sessions/active`, {
      credentials: "include",
    });
    const session = await sessionData.json();
    const activeSession = session?.data._id;

    let subjectData = null;

    if (type === "student" || type === "parent") {
      const subjectResponse = await fetch(`${SERVER}/subject/getSubject`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: activeSession,
        }),
      });
      subjectData = await subjectResponse.json();
      setSubjects(subjectData.subjects);
    } else if (type === "admin" || type === "teacher") {
      const subjectResponse = await fetch(`${SERVER}/subject/getSubject`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: session?.data._id,
          student_id: studentid,
        }),
      });
      subjectData = await subjectResponse.json();
      setSubjects(subjectData.subjects);
    }

    const topicsCountArr = await Promise.all(
      subjectData.subjects.map(async (subject) => {
        const courseListResponse = await fetch(
          `${SERVER}/course/getCourse/${subject._id}`,
          {
            credentials: "include",
          }
        );

        const courseListData = await courseListResponse.json();
        const topicCount = courseListData?.data.reduce(
          (totalTopics, document) => totalTopics + document?.topics?.length,
          0
        );

        return {
          subjectId: subject._id,
          subjectName: subject.name,
          topicCount: topicCount,
        };
      })
    );

    setTopicCounts(topicsCountArr);
  };

  const fetchSubjectProgress = async () => {
    let subjectProgressData = null;

    if (type === "student" || type === "parent") {
      const subjectProgressResponse = await fetch(
        `${SERVER}/graph/student/classprogress/subject`,
        { method: "POST", credentials: "include" }
      );
      subjectProgressData = await subjectProgressResponse.json();
      console.log(subjectProgressData);
      setSubjectProgress(subjectProgressData[0]);
    } else if (type === "admin" || type === "teacher") {
      const subjectProgressResponse = await fetch(
        `${SERVER}/graph/student/classprogress/subject`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id: studentid,
          }),
        }
      );
      subjectProgressData = await subjectProgressResponse.json();
      setSubjectProgress(subjectProgressData[0]);
    }
  };
  console.log(subjectProgress);
  const Labels = subjectProgress?.subjects?.map((item) => item.name);
  const seriesData = subjectProgress?.subjects?.map((item) => item.progress);
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
    labels: (subjectProgress && Labels) || [],
  };

  return (
    // <div className="bg-light h-100">
    // </div>
    <div className="card h-100 shadow-lg">
      <div className="card-header py-3 d-flex justify-content-between align-items-center">
        <div className="info-header">
          <h6 className="mb-0 fw-bold ">All Subjects Progress</h6>
        </div>
      </div>
      <div className="card-body">
        <div id="apex-timeline">
          <ApexCharts
            options={options}
            series={(subjectProgress && seriesData) || []}
            type="radialBar"
            height={250}
          />
        </div>
      </div>
    </div>
  );
};

export default Progress;
