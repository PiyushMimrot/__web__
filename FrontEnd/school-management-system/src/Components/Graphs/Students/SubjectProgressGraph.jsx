import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { SERVER } from "../../../config";

const SubjectProgressGraph = ({ studentid }) => {
  const [subjects, setSubjects] = useState([]);
  const [topicCounts, setTopicCounts] = useState([]);
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const type = localStorage.getItem("type");

  // console.log(topicCounts, "topicCounts");
  // console.log(subjectProgress, "subjectProgress");
  // console.log(graphData, "graphData");

  useEffect(() => {
    fetchInfo();
    fetchSubjectProgress();
  }, [studentid]);

  useEffect(() => {
    const calculateTotalProgress = () => {
      const progressData = {};

      //progress for each subject
      topicCounts.forEach((topic) => {
        progressData[topic.subjectId] = {
          progress: 0,
          subjectName: topic.subjectName,
          topicCount: topic.topicCount,
        };
      });

      // Calculate total progress for each subject
      const flattenedData = [].concat(
        ...subjectProgress.map((data) => data.subjects)
      );

      // Calculate progress
      flattenedData.forEach((subject) => {
        const { subjectId } = subject;
        if (!progressData[subjectId]) {
          progressData[subjectId] = {
            progress: 0,
            subjectName: subject.subjectName,
            topicCount: subject.topicCount,
          };
        }
        subject.chapters.forEach((chapter) => {
          chapter.topics.forEach((topic) => {
            progressData[subjectId].progress += topic.progress;
          });
        });
      });

      // Calculate current progress percentage and value for each subject
      return Object.keys(progressData).map((subjectId) => {
        const { progress, subjectName, topicCount } = progressData[subjectId];
        const currentProgressPercentage = (
          (progress / (topicCount * 100)) *
          100
        ).toFixed(2);
        return {
          subjectId,
          subjectName,
          currentProgressPercentage: `${currentProgressPercentage}%`,
          currentProgressValue: progress,
        };
      });
    };

    const totalSubjectProgress = calculateTotalProgress();
    console.log("----------------");
    console.log(totalSubjectProgress);
    setGraphData(totalSubjectProgress);
  }, [topicCounts, subjectProgress]);

  const fetchInfo = async () => {
    const sessionData = await fetch(`${SERVER}/sessions/active`, {
      credentials: "include",
    });
    const session = await sessionData.json();
    const activeSession = session?.data._id;

    let subjectData = null;

    if (type === "student") {
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
          (totalTopics, document) => totalTopics + document.topics.length,
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

    if (type === "student") {
      const subjectProgressResponse = await fetch(
        `${SERVER}/graph/student/classprogress/subject`,
        { method: "POST", credentials: "include" }
      );
      subjectProgressData = await subjectProgressResponse.json();
      setSubjectProgress(subjectProgressData);
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
      setSubjectProgress(subjectProgressData);
    }
  };

  const series = graphData.map((item) =>
    parseFloat(item.currentProgressPercentage)
  );
  console.log(series);
  const labels = graphData.map((item) => item.subjectName);

  const options = {
    series: series,
    chart: {
      height: 350,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: "22px",
          },
          value: {
            fontSize: "16px",
          },
          total: {
            show: true,
            label: "PROGRESS",
            formatter: function (w) {
              return "";
            },
          },
        },
      },
    },
    labels: labels,
  };

  return (
    <div>
      <Chart options={options} series={series} type="radialBar" height={350} />
    </div>
  );
};

export default SubjectProgressGraph;
