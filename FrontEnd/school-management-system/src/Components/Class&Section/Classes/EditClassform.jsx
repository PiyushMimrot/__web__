import { useState } from "react";

export default function EditClasssform({ editId, editClass, editClassName }) {
  const [className, setClassname] = useState();
  const handleEditSubmit = (e) => {
    e.preventDefault();
    editClass.name = className;
    editClassName(editClass);
    setClassname("");
  };

  return (
    <div className="modal fade" id={editId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <form className="modal-content" onSubmit={handleEditSubmit}>
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="addholidayLabel">
              Edit Class {editClass.name}
            </h5>
            <button
              onClick={() => setClassname("")}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Class Name
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleFormControlInput1"
                name="class_name"
                placeholder={editClass?.name}
                onChange={(e) => setClassname(e.target.value)}
                value={className}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
