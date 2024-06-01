import { useState } from "react";
import Swal from "sweetalert2";

export default function AddSectionform({ formId, addSection }) {
  const [secData, setSecData] = useState({ name: "" });

  const handleChange = (e) => {
    secData[e.target.name] = e.target.value;
    setSecData({ ...secData });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (secData.name) {
      addSection(secData);
    } else {
      Swal.fire({
        text: "Section Name is absent",
        icon: "info",
        timer: 3000,
      });
    }
    setSecData({ name: "" });
  };

  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="addholidayLabel">
              {" "}
              Add New Section
            </h5>
            <button
              onClick={() => setSecData({ ...secData, name: "" })}
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Section Name
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleFormControlInput1"
                placeholder="Enter New Section Name"
                name="name"
                value={secData.name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              disabled={secData.name.trim() ? false : true}
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
