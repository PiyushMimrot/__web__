import { useState } from "react";
import Swal from "sweetalert2";

export default function AttendenceForm({
  formId,
  editAttendence,
  handleEdit,
  isPresent,
  setIspresent,
}) {
  const handleChange = (e) => {
    setIspresent(e.target.checked);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    handleEdit({ attendenceId: editAttendence._id, present: isPresent });
  };
  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="addholidayLabel">
              {editAttendence?.studentid?.name}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="form-switch d-flex justify-content-center">
              <h4
                className="form-check-label fw-bold mb-0 text-primary col"
                htmlFor="mark-present"
              >
                Is present ?
              </h4>
              <input
                className="form-check-input fs-4 shadow"
                type="checkbox"
                id="mark-present"
                onChange={handleChange}
                checked={isPresent}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary shadow"
              data-bs-dismiss="modal"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
