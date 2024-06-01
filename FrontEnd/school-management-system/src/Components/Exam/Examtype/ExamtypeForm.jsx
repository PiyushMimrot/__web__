import { useState, useEffect } from "react";

export default function Examtypeform({
  formId,
  handleExamtype,
  title,
  EditData,
}) {
  const [examType, setExamtype] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    handleExamtype(examType);
    setExamtype("");
  };

  useEffect(() => {
    if (EditData?._id) {
      setExamtype(EditData.exam_name);
    }
  }, [EditData?._id]);

  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="addholidayLabel">
              {" "}
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
                Exam Type
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleFormControlInput1"
                name="exam_type"
                onChange={(e) => setExamtype(e.target.value)}
                value={examType}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              {formId === "addExamType" ? "Add" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
