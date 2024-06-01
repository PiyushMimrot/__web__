import { useState } from "react";
import { SERVER } from "../../config";

const ProfileModal = ({ setData, modalType }) => {
  const [userInputs, setuserInputs] = useState({});
  const [studentInputs, setStudentInputs] = useState({});
  const [file, setFile] = useState(null);

  const userInputChange = (e) => {
    setuserInputs({ ...userInputs, [e.target.name]: e.target.value });
  };
  const studentInputChange = (e) => {
    setStudentInputs({ ...studentInputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (url, body, setInputs) => {
    try {
      const filtereduserInputs = Object.keys(body).reduce((result, key) => {
        if (body[key].trim() !== "") {
          result[key] = body[key];
        }
        return result;
      }, {});

      if (file) {
        const data = new FormData();
        const fileName = Date.now() + file?.name;
        data.append("name", fileName);
        data.append("file", file);

        // Uploading the file to the project folder
        const uploadResponse = await fetch(`${SERVER}/material/upload`, {
          method: "POST",
          credentials: "include",
          body: data,
        });
        if (!uploadResponse.ok) {
          throw new Error(`HTTP error! Status: ${uploadResponse.status}`);
        }

        const uploadData = await uploadResponse.json();
        console.log(uploadData, "uploadData");

        const postResponse = await fetch(`${SERVER}${url}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ ...filtereduserInputs, logo: fileName }),
        });

        if (!postResponse.ok) {
          throw new Error(`HTTP error! Status: ${postResponse.status}`);
        }
        const result = await postResponse.json();
        setData(result.data);
      } else {
        const postResponse = await fetch(`${SERVER}${url}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(filtereduserInputs),
        });

        if (!postResponse.ok) {
          throw new Error(`HTTP error! Status: ${postResponse.status}`);
        }
        const result = await postResponse.json();
        setData(result.data);
      }

      setInputs({});
    } catch (error) {
      console.error("An error occurred:", error);
      throw error;
    }
  };

  return (
    <>
      {modalType === "admin" && (
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="leaveaddLabel">
              Edit Information
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
                <label htmlFor="name">Edit name</label>
                <input
                  type="text"
                  name="name"
                  className="modal-input"
                  value={userInputs.name || ""}
                  onChange={userInputChange}
                />
                <label htmlFor="email">Edit email</label>
                <input
                  type="text"
                  name="email"
                  className="modal-input"
                  value={userInputs.email || ""}
                  onChange={userInputChange}
                />
                <label htmlFor="phoneNumber">Edit phone number</label>
                <input
                  className="modal-input"
                  name="phoneNumber"
                  type="text"
                  value={userInputs.phoneNumber || ""}
                  onChange={userInputChange}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={() =>
                handleSubmit("/admin/update", userInputs, setuserInputs)
              }
              disabled={
                !(userInputs.name || userInputs.email || userInputs.phoneNumber)
              }
            >
              Submit Changes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {modalType === "student" && (
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="leaveaddLabel">
              Edit Information
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
                <label htmlFor="name">Edit name</label>
                <input
                  type="text"
                  name="name"
                  className="modal-input"
                  value={userInputs.name || ""}
                  onChange={userInputChange}
                />
                <label htmlFor="number">Edit phone number</label>
                <input
                  className="modal-input"
                  name="number"
                  type="text"
                  value={userInputs.number || ""}
                  onChange={userInputChange}
                />
                <label htmlFor="">Photo</label>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={() =>
                handleSubmit(
                  "/students/updateStudent",
                  userInputs,
                  setuserInputs
                )
              }
              disabled={!(userInputs.name || userInputs.number)}
            >
              Submit Changes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {modalType === "parent" && (
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="leaveaddLabel">
              Edit Information
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
                <label htmlFor="fathername">Edit father name</label>
                <input
                  type="text"
                  name="fathername"
                  className="modal-input"
                  value={userInputs.fathername || ""}
                  onChange={userInputChange}
                />
                <label htmlFor="mothername">Edit mother name</label>
                <input
                  type="text"
                  name="mothername"
                  className="modal-input"
                  value={userInputs.mothername || ""}
                  onChange={userInputChange}
                />
                <label htmlFor="phoneNumber">Edit phone number</label>
                <input
                  className="modal-input"
                  name="phoneNumber"
                  type="text"
                  value={userInputs.phoneNumber || ""}
                  onChange={userInputChange}
                />
                <label htmlFor="email">Edit Email</label>
                <input
                  className="modal-input"
                  name="email"
                  type="email"
                  value={userInputs.email || ""}
                  onChange={userInputChange}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={() =>
                handleSubmit(
                  "/studentparent/updateparent",
                  userInputs,
                  setuserInputs
                )
              }
              disabled={
                !(
                  userInputs.name ||
                  userInputs.phoneNumber ||
                  userInputs.fathername ||
                  userInputs.mothername
                )
              }
            >
              Submit Changes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {modalType === "teacher" && (
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="leaveaddLabel">
              Edit Information
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
                <label htmlFor="name">Edit name</label>
                <input
                  type="text"
                  name="name"
                  className="modal-input"
                  value={userInputs.name || ""}
                  onChange={userInputChange}
                />
                <label htmlFor="email">Edit email</label>
                <input
                  type="text"
                  name="email"
                  className="modal-input"
                  value={userInputs.email || ""}
                  onChange={userInputChange}
                />
                <label htmlFor="phone">Edit phone number</label>
                <input
                  className="modal-input"
                  name="phone"
                  type="text"
                  value={userInputs.phone || ""}
                  onChange={userInputChange}
                />
                <label htmlFor="address">Edit address</label>
                <input
                  className="modal-input"
                  name="address"
                  type="text"
                  value={userInputs.address || ""}
                  onChange={userInputChange}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={() =>
                handleSubmit(
                  "/staffmanage/staffupdate",
                  userInputs,
                  setuserInputs
                )
              }
              disabled={
                !(
                  userInputs.name ||
                  userInputs.email ||
                  userInputs.phone ||
                  userInputs.address
                )
              }
            >
              Submit Changes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {modalType === "studentTypeModal" && (
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="edittickitLabel">
              {" "}
              Edit School Information
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
                <label htmlFor="name">Edit name</label>
                <input
                  type="text"
                  name="name"
                  className="modal-input"
                  value={studentInputs.name || ""}
                  onChange={studentInputChange}
                />
                <label htmlFor="email">Edit email</label>
                <input
                  type="text"
                  name="email"
                  className="modal-input"
                  value={studentInputs.email || ""}
                  onChange={studentInputChange}
                />
                <label htmlFor="phone">Edit phone number</label>
                <input
                  className="modal-input"
                  name="phone"
                  type="text"
                  value={studentInputs.phone || ""}
                  onChange={studentInputChange}
                />
                <label htmlFor="address">Edit address</label>
                <input
                  className="modal-input"
                  name="address"
                  type="text"
                  value={studentInputs.address || ""}
                  onChange={studentInputChange}
                />
                <label htmlFor="material">Add school logo: </label>
                <input
                  type="file"
                  id="file"
                  accept=".png,.jpg"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={() =>
                handleSubmit(
                  "/school/updateschool",
                  studentInputs,
                  setStudentInputs
                )
              }
              disabled={
                !(
                  studentInputs.name ||
                  studentInputs.email ||
                  studentInputs.phone ||
                  studentInputs.address
                )
              }
            >
              Submit Changes
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileModal;
