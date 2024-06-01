import { useEffect, useState } from "react";

export default function ExamResultform({
  formId,
  title,
  editData,
  addEditMarks,
  subjectMark,
}) {
  const [mark, setMark] = useState({});

  const handleMarks = (e) => {
    if (
      Number(e.target.value) >= 0 &&
      Number(e.target.value) <= Number(subjectMark)
    ) {
      //   mark[e.target.name] = e.target.value;
      setMark({ ...mark, [e.target.name]: e.target.value });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    editData.marksObtain = mark.marksObtain;
    editData.student_id = editData.student_id._id;
    addEditMarks(editData);
    setMark({});
  };
  // console.log(examSubject);
  // console.log(examSubject.length)
  if (Object.keys(editData).length) {
    return (
      <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <form className="modal-content" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="addholidayLabel">
                {title} of {editData.student_id.name}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setMark({})}
              ></button>
            </div>
            <div className="modal-body table-responsive">
              <div className="row">
                <label htmlFor="datepickerded123" className="form-label col">
                  Marks Obtained
                </label>
                <input
                  type="number"
                  className="form-control col"
                  onChange={handleMarks}
                  name="marksObtain"
                  value={mark?.marksObtain || ""}
                  placeholder={editData.marksObtain}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } else return;
}
