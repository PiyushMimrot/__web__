import { SERVER } from "../../../config";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Accordion, Card } from "react-bootstrap";
import ProgressBar from "react-bootstrap/ProgressBar";

export default function SubjectProgressStudent() {
  const params = useParams();
  const [subject, setSubject] = useState({});
  const [chapters, setChapters] = useState([]);
  const [userType, setUserType] = useState("");
  const [classD, setClassD] = useState({});

  const [getProgress, setGetProgress] = useState([]);
  const [activeSession, setActiveSession] = useState({});

  useEffect(() => {
    fetchInfo();
  }, [subject, classD, activeSession]);

  const fetchInfo = async () => {
    const getProgressData = await fetch(`${SERVER}/classabsents/getprogress`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subjectId: subject._id,
        classId: classD.Class_id,
        sectionId: classD.section_id,
        sessionId: classD.session_id,
      }),
    });

    const progressData = await getProgressData.json();

    //adding progress of each topic_id
    const aggregatedProgress = progressData.reduce((acc, curr) => {
      if (!acc[curr.topicId]) {
        acc[curr.topicId] = {
          topicId: curr.topicId,
          totalProgress: curr.progress,
        };
      } else {
        acc[curr.topicId].totalProgress += curr.progress;
      }
      return acc;
    }, {});

    // Convert the aggregated progress back to an array format if needed
    const aggregatedProgressArray = Object.values(aggregatedProgress);

    // console.log(aggregatedProgressArray, "get progress data");
    setGetProgress(aggregatedProgressArray);
  };

  useEffect(() => {
    if (subject._id) {
      getChapters();
    } else {
      getSubjectStudent();
    }
  }, [subject, activeSession]);

  const getChapters = () => {
    fetch(SERVER + `/course/getCourse/${subject._id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setChapters(data.data);
      });
  };

  const getSubjectStudent = async () => {
    const sessionData = await fetch(`${SERVER}/sessions/active`, {
        credentials: "include",
      });
      const session = await sessionData.json();
      setActiveSession(session?.data._id);

    const subjectData = await fetch(
      `${SERVER}/subject/getSubject/${params.subject}`,
      {
        credentials: "include",
      }
    );
    const sub = await subjectData.json();
    setSubject(sub?.data);

    const studentAlignData = await fetch(
      `${SERVER}/students/getstudentidsession`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: session?.data._id,
        }),
      }
    );

    const studentAlign = await studentAlignData.json();
    setClassD(studentAlign);
  };

  return (
    <div>
      <h2
        className="fw-bold mb-0 text-primary"
        style={{ paddingBottom: "20px" }}
      >
        Subject Progress
      </h2>
      <div className="d-flex justify-content-between mt-4">
        <h2 className="fs-4 ">{subject.name}</h2>
        {userType === "teacher" && (
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#editProgress"
            disabled={!progress.length}
          >
            Add Progress
          </button>
        )}
      </div>

      <div>
        <Accordion defaultActiveKey="0" className="mt-4">
          {chapters.map((chapter, idx) => {
            const eventKey = `accordion-${idx}`;
            return (
              <Accordion.Item eventKey={eventKey} key={idx}>
                <Accordion.Header>{chapter.name}</Accordion.Header>
                <Accordion.Body>
                  <div className="row">
                    <div className="col-sm-12">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>TOPIC</th>
                            <th>Progress</th>
                          </tr>
                        </thead>
                        <tbody>
                          {chapter.topics.map((ele, idx) => {
                            const topicProgress = (
                              getProgress.find(
                                (e) => e.topicId === ele._id
                              ) || {
                                totalProgress: 0,
                              }
                            ).totalProgress;
                            return (
                              <tr key={idx}>
                                <td>{ele.topic}</td>
                                <td>
                                  <ProgressBar
                                    variant="warning"
                                    now={topicProgress}
                                    label={topicProgress + "%"}
                                  />
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </div>
    </div>
  );
}
