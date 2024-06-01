import { useEffect, useState } from "react";
import { InstilTable, TableState } from "../../MainComponents/InstillTable";
import Swal from "sweetalert2";

export default function SubjectprogressEdit({
  formId,
  title,
  handleEdit,
  handleAbsents,
  students,
  reasons,
  edit,
}) {
  const [progress, setProgress] = useState(0);
  const [isShow, setIsShow] = useState(0);
  const [studentAbsent, setStudentAbsent] = useState([]);
  const [topicProgress, setTopicProgress] = useState(0);
  const [tableState, setTableState] = useState(TableState.LOADING);

  useEffect(() => {
    setTableState(TableState.LOADING);

    if (edit["topic"]) {
      let etp = edit.topic?.progress ? edit.topic.progress : 0;
      setTopicProgress(etp);
      setProgress(etp);
    }
    setTableState(TableState.SUCCESS);
  }, [edit]);

  const handleAbsent = (e, id) => {
    if (e.target.checked) {
      let studentR = { [e.target.name]: id, reasonid: "" };
      studentAbsent.push(studentR);
      setStudentAbsent([...studentAbsent]);
    } else {
      let removeStudent = studentAbsent.filter((item) => item.studentid !== id);
      setStudentAbsent(removeStudent);
    }
  };

  const handleSelect = (e, id) => {
    studentAbsent.forEach((item, idx) => {
      if (item.studentid === id) {
        item[e.target.name] = e.target.value;
      }
    });

    setStudentAbsent([...studentAbsent]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(progress ,' ',topicProgress)
    if (progress < topicProgress) {
      Swal.fire({
        text: "Progress must be greater than past progress",
        icon: "warning",
        timer: 3000,
      });
    } else {
      handleEdit({ progress: Number(progress), date: new Date() });
      handleAbsents(studentAbsent, progress);
    }
  };

  const handleShowReport = () => {
    setIsShow(!isShow);
  };
  console.log(edit, " ", topicProgress);
  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="addholidayLabel">
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Progress Done
              </label>
              <input
                type="number"
                className="form-control"
                id="exampleFormControlInput1"
                name="progress"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                max={100}
              />
            </div>
            {isShow ? (
              <div className="border border-primary">
                <InstilTable
                  tableState={tableState}
                  titles={["Sr no", "Students", "status", "Reason"]}
                  rows={students.map((student, idx) => ({
                    "Sr no": idx + 1,
                    Students: student.studentid.name,
                    status: (
                      <input
                        className="form-check-input shadow"
                        type="checkbox"
                        id="mark-absent"
                        name="studentid"
                        onChange={(e) => handleAbsent(e, student.studentid._id)}
                      />
                    ),
                    Reason: (
                      <div className="col-sm shadow">
                        <select
                          className="form-select"
                          aria-label="Default select reason"
                          name="reasonid"
                          onChange={(e) =>
                            handleSelect(e, student.studentid._id)
                          }
                        >
                          <option>Select Reason</option>
                          {reasons.map((item, idx) => {
                            return (
                              <option key={idx} value={item._id}>
                                {item.reason}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    ),
                  }))}
                />
              </div>
            ) : (
              ""
            )}

            {!isShow && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleShowReport}
              >
                student report
              </button>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Done
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
