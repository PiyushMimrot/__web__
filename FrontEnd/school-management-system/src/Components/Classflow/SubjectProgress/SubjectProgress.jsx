import { SERVER } from "../../../config";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Accordion, Card } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import axios from "axios";
export default function SubjectProgress() {
  const params = useParams();
  const [subject, setSubject] = useState({});
  const [chapters, setChapters] = useState([]);
  const [students, setStudents] = useState([]);
  const [reason, setReason] = useState([]);
  const [classD, setClassD] = useState({});

  const [progress, setProgress] = useState([]);
  const [getProgress, setGetProgress] = useState([]);
  const [showProgress, setShowProgress] = useState(true);
  const [checkedStudents, setCheckedStudents] = useState([]);
  const [absentStudents, setAbsentStudents] = useState([]);
  const [nextSubmit, setnextSubmit] = useState(false);
  const [isExisting, setIsExisting] = useState();

  console.log(chapters);

  useEffect(() => {
    fetchInfo();
  }, [subject, classD]);

  const fetchInfo = async () => {
    const getProgressData = await fetch(`${SERVER}/classabsents/getprogress`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subjectId: subject._id,
        classId: classD.class_id,
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
  console.log({ getProgress });
  // console.log(getProgress);

  useEffect(() => {
    if (subject._id) {
      getChapters();
    } else {
      getSubject();
    }

    getReason();
  }, [subject]);

  const getChapters = () => {
    fetch(SERVER + `/course/getCourse/${subject._id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setChapters(data.data);
      });
  };

  const getSubject = () => {
    fetch(`${SERVER}/ClassTeacher/getSubject/${params.subject}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setClassD(data.data);
        setSubject(data.data.subject_id);
      });
  };

  // const progressSlider = (e) => {
  //   setProgress((prev) => {
  //     const idx = parseInt(e.target.name);
  //     const newArr = prev;
  //     newArr[idx] = e.target.value;
  //     return newArr;
  //   });
  // };

  const getAttendance = async () => {
    let date = new Date().toISOString().split("T")[0];
    const res = await fetch(
      `${SERVER}/attendance/getAttendanceByClassAndSection`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          class_id: classD.class_id,
          section_id: classD.section_id,
          date,
        }),
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setStudents(data?.data);
        setnextSubmit(true);
      })
      .catch((err) => console.log(err));
  };

  const handleCheckboxChange = (studentId) => {
    const isChecked = checkedStudents.includes(studentId);

    // Update the array based on whether the checkbox is checked or unchecked
    if (isChecked) {
      setCheckedStudents(checkedStudents.filter((id) => id !== studentId));
      setAbsentStudents(
        absentStudents.filter((ele) => ele.studentid !== studentId)
      );
    } else {
      setCheckedStudents([...checkedStudents, studentId]);
    }
  };

  const getReason = async () => {
    const reasonData = await fetch(`${SERVER}/classLeave/get`, {
      credentials: "include",
    });
    const reasons = await reasonData.json();
    setReason(reasons);
  };

  const handleAbsentStudents = (e, studentId) => {
    const reason = e.target.value;

    const updatedAbsentStudents = [...absentStudents];
    const existingIndex = updatedAbsentStudents.findIndex(
      (item) => item.studentid === studentId
    );

    if (existingIndex !== -1) {
      // Update existing
      updatedAbsentStudents[existingIndex].reason = reason;
    } else {
      // Add new entry
      updatedAbsentStudents.push({
        studentid: studentId,
        reason: reason,
      });
    }
    setAbsentStudents(updatedAbsentStudents);
  };

  const progressSlider = (e, chapterId, topicId) => {
    const value = parseInt(e.target.value);
    value && setShowProgress(false);
    // console.log(value, "onchange");
    const updatedProgress = [...progress];
    const existingIndex = updatedProgress.findIndex(
      (item) => item.chapterId === chapterId && item.topicId === topicId
    );

    if (existingIndex !== -1) {
      // Update existing progress
      updatedProgress[existingIndex].progress = value;
    } else {
      // Add new progress entry
      updatedProgress.push({
        chapterId: chapterId,
        topicId: topicId,
        progress: value,
      });
    }

    // console.log(updatedProgress);
    setProgress(updatedProgress);
  };

  const handleSubmit = async () => {
    progress.forEach((progressItem) => {
      const matchingGetProgress = getProgress.find(
        (item) => item.topicId === progressItem.topicId
      );
      if (matchingGetProgress) {
        progressItem.progress -= matchingGetProgress.totalProgress;
      }
    });

    const sendProgressData = await fetch(`${SERVER}/classabsents/addprogress`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subjectId: subject._id,
        classId: classD.class_id,
        sectionId: classD.section_id,
        sessionId: classD.session_id,
        progress: progress,
        absentees: absentStudents,
      }),
    });

    // console.log(progress);

    const data = await sendProgressData.json();
    // // console.log(data, "final data");

    setProgress([]);
    fetchInfo();
    setAbsentStudents([]);
    setCheckedStudents([]);
    setnextSubmit(false);
    Swal.fire({
      title: "Progress",
      text: "Progress Added",
      icon: "success",
      timer: 3000,
    });
  };

  const progressChangeHandler = (e, ele, chapterId) => {
    // console.log(value);
    // console.log(e.target.value);
    let check = getProgress.find((item) => item.topicId === ele._id);

    if (check) {
      // console.log(check);
      if (check.totalProgress < Number(e.target.value)) {
        // console.log(e.target.value, check.totalProgress);
        progressSlider(e, chapterId, ele._id);
      }
    } else {
      progressSlider(e, chapterId, ele._id);
    }
    // if (
    //   getProgress.find(
    //     (e) => e.topicId === ele._id
    //   )?.totalProgress < parseInt(e.target.value)
    // )
  };

  const handleThis = async () => {
    await axios
      .post(
        `${SERVER}/classabsents/isExisting`,
        {
          subjectId: subject._id,
          classId: classD.class_id,
          sectionId: classD.section_id,
          sessionId: classD.session_id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setIsExisting(res.data.success);
      });
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
        <button
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#editProgress"
          disabled={!progress.length}
          onClick={handleThis}
        >
          Add Progress
        </button>
      </div>
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
                        {chapter.topics.map((ele, idx) => (
                          <tr key={idx}>
                            <td style={{ width: "40%" }}>{ele.topic}</td>
                            <td>
                              <Form.Label>
                                Progress Range{" "}
                                {/* {showProgress
                                  ? (
                                      getProgress.find(
                                        (e) => e.topicId === ele._id
                                      ) || { totalProgress: 0 }
                                    ).totalProgress
                                  : (
                                      progress.find(
                                        (e) => e.topicId === ele._id
                                      ) || { progress: 0 }
                                    ).progress ||
                                    (
                                      getProgress.find(
                                        (e) => e.topicId === ele._id
                                      ) || { totalProgress: 0 }
                                    ).totalProgress} */}
                                {/* % */}
                              </Form.Label>
                              <Form.Range
                                defaultValue={
                                  (
                                    getProgress.find(
                                      (e) => e.topicId === ele._id
                                    ) || { totalProgress: 0 }
                                  ).totalProgress
                                }
                                name={idx}
                                min={0}
                                max={100}
                                value={
                                  progress.find((e) => e.topicId === ele._id)
                                    ?.progress
                                    ? progress.find(
                                        (e) => e.topicId === ele._id
                                      )?.progress
                                    : (
                                        getProgress.find(
                                          (e) => e.topicId === ele._id
                                        ) || { totalProgress: 0 }
                                      ).totalProgress
                                }
                                onChange={(e) =>
                                  progressChangeHandler(e, ele, chapter._id)
                                }
                                disabled={
                                  (
                                    getProgress.find(
                                      (e) => e.topicId === ele._id
                                    ) || { totalProgress: 0 }
                                  ).totalProgress === 100
                                }
                              />
                            </td>
                            <td>
                              {progress.find((e) => e.topicId === ele._id)
                                ?.progress
                                ? progress.find((e) => e.topicId === ele._id)
                                    ?.progress
                                : (
                                    getProgress.find(
                                      (e) => e.topicId === ele._id
                                    ) || { totalProgress: 0 }
                                  ).totalProgress}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>

      <div
        className="modal fade"
        id="editProgress"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="addholidayLabel">
                {nextSubmit ? "Student Report" : "Progress Report"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div>
                {!nextSubmit ? (
                  <div>
                    <table className="table table-striped">
                      {" "}
                      <thead>
                        <tr>
                          <th>Sr. No.</th>
                          <th>Chapter</th>
                          <th>Topic</th>
                          <th>Progress</th>
                        </tr>
                      </thead>
                      <tbody>
                        {progress.map((item, index) => {
                          let chaptername = chapters.find(
                            (ch) => ch._id === item.chapterId
                          );
                          let topicname = chaptername?.topics.find(
                            (tp) => tp._id === item.topicId
                          );
                          return (
                            <tr key={index} className="mb-4 mt-4">
                              <td>{index + 1}.</td>
                              <td>{chaptername.name}</td>

                              <td>{topicname.topic}</td>

                              <td>{item.progress}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <table className="table table-striped">
                    {" "}
                    <thead>
                      <tr>
                        <th>Sr. No.</th>
                        <th>Present Today</th>
                        <th>Not present in class</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student, index) => (
                        <tr key={index} className="mb-4 mt-4">
                          <td>{index + 1}</td>
                          <td>{student.studentid.name}</td>
                          <td
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-start",
                              gap: "8px",
                            }}
                          >
                            <input
                              type="checkbox"
                              id={`checkbox-${index}`}
                              value={student.studentid._id}
                              className="form-check-input"
                              checked={checkedStudents.includes(
                                student.studentid._id
                              )}
                              onChange={() =>
                                handleCheckboxChange(student.studentid._id)
                              }
                            />
                            <label htmlFor={`checkbox-${index}`}></label>
                            {checkedStudents.includes(
                              student.studentid._id
                            ) && (
                              <select
                                name="reason"
                                id="reason"
                                className="form-select"
                                onChange={(e) =>
                                  handleAbsentStudents(e, student.studentid._id)
                                }
                              >
                                <option selected disabled>
                                  Select a Reason
                                </option>
                                {reason?.reason.map((ele, idx) => (
                                  <option value={ele} key={idx}>
                                    {" "}
                                    {ele}
                                  </option>
                                ))}
                              </select>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            {console.log(isExisting)}
            <div className="modal-footer">
              {isExisting ? (
                <button
                  data-bs-dismiss="modal"
                  className="btn btn-secondary"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              ) : !nextSubmit ? (
                <button className="btn btn-secondary" onClick={getAttendance}>
                  Next
                </button>
              ) : (
                <>
                  <button
                    className="btn btn-secondary"
                    onClick={() => setnextSubmit(false)}
                  >
                    Prev
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    onClick={handleSubmit}
                  >
                    Submit Status
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
