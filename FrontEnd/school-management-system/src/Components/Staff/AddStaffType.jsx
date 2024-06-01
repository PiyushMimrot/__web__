import { useEffect, useState } from "react";

export default function AddStaffType({
  formId,
  addStaffType,
  stafftypes,
  wantNewStaff,
  setwantNewStaff,
}) {
  const [staffT, setStaffT] = useState("");
  const [alreadyPresent, setAlreadyPresent] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      stafftypes.find(
        (item) => item.name.toLowerCase() === staffT.toLowerCase()
      )
    ) {
      setAlreadyPresent(true);
    } else {
      addStaffType(staffT);
    }
  };
  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="addholidayLabel">
              {" "}
              Add New Staff Type
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => {
                if (wantNewStaff) {
                  let modal2 = new bootstrap.Modal(
                    document.getElementById("tickadd")
                  );
                  setwantNewStaff(false);
                  modal2.show();
                }
              }}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Staff Type
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleFormControlInput1"
                placeholder="Enter Staff Type"
                name="staff_type"
                value={staffT}
                onChange={(e) => setStaffT(e.target.value)}
              />
            </div>
            <div>
              <h6>Available Types</h6>
              <div className="d-flex flex-wrap gap-2">
                {stafftypes?.map((item) => (
                  <p
                    style={{ minWidth: 75 }}
                    className="bg-primary p-2 rounded rounded-pill text-white text-center"
                  >
                    {item.name}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              disabled={
                staffT.trim() === ""
                  ? true
                  : stafftypes.find(
                      (item) => item.name.toLowerCase() === staffT.toLowerCase()
                    )
                  ? true
                  : false
              }
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
