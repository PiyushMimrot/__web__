import { useState, useRef } from "react";
import { SERVER } from "../../config";
import Swal from "sweetalert2";
const AddAdmin = ({ reReq, setreReq }) => {
  const [schoolInputs, setSchoolInputs] = useState({
    admin_name: "",
    admin_phoneNumber: "",
    admin_email: "",
    school_name: "",
    school_address: "",
    school_phone: "",
    school_email: "",
    school_password: "",
    school_code: "",
    session_name: "",
    session_start: "",
    session_end: "",
  });
  const [isdisable, setisdisable] = useState(true);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const schoolInputChange = (e) => {
    setSchoolInputs({ ...schoolInputs, [e.target.name]: e.target.value });
    if (!Object.values(schoolInputs).some((item) => item === "")) {
      setisdisable(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const NewSchoolFormData = new FormData();

      for (const key in schoolInputs) {
        NewSchoolFormData.append(key, schoolInputs[key]);
      }
      NewSchoolFormData.append("school_logo", file);

      let response = await fetch(`${SERVER}/supperAdmin/add_school`, {
        method: "POST",
        body: NewSchoolFormData,
        credentials: "include",
      });
      response = await response.json();
      if (response.success) {
        setSchoolInputs({
          admin_name: "",
          admin_phoneNumber: "",
          admin_email: "",
          school_name: "",
          school_address: "",
          school_phone: "",
          school_email: "",
          school_password: "",
          school_code: "",
          session_name: "",
          session_start: "",
          session_end: "",
        });
        setFile(null);
        fileInputRef.current.value = null;
        Swal.fire({
          title: "School Added",
          text: "successfully school is added into instill!",
          icon: "success",
        });
        setreReq(!reReq);
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(file);
  return (
    <div>
      <div className="d-flex justify-content-between">
        <h3 className="fw-bold text-primary">All Schools</h3>

        <button
          type="button"
          className="btn btn-secondary"
          data-bs-toggle="modal"
          data-bs-target="#editusertype"
        >
          Add New School
        </button>
      </div>
      {/* <br /> */}

      <div
        className="modal fade"
        id="editusertype"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="leaveaddLabel">
                Add School Information
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
                <div className="modal-inputs">
                  <label htmlFor="name">admin name</label>
                  <input
                    type="text"
                    name="admin_name"
                    className="modal-input"
                    value={schoolInputs.admin_name}
                    onChange={schoolInputChange}
                  />
                  <label htmlFor="email">admin email</label>
                  <input
                    type="text"
                    name="admin_email"
                    className="modal-input"
                    value={schoolInputs.admin_email}
                    onChange={schoolInputChange}
                  />
                  <label htmlFor="phoneNumber">admin phone number</label>
                  <input
                    className="modal-input"
                    name="admin_phoneNumber"
                    type="number"
                    value={schoolInputs.admin_phoneNumber}
                    onChange={schoolInputChange}
                  />

                  <label htmlFor="name">school name</label>
                  <input
                    type="text"
                    name="school_name"
                    className="modal-input"
                    value={schoolInputs.school_name}
                    onChange={schoolInputChange}
                  />
                  <label htmlFor="email">school email</label>
                  <input
                    type="text"
                    name="school_email"
                    className="modal-input"
                    value={schoolInputs.school_email}
                    onChange={schoolInputChange}
                  />
                  <label htmlFor="phone">school phone number</label>
                  <input
                    className="modal-input"
                    name="school_phone"
                    type="number"
                    value={schoolInputs.school_phone}
                    onChange={schoolInputChange}
                  />
                  <label htmlFor="address">school address</label>
                  <input
                    className="modal-input"
                    name="school_address"
                    type="text"
                    value={schoolInputs.school_address}
                    onChange={schoolInputChange}
                  />
                  <label htmlFor="material">Add school logo: </label>
                  <input
                    type="file"
                    id="file"
                    accept=".png,.jpg"
                    ref={fileInputRef}
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                  <label htmlFor="password">Add school password</label>
                  <input
                    className="modal-input"
                    name="school_password"
                    type="password"
                    value={schoolInputs.school_password}
                    onChange={schoolInputChange}
                  />
                  <label htmlFor="phoneNumber">school Code</label>
                  <input
                    className="modal-input"
                    name="school_code"
                    type="text"
                    value={schoolInputs.school_code}
                    onChange={schoolInputChange}
                  />

                  <label htmlFor="phoneNumber">session Name</label>
                  <input
                    className="modal-input"
                    name="session_name"
                    type="text"
                    value={schoolInputs.session_name}
                    onChange={schoolInputChange}
                  />
                  <label htmlFor="session start">session Start </label>
                  <input
                    className="modal-input"
                    name="session_start"
                    type="date"
                    value={schoolInputs.session_start}
                    onChange={schoolInputChange}
                  />
                  <label htmlFor="sessionend">session End</label>
                  <input
                    className="modal-input"
                    name="session_end"
                    type="date"
                    value={schoolInputs.session_end}
                    onChange={schoolInputChange}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleSubmit}
                disabled={isdisable || !file}
              >
                Submit Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;
