import { useState } from "react";

export default function EditSectionform({
  formId,
  editSection,
  editSectionData,
}) {
  const [secData, setSecData] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    editSectionData.name = secData;
    editSection(editSectionData);
    setSecData("");
  };

  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="false">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="addholidayLabel">
              {" "}
              Edit Section{" "}
            </h5>
            <button
              onClick={() => setSecData("")}
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
                name="section_name"
                placeholder={editSectionData?.name}
                value={secData}
                onChange={(e) => setSecData(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
