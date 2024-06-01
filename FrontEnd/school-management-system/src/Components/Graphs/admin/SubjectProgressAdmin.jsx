import React, { useEffect, useState } from "react";
import { SERVER } from "../../../config";
import Chart from "react-apexcharts";

const SubjectProgressAdmin = () => {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [topicCounts, setTopicCounts] = useState([]);
  const [graphData, setGraphData] = useState([]);

  //   console.log(classes, "classes");
  //   console.log(sections, "sections");
    // console.log(subjectProgress, "subjectProgress");
    // console.log(topicCounts, "topicCounts");
    // console.log(graphData, "graphData");

  useEffect(() => {
    fetchInfo();
  }, []);

  useEffect(() => {
    const fetchTopicCount = async () => {
      const subjectResponse = await fetch(
        `${SERVER}/subject/getSubjectClass/${selectedClassId}`,
        {
          credentials: "include",
        }
      );
      const subjectData = await subjectResponse.json();

      const topicsCountArr = await Promise.all(
        subjectData?.data.map(async (subject) => {
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
    selectedClassId && fetchTopicCount();
  }, [selectedClassId]);

  const fetchInfo = async () => {
    const classResponse = await fetch(`${SERVER}/classes/allClasses`, {
      credentials: "include",
    });
    const classData = await classResponse.json();
    setClasses(classData);
  };

  const handleSection = async (e) => {
    setSections([]);
    setTopicCounts([]);
    setGraphData([]);
    setSubjectProgress([]);

    setSelectedClassId(e.target.value);
    const classId = e.target.value;
    const sectionResponse = await fetch(
      `${SERVER}/section/getSectionClass/${classId}`,
      {
        credentials: "include",
      }
    );
    const sectionData = await sectionResponse.json();
    setSections(sectionData?.data);
  };

  const handleGraph = async (e) => {
    if (e.target.value) {
      const sectionid = e.target.value;
      const subjectProgressResponse = await fetch(
        `${SERVER}/graph/student/classprogress/subject`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sectionid: sectionid,
          }),
        }
      );

      const subjectProgressData = await subjectProgressResponse.json();
      setSubjectProgress(subjectProgressData);
    }
  };

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

    if (topicCounts.length > 0 && subjectProgress.length > 0) {
      const totalSubjectProgress = calculateTotalProgress();
      setGraphData(totalSubjectProgress);
    } else {
      setGraphData([]);
    }
  }, [topicCounts, subjectProgress]);

  const series = graphData.map((item) =>
    parseFloat(item.currentProgressPercentage)
  );
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
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-4">
            <select className="form-select" onChange={(e) => handleSection(e)}>
              <option selected disabled>
                Select a Class
              </option>
              {classes.map((ele) => (
                <option value={ele._id} key={ele?._id}>
                  {ele?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-4">
            <select className="form-select" onChange={(e) => handleGraph(e)}>
              <option value="">Select a Section</option>
              {sections.map((ele) => (
                <option value={ele._id} key={ele?._id}>
                  {ele?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <Chart options={options} series={series} type="radialBar" height={350} />
    </div>
  );
};

export default SubjectProgressAdmin;
