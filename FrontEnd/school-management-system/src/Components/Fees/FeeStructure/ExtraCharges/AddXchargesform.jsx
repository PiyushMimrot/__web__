import { useState } from "react";

export default function AddXchargesform({
  formId,
  title,
  handleXCharge,
  feeCollectSts,
  classes,
}) {
  const [className, setClassName] = useState("");
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (className) {
      handleXCharge({ class_name: className, value });
    } else {
      handleXCharge({ value });
    }
    setClassName("");
    setValue("");
  };

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
            {!feeCollectSts && (
              <div className="col-sm">
                <label htmlFor="formFileMultipleone" className="form-label">
                  Class
                </label>
                <select
                  className="form-select"
                  aria-label="Default select Class"
                  onChange={(e) => setClassName(e.target.value)}
                  name="class_id"
                >
                  <option>Select Class</option>
                  {classes.map((item, idx) => {
                    return (
                      <option key={idx} value={item._id}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Amount
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleFormControlInput1"
                placeholder=""
                value={value}
                onChange={(e) => setValue(e.target.value)}
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
