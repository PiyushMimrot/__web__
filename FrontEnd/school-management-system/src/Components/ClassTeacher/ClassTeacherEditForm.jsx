import { useState, useEffect } from "react";

export default function ClassTeacherEditForm({
  title,
  formId,
  teachers,
  editD,
  handleEditData,
}) {
  const [selectedTeacher, setselectedTeacher] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    handleEditData(selectedTeacher, editD._id);
  };

  useEffect(() => {
    if (editD) {
      setselectedTeacher(editD?.teacher_id?._id);
    }
  }, [editD?._id]);

  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="false">
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
            <div className="col-sm">
              <label htmlFor="formFileMultipleone" className="form-label">
                Teacher
              </label>

              <select
                className="form-select"
                aria-label="Default select Teacher"
                onChange={(e) => setselectedTeacher(e.target.value)}
                name="teacher_id"
              >
                <option value="" s>
                  Select Teacher
                </option>
                {teachers.map((item, idx) => {
                  return (
                    <option
                      key={idx}
                      value={item._id}
                      selected={selectedTeacher === item._id}
                    >
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              disabled={selectedTeacher ? false : true}
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
