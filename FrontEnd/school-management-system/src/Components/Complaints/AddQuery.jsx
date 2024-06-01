import { useState, useEffect } from "react";
import { SERVER } from "../../config";

export default function AddComplaint({ formId, handleAddQuery, staffType }) {
  const [staff, setStaff] = useState([]);
  const [complainD, setComplainD] = useState({
    complainTitle: "",
    complainDesc: "",
    complainTo: null,
  });

  useEffect(() => {
    if (staffType && staffType.length > 0) {
      let st = staffType.find((item) => item.name === "Teacher");
      if (st) {
        getStaff(st._id);
      }
    }
  }, [staffType]);

  const getStaff = async (id) => {
    try {
      await fetch(SERVER + `/complain/complainStaff/${id}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setStaff(data));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChange = (e) => {
    complainD[e.target.name] = e.target.value;
    setComplainD({ ...complainD });
  };

  const handleQueryTeacher = (e) => {
    let toId = e.target.value;
    let category = null;
    if (toId === "") {
      complainD[e.target.name] = null;
    } else {
      category = "staff";
      complainD[e.target.name] = { toId, category };
    }

    setComplainD({ ...complainD });
  };

  const handleFileInputChange = (event) => {
    const { name, files } = event.target;
    const file = files[0];
    setComplainD((complainD) => ({
      ...complainD,
      [name]: file,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddQuery(complainD);
    setComplainD({
      complainDesc: "",
      complainTitle: "",
      complainTo: null,
    });
  };

  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <form
          onSubmit={handleSubmit}
          name="complainForm"
          className="modal-content"
        >
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="addholidayLabel">
              Add Query{" "}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            <div className="g-3 row mb-3">
              <h6 className="mb-0 fw-bold col-3 pt-2">Query To</h6>
              <div className="ml-3 col">
                <select
                  className="form-select"
                  aria-label="Default select Priority"
                  name="complainTo"
                  onChange={handleQueryTeacher}
                >
                  <option value="" defaultChecked>
                    Select Teacher
                  </option>
                  {staff.map((item, idx) => {
                    return (
                      <option
                        value={item._id}
                        key={idx}
                        selected={complainD?.complainTo?.toId === item._id}
                      >
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="col-sm-12">
              <label htmlFor="fileimg" className="form-label">
                Attach document
              </label>
              <input
                type="file"
                className="form-control"
                name="complainDoc"
                onChange={handleFileInputChange}
              />
            </div>
            <div className="col-sm-12">
              <label htmlFor="depone" className="form-label">
                Query Title
              </label>
              <input
                type="text"
                className="form-control"
                name="complainTitle"
                value={complainD["complainTitle"]}
                onChange={handleChange}
              />
            </div>

            <div className="col-sm-12">
              <label htmlFor="depone" className="form-label">
                Query Description
              </label>
              <textarea
                type="text"
                className="form-control"
                name="complainDesc"
                value={complainD["complainDesc"]}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-success"
              data-bs-dismiss="modal"
              disabled={
                complainD.complainDesc === "" ||
                complainD.complainTitle === "" ||
                complainD.complainTo === null
                  ? true
                  : false
              }
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
