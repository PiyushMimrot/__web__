import { useEffect, useState } from "react";
import { SERVER } from "../../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSlash } from "@fortawesome/free-solid-svg-icons";
import ProfileModal from "./ProfileModal";
import { FiEdit } from "react-icons/fi";
import { FcDocument } from "react-icons/fc";
import Swal from "sweetalert2";
import "./modal.css";
import axios from "axios";

const Profile = () => {
  const [userInfo, setuserInfo] = useState({});
  const [parentInfo, setparentInfo] = useState(null);
  const [schoolInfo, setSchoolInfo] = useState({});
  const [currentType, setCurrentType] = useState("");
  const [classSection, setClassSection] = useState({});
  const [reReq, setReReq] = useState(false);
  const [updateName, setUpdateName] = useState("");
  const [updateEmail, setUpdateEmail] = useState("");
  const [updateNumber, setUpdateNumber] = useState("");
  const [updateSchoolName, setUpdateSchoolName] = useState("");
  const [updateSchoolNumber, setUpdateSchoolNumber] = useState("");
  const [updateSchoolId, setUpdateSchoolId] = useState("");
  const [updateSchoolAdd, setUpdateSchoolAdd] = useState("");
  const [updateSchoolVisit, setUpdateSchoolVisit] =
    useState("www.myschool.com");
  const [allData, setAllData] = useState({});
  const [updateUser, setUpdateUser] = useState({});
  const [currentDocument, setCurrentDocument] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const [copyDetail, setCopyDetail] = useState(
    userInfo?.adherNumber?.length === 12 ? false : true
  );
  const [newStaff, setNewStaff] = useState({
    gender: "",
    email: "",
    address: "",
    adherCard: "",
    panCard: "",
    photo: "",
    nationality: "",
    religion: "",
    adherNumber: "",
    panNumber: "",
  });
  const [newStudent, setNewStudent] = useState();
  const getUser = async () =>
    await axios
      .get(`${SERVER}/userDetail`, { withCredentials: true })
      .then((res) => {
        setuserInfo(res.data.user);
        setSchoolInfo(res.data.school);
        setCurrentType(res.data.type);
        setAllData(res.data);
        if (res.data?.type === "teacher" || res.data?.type === "Accountant") {
          setNewStaff(res.data.user);
        }
        if (res.data?.type === "student") {
          setNewStudent(res.data.user);
        }
        if (res.data?.parent) {
          setparentInfo(res.data.parent);
        }
      })
      .then(() =>
        setUpdateUser({
          name: userInfo.name,
          email: userInfo.email,
          number: userInfo.phoneNumber,
        })
      )
      .catch((err) => console.log(err));
  useEffect(() => {
    getUser();
  }, [reReq]);

  const checkAdherNumber = async (event) => {
    const { name, value } = event.target;
    if (value.length < 12) {
      setCopyDetail(true);
    }
    if (value.length <= 12) {
      if (currentType === "teacher" || currentType === "Accountant") {
        setNewStaff((prevMaterial) => ({
          ...prevMaterial,
          adherNumber: value.trim(),
        }));
      }
      if (currentType === "student") {
        setNewStudent((prevMaterial) => ({
          ...prevMaterial,
          adherNumber: value.trim(),
        }));
      }
    }
    if (value.length === 12) {
      let { data } = await axios.post(
        `${SERVER}/aadhaarCheck`,
        { adhervalue: value, checkFor: currentType },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (data.success && data.isUnique) {
        setCopyDetail(false);
        setIsChanged(true);
      } else {
        setCopyDetail(true);
      }
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (value.trim().length !== 0) {
      setCopyDetail(false);
    }
    if (name === "panNumber") {
      setNewStaff((prevMaterial) => ({
        ...prevMaterial,
        [name]: value.toUpperCase().trim(),
      }));
    } else {
      if (currentType === "teacher") {
        setNewStaff((prevMaterial) => ({
          ...prevMaterial,
          [name]: value.trim(),
        }));
      }
      if (currentType === "student") {
        setNewStudent((prevMaterial) => ({
          ...prevMaterial,
          [name]: value.trim(),
        }));
      }
    }
  };

  const handleUpdate = async () => {
    if (currentType === "admin") {
      await axios
        .put(
          `${SERVER}/userDetail/updatePerson`,
          { name: updateName, email: updateEmail, phoneNumber: updateNumber },
          {
            withCredentials: true,
          }
        )
        .then((res) => setReReq(!reReq))
        .catch((err) => console.log(err));
    }
    if (currentType === "teacher" || currentType === "Accountant") {
      await axios
        .put(
          `${SERVER}/userDetail/updatePerson`,
          { name: updateName, email: updateEmail, phone: updateNumber },
          {
            withCredentials: true,
          }
        )
        .then((res) => setReReq(!reReq))
        .catch((err) => console.log(err));
    }
    if (currentType === "student") {
      await axios
        .put(
          `${SERVER}/userDetail/updatePerson`,
          { name: updateName, number: updateNumber },
          {
            withCredentials: true,
          }
        )
        .then((res) => setReReq(!reReq))
        .catch((err) => console.log(err));
    }
  };

  const handleStaffUpdate = async () => {
    let URL = `${SERVER}/staffmanage/staff/${userInfo?._id}`;

    await fetch(URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStaff),
      credentials: "include",
    })
      .then(async (response) => {
        const data = await response.json();
        if (data.success) {
          Swal.fire({
            title: "Success",
            text: "Staff updated successfully",
            icon: "success",
          });
          getUser();
          setCopyDetail(true);
        }
      })
      .catch((error) => {
        console.error("Error updating material:", error);
      });
  };

  const handleStudentUpdate = async () => {
    const res = await axios
      .put(
        `${SERVER}/courseplatform/studentinformation/${userInfo?._id}`,
        newStudent,
        {
          withCredentials: true,
        }
      )
      .then(() => {
        Swal.fire({
          title: "Success",
          text: "Student Edited Successfully",
          icon: "success",
          timer: 3000,
        });
        getUser();
        setCopyDetail(true);
      });
  };

  const handleSchoolUpdate = async () => {
    await axios
      .put(
        `${SERVER}/userDetail/updateSchool`,
        {
          name: updateSchoolName,
          address: updateSchoolAdd,
          phone: updateSchoolNumber,
          email: updateSchoolId,
        },
        { withCredentials: true }
      )
      .then((res) => setReReq(!reReq))
      .catch((err) => console.log(err));
  };

  const handleFileUpload = async (e, type) => {
    const fileData = new FormData();
    fileData.append(type, e.target.files[0]);
    if (currentType === "teacher" || currentType === "Accountant") {
      axios
        .put(`${SERVER}/staffmanage/editStaff/${userInfo?._id}`, fileData, {
          withCredentials: true,
        })
        .then((res) => {
          if (res.data.success) {
            Swal.fire({
              title: "Success",
              text: "Staff updated successfully",
              icon: "success",
            });
            getUser();
            setCopyDetail(true);
          }
        });
    }
    if (currentType === "student") {
      axios
        .put(
          `${SERVER}/courseplatform/editStudent/${userInfo?._id}`,
          fileData,
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          if (res.data.success) {
            Swal.fire({
              title: "Success",
              text: "Student updated successfully",
              icon: "success",
            });
            getUser();
            setCopyDetail(true);
          }
        });
    }
  };

  return (
    <div className="d-flex flex-column align-items-center ">
      {/* Personal details */}
      <div className=" d-flex w-100 justify-content-end align-items-end"></div>
      <div className="card mb-3 shadow-lg w-100">
        <div className="row g-0">
          <div className="col-md-8">
            <div className="card-body">
              <div className="d-flex justify-content-between ">
                <div>
                  <e style={{ fontSize: 8 }}>Name</e>
                  <h5>{userInfo?.name}</h5>
                </div>
                {currentType !== "parent" && (
                  <div className="">
                    <button
                      onClick={() => {
                        setUpdateName(userInfo.name);
                        setUpdateEmail(userInfo.email);
                        if (currentType === "admin") {
                          setUpdateNumber(userInfo.phoneNumber);
                        }
                        if (
                          currentType === "teacher" ||
                          currentType === "Accountant"
                        ) {
                          setUpdateNumber(userInfo.phone);
                        }
                        if (currentType === "student") {
                          setUpdateNumber(userInfo.number);
                        }
                      }}
                      type="button"
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#myModal"
                    >
                      <FiEdit size={20} />
                    </button>
                  </div>
                )}
              </div>

              <div className="row">
                <div className="col">
                  {/* <div>
                    <e style={{ fontSize: 8 }}>Role</e>
                    <p>{currentType}</p>
                  </div> */}

                  <div>
                    <e style={{ fontSize: 8 }}>Phone Number</e>
                    <p>
                      {userInfo?.phoneNumber ||
                        userInfo?.phone ||
                        userInfo?.number}
                    </p>
                  </div>
                  {currentType === "teacher" ||
                  currentType === "Accountant" ||
                  currentType === "admin" ? (
                    <div>
                      <e style={{ fontSize: 8 }}>Email Id</e>
                      {userInfo?.email ? (
                        <p>{userInfo.email}</p>
                      ) : (
                        <input
                          name="email"
                          onChange={handleInputChange}
                          value={newStaff?.email}
                          className="form-control"
                        />
                      )}
                    </div>
                  ) : (
                    <div>
                      <e style={{ fontSize: 8 }}>Student DOB</e>
                      <p>{userInfo?.dob?.slice(0, 10)}</p>
                    </div>
                  )}
                </div>
                {currentType !== "admin" &&
                  (currentType === "teacher" || currentType === "Accountant" ? (
                    <div>
                      <e style={{ fontSize: 8 }}>Gender</e>
                      {userInfo?.gender ? (
                        <p>{userInfo.gender}</p>
                      ) : (
                        <select
                          name="gender"
                          value={newStaff?.gender}
                          className="form-select mb-2"
                          aria-label="Default select example"
                          onChange={handleInputChange}
                          data-bs-toggle="tooltip"
                          data-bs-placement="left"
                          title="Select Gender"
                        >
                          <option value={0} selected>
                            Select Gender
                          </option>
                          <option value={"Male"}>Male</option>
                          <option value={"Female"}>Female</option>
                        </select>
                      )}
                    </div>
                  ) : (
                    currentType === "student" && (
                      <div>
                        <e style={{ fontSize: 8 }}>Aadhaar Number</e>
                        {userInfo?.adherNumber ? (
                          <p>{userInfo.adherNumber}</p>
                        ) : (
                          <input
                            name="adherNumber"
                            onChange={checkAdherNumber}
                            value={newStudent?.adherNumber}
                            className="form-control"
                          />
                        )}
                      </div>
                    )
                  ))}
                {currentType === "teacher" ||
                  (currentType === "Accountant" && (
                    <div>
                      <e style={{ fontSize: 8 }}>Address</e>
                      {userInfo?.address ? (
                        <p>{userInfo?.address}</p>
                      ) : (
                        <input
                          className="form-control"
                          name="address"
                          value={newStaff.address}
                          onChange={handleInputChange}
                        />
                      )}
                    </div>
                  ))}
                {(currentType === "teacher" ||
                  currentType === "Accountant") && (
                  <div>
                    <e style={{ fontSize: 8 }}>Aadhaar Number</e>
                    {userInfo?.adherNumber ? (
                      <p>{userInfo.adherNumber}</p>
                    ) : (
                      <input
                        className="form-control"
                        name="adherNumber"
                        value={newStaff?.adherNumber}
                        // onChange={handleInputChange}
                        onChange={checkAdherNumber}
                      />
                    )}
                  </div>
                )}
                {(currentType === "teacher" ||
                  currentType === "Accountant") && (
                  <div>
                    <e style={{ fontSize: 8 }}>PAN Number</e>
                    {userInfo?.panNumber ? (
                      <p>{userInfo.panNumber}</p>
                    ) : (
                      <input
                        className="form-control"
                        value={newStaff?.panNumber}
                        onChange={handleInputChange}
                        name="panNumber"
                      />
                    )}
                  </div>
                )}
                {(currentType === "teacher" ||
                  currentType === "Accountant") && (
                  <div>
                    <e style={{ fontSize: 8 }}>Nationality</e>
                    {userInfo?.nationality ? (
                      <p>{userInfo?.nationality}</p>
                    ) : (
                      <input
                        className="form-control"
                        name="nationality"
                        value={newStaff.nationality}
                        onChange={handleInputChange}
                      />
                    )}
                  </div>
                )}
                {currentType === "teacher" && (
                  <div>
                    <e style={{ fontSize: 8 }}>Religion</e>
                    {userInfo?.religion ? (
                      <p>{userInfo.religion}</p>
                    ) : (
                      <input
                        className="form-control"
                        value={newStaff?.religion}
                        name="religion"
                        onChange={handleInputChange}
                      />
                    )}
                  </div>
                )}
                {(currentType === "student" || currentType === "parent") && (
                  <div className="col">
                    <div>
                      <e style={{ fontSize: 8 }}>Father Name</e>
                      <p>{parentInfo?.fathername}</p>
                    </div>
                    <div>
                      <e style={{ fontSize: 8 }}>Mother Name</e>
                      <p>{parentInfo?.mothername}</p>
                    </div>
                    <div>
                      <e style={{ fontSize: 8 }}>Parent Number</e>
                      <p>{parentInfo?.phoneNumber}</p>
                    </div>
                  </div>
                )}
              </div>
              {currentType === "student" && (
                <div className="row">
                  <div className="col">
                    <div>
                      <e style={{ fontSize: 8 }}>Gender</e>
                      {userInfo?.gender ? (
                        <p>{userInfo.gender}</p>
                      ) : (
                        <select
                          name="gender"
                          value={newStudent?.gender}
                          className="form-select mb-2"
                          aria-label="Default select example"
                          onChange={handleInputChange}
                          data-bs-toggle="tooltip"
                          data-bs-placement="left"
                          title="Select Gender"
                        >
                          <option value={0} selected>
                            Select Gender
                          </option>
                          <option value={"Male"}>Male</option>
                          <option value={"Female"}>Female</option>
                        </select>
                      )}
                    </div>
                    {/* <div>
                      <e style={{ fontSize: 8 }}>Gender</e>
                      <p>{userInfo?.gender}</p>
                    </div> */}
                    <div>
                      <e style={{ fontSize: 8 }}>Nationality</e>
                      {userInfo?.nationality ? (
                        <p>{userInfo.nationality}</p>
                      ) : (
                        <input
                          name="nationality"
                          onChange={handleInputChange}
                          value={newStudent.nationality}
                          className="form-control"
                        />
                      )}
                    </div>
                    <div>
                      <e style={{ fontSize: 8 }}>Religion</e>
                      {userInfo?.religion ? (
                        <p>{userInfo.religion}</p>
                      ) : (
                        <input
                          name="religion"
                          onChange={handleInputChange}
                          value={newStudent.religion}
                          className="form-control"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
              {currentType !== "admin" && !copyDetail && (
                <div className="d-flex justify-content-end py-3">
                  <button
                    // disabled={copyDetail ? true : false}
                    className="btn btn-primary"
                    onClick={
                      currentType === "teacher" || currentType === "Accountant"
                        ? handleStaffUpdate
                        : currentType === "student" && handleStudentUpdate
                    }
                  >
                    Save
                  </button>
                </div>
              )}
              <p className="card-text text-end">
                <small className="text-muted">Last updated 3 mins ago</small>
              </p>
            </div>
          </div>
          <div
            className="col-md-4 bg-primary d-flex flex-column justify-content-start pt-5 align-items-center"
            style={{ minHeight: 250 }}
          >
            {currentType === "admin" && (
              <img
                src={"/assets/images/lg/avatar3.jpg"}
                alt=""
                className="avatar xl rounded-circle img-thumbnail shadow-sm"
              />
            )}
            {(currentType === "teacher" || currentType === "Accountant") && (
              <img
                src={`${SERVER}/staffphoto/${userInfo?.photo}`}
                onError={(e) => {
                  e.target.src = "/assets/images/gallery/no-image.png";
                }}
                alt=""
                className="avatar xl rounded-circle img-thumbnail shadow-sm"
              />
            )}
            {(currentType === "student" || currentType === "parent") && (
              <>
                <img
                  src={`${SERVER}/photo/${userInfo?.photo}`}
                  className="avatar xl rounded-circle img-thumbnail shadow-sm"
                  onError={(e) => {
                    e.target.src = "/assets/images/gallery/no-image.png";
                  }}
                />
                <p className="text-white">My ID: {userInfo?.studentId}</p>
              </>
            )}
            {currentType !== "admin" && currentType !== "parent" && (
              <>
                <input
                  type="file"
                  className="custom-file-input d-none"
                  id="photo"
                  onChange={(e) => handleFileUpload(e, "photo")}
                />
                <label className="custom-file-label" for="photo">
                  <span className="btn btn-primary">
                    <FiEdit size={20} />{" "}
                  </span>
                </label>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Documents (PAN,adhercard,photo) */}
      {(currentType === "teacher" ||
        currentType === "Accountant" ||
        currentType === "student") && (
        <div className="row container shadow-lg my-3 ">
          <div className="col">
            <label for="aadhaar" className="form-label">
              Aadhaar:
            </label>
            <div className="input-group">
              <div className="custom-file">
                {allData?.user?.adherCard ? (
                  <button
                    onClick={() => setCurrentDocument("aadhaar")}
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    View
                  </button>
                ) : (
                  <>
                    <input
                      type="file"
                      className="custom-file-input d-none"
                      id="aadhar"
                      onChange={(e) => handleFileUpload(e, "adherCard")}
                    />
                    <label className="custom-file-label" for="aadhar">
                      <span className="btn btn-primary">
                        <FcDocument />
                      </span>
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>
          {(currentType === "teacher" || currentType === "Accountant") && (
            <div className="col">
              <label for="pan" className="form-label">
                PAN:
              </label>
              <div className="input-group">
                <div className="custom-file">
                  {allData?.user?.panCard ? (
                    <button
                      onClick={() => setCurrentDocument("pan")}
                      type="button"
                      className="btn btn-primary"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                    >
                      View
                    </button>
                  ) : (
                    <>
                      <input
                        type="file"
                        className="custom-file-input d-none"
                        id="pan"
                        onChange={(e) => handleFileUpload(e, "panCard")}
                      />
                      <label className="custom-file-label" for="pan">
                        <span className="btn btn-primary">
                          <FcDocument />
                        </span>
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* School details */}
      <div className="bg-white p-3 shadow-lg w-100">
        <div className="d-flex justify-content-between">
          <h5 className="fw-bold">My School Information</h5>
          {currentType === "admin" && (
            <div className="text-primary">
              <button
                onClick={() => {
                  setUpdateSchoolName(schoolInfo.name);
                  setUpdateSchoolNumber(schoolInfo.phone);
                  setUpdateSchoolId(schoolInfo.email);
                  setUpdateSchoolAdd(schoolInfo.address);
                }}
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#myModal2"
              >
                <FiEdit size={20} />
              </button>
            </div>
          )}
        </div>
        <div className="d-flex justify-content-center flex-column align-items-center">
          <img
            src={`${SERVER}/school_logo/${schoolInfo?.logo}`}
            style={{ height: 200, width: 200 }}
            className="avatar xl rounded-circle img-thumbnail shadow-sm mt-3 shadow-lg"
          />
          <h4 className="fw-bold my-2">{schoolInfo?.name}</h4>
        </div>
        <div className="mt-5">
          <div className="row">
            <div className="row col">
              <h6 className="col fw-bold">Address</h6>
              <p className="col">{schoolInfo?.address}</p>
            </div>
            <div className="row col">
              <h6 className="col fw-bold">Contact Number</h6>
              <p className="col">{schoolInfo?.phone}</p>
            </div>
          </div>
          <div className="row">
            <div className="row col">
              <h6 className="col fw-bold">Contact Id</h6>
              <p className="col">{schoolInfo?.email}</p>
            </div>
            <div className="row col">
              <h6 className="col fw-bold">Visit</h6>
              <p className="col">{updateSchoolVisit}</p>
            </div>
          </div>
        </div>
      </div>
      {/* Personal Modal */}
      <div
        className="modal fade"
        id="myModal"
        tabindex="-1"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="myModalLabel">
                Edit Details
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
                <label for="name" className="form-label">
                  Name:
                </label>

                <input
                  type="text"
                  value={updateName}
                  onChange={(e) => setUpdateName(e.target.value)}
                  className="form-control"
                  id="name"
                />
              </div>

              <div className="mb-3">
                <label for="number" className="form-label">
                  Phone Number:
                </label>

                <input
                  type="number"
                  value={updateNumber}
                  maxLength={10}
                  onChange={(e) => setUpdateNumber(e.target.value)}
                  className="form-control"
                  id="number"
                />
              </div>

              {(currentType === "teacher" ||
                currentType === "Accountant" ||
                currentType === "admin") && (
                <div className="mb-3">
                  <label for="email" className="form-label">
                    Email:
                  </label>

                  <input
                    type="email"
                    value={updateEmail}
                    onChange={(e) => setUpdateEmail(e.target.value)}
                    className="form-control"
                    id="email"
                  />
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
                className="btn btn-primary"
                id="submitBtn"
                onClick={handleUpdate}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* School Modal */}
      <div
        className="modal fade"
        id="myModal2"
        tabindex="-1"
        aria-labelledby="myModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="myModalLabel">
                Edit School Details
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
                <label for="name" className="form-label">
                  School Name:
                </label>

                <input
                  type="text"
                  value={updateSchoolName}
                  onChange={(e) => setUpdateSchoolName(e.target.value)}
                  className="form-control"
                  id="name"
                />
              </div>

              <div className="mb-3">
                <label for="number" className="form-label">
                  Phone Number:
                </label>

                <input
                  type="number"
                  maxLength={10}
                  value={updateSchoolNumber}
                  onChange={(e) => setUpdateSchoolNumber(e.target.value)}
                  className="form-control"
                  id="number"
                />
              </div>

              <div className="mb-3">
                <label for="email" className="form-label">
                  Email:
                </label>

                <input
                  type="email"
                  value={updateSchoolId}
                  onChange={(e) => setUpdateSchoolId(e.target.value)}
                  className="form-control"
                  id="email"
                />
              </div>
              <div className="mb-3">
                <label for="name" className="form-label">
                  Address:
                </label>

                <input
                  type="text"
                  value={updateSchoolAdd}
                  onChange={(e) => setUpdateSchoolAdd(e.target.value)}
                  className="form-control"
                  id="name"
                />
              </div>
              <div className="mb-3">
                <label for="name" className="form-label">
                  Visit:
                </label>

                <input
                  disabled={true}
                  type="text"
                  value={updateSchoolVisit}
                  onChange={(e) => setUpdateSchoolVisit(e.target.value)}
                  className="form-control"
                  id="name"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
                className="btn btn-primary"
                id="submitBtn"
                onClick={handleSchoolUpdate}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Document View */}
      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {currentDocument === "aadhaar" ? "Aadhaar Card" : "PAN Card"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body d-flex justify-content-center">
              {(currentType === "teacher" || currentType === "Accountant") &&
                (currentDocument === "aadhaar" ? (
                  <img
                    src={`${SERVER}/staffaadhaar/${allData?.user?.adherCard}`}
                    alt=""
                    className="img-thumbnail"
                  />
                ) : (
                  <img
                    src={`${SERVER}/staffpan/${allData?.user?.panCard}`}
                    alt=""
                    className="img-thumbnail"
                  />
                ))}
              {currentType === "student" && (
                <img
                  src={`${SERVER}/aadhar/${allData?.user?.adherCard}`}
                  className="img-thumbnail"
                  alt="..."
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
