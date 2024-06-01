import React, { useState, useEffect } from "react";
import { SERVER } from "../../config";
import axios from "axios";
import { AiOutlineEye, AiFillEdit, AiFillDelete } from "react-icons/ai";
import { MdCheckCircle } from "react-icons/md";
import { ImCross } from "react-icons/im";
import { getTypeToken } from "../../Context/localStorage";

function TodayProgress() {
  const type = getTypeToken();
  const [classes, setClasses] = useState([]);
  const [section, setSections] = useState([]);
  const [classIndex, setClassIndex] = useState(null);
  const [sectionIndex, setSectionIndex] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [todayDate, setTodayDate] = useState(new Date());
  const [progress, setProgress] = useState([]);
  const [uniqueChapterIds, setUniqueChapterIds] = useState([]);
  const [absentees, setAbsentees] = useState([]);
  const [myId, setMyId] = useState("");
  const [data, setData] = useState([]);
  const getProgress = async () => {
    await axios
      .post(
        `${SERVER}/todayprogress`,
        { sectionId: sectionIndex, date },
        { withCredentials: true }
      )
      .then((res) => {
        setProgress(res.data?.result);
        const subjects = [
          ...new Set(res.data?.result?.map((item) => item.subjectId._id)),
        ];

        setUniqueChapterIds(subjects);
        setData(res.data.a);
      });
  };

  useEffect(() => {
    getProgress();
  }, [sectionIndex, date]);
  useEffect(() => {
    if (type === "teacher" || type === "admin") {
      (async () => {
        let res = await fetch(SERVER + "/classes", {
          credentials: "include",
        });
        if (res.status === 200) {
          res = await res.json();
          setClasses(res);
        } else console.log(res, "ERROR ---");
      })();
    } else {
      (async () => {
        await axios
          .get(`${SERVER}/sessions/active`, { withCredentials: true })
          .then((res) => res.data.data._id)
          .then(async (session_id) => {
            await axios
              .post(
                `${SERVER}/studentAlign/getstudentidsession`,
                { session_id },
                { withCredentials: true }
              )
              .then((res) => {
                setMyId(res?.data?.studentid);
                setSectionIndex(res?.data?.section_id);
              });
          });
      })();
    }
  }, []);
  const getSections = (id) => {
    fetch(SERVER + `/section/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setSections(data);
        if (data.length === 1) {
          setSectionIndex(data[0]?._id);
        } else {
        }
      });
  };

  const handleGetSection = (e) => {
    setSections([]);
    getSections(e.target.value);
    setClassIndex(e.target.value);
  };
  useEffect(() => {
    if (classIndex) {
      getSections();
    }
  }, [setClassIndex]);

  return (
    <div className="row w-100 p-4">
      <div className="d-flex gap-3 mb-4 card px-3 py-4">
        <h2 className="fw-bold text-primary">Daily Progress</h2>
        <div className="row">
          {/* Class */}
          {(type === "teacher" || type === "admin") && (
            <div className="col-sm-4">
              <select
                className="form-select"
                aria-label="Default select Class"
                onChange={handleGetSection}
                name="class_id"
              >
                <option defaultValue value={null}>
                  Select a class
                </option>
                {classes?.map((item, idx) => {
                  return (
                    <option key={idx} value={item._id}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          )}

          {/* Section */}
          {classIndex && (
            <div className="col-sm-4">
              <select
                className="form-select"
                aria-label="Select a section"
                onChange={(e) => setSectionIndex(e.target.value)}
                name="section_id"
              >
                <option defaultValue>Select a section</option>
                {section.length &&
                  section?.map((item, idx) => {
                    return (
                      <option key={idx} value={item._id}>
                        {item.name}
                      </option>
                    );
                  })}
              </select>
            </div>
          )}
          {/* Date */}
          <div className="col-sm-4">
            <input
              type="date"
              className="form-control"
              id="formFileMultipleone"
              name="date"
              onChange={(e) => setDate(e.target.value)}
              max={todayDate.toISOString().split("T")[0]}
              value={date}
            />
          </div>
        </div>
      </div>
      <div>
        {data?.map((i) => (
          <div className="mt-3">
            <div className="bg-primary d-flex text-white justify-content-between align-items-center p-2">
              <p>
                {`By ${
                  i?.classHistory?.staffId?.name
                    ? i?.classHistory?.staffId?.name
                    : `Admin`
                }`}
                ({i?.classHistory?.subjectId?.name})
              </p>
              <div className="">
                {type === "admin" || type === "teacher" ? (
                  <button
                    type="button"
                    className="btn btn-outline-primary text-white btn-set-task w-sm-100"
                    data-bs-toggle="modal"
                    data-bs-target={`#myModal`}
                    onClick={() => setAbsentees(i?.absentees)}
                  >
                    <AiOutlineEye />
                  </button>
                ) : i?.absentees?.find(
                    (item) => item?.studentId?._id === myId
                  ) ? (
                  <ImCross size={20} color="red" />
                ) : (
                  <MdCheckCircle size={20} color="green" />
                )}
              </div>
            </div>
            {i?.progressData?.map((p) => (
              <div className="row bg-white p-2 border d-flex align-items-center">
                <div className="col-6">
                  {p?.chapterId?.name} (
                  {
                    p?.chapterId?.topics?.find((t) => t?._id === p?.topicId)
                      ?.topic
                  }
                  )
                </div>
                <div className="col-4 text-success">+{p?.progress}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* {warning && (
        <div
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          <strong>Warning!</strong> {warning}
          <button
            type="button"
            className="btn-close"
            data-dismiss="alert"
            aria-label="Close"
            // onClick={setWarning(null)}
          ></button>
        </div>
      )} */}
      {/* {students && (
        <div
          className="alert alert-primary alert-dismissible fade show row"
          role="alert"
        >
          <div className="col">Total Students:NA</div>
          <div className="col">Present:NA</div>
          <div className="col">Absents: NA</div>
        </div>
      )} */}

      {/* Modal */}
      <div
        class="modal fade"
        id="myModal"
        tabindex="-1"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="myModalLabel">
                Absentees Report
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>S.NO</th>
                    <th>Name</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {absentees?.length === 0 ? (
                    <div>No Absentees</div>
                  ) : (
                    absentees?.map((student, index) => (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{student?.studentId?.name}</td>
                        <td>{student?.reason}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodayProgress;
