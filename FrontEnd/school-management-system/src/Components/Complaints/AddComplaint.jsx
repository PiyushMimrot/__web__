import { useState, useRef } from "react";
import { SERVER } from "../../config";
import { getTypeToken } from "../../Context/localStorage";

export default function AddComplaint({
  formId,
  title,
  staffType,
  handleAddComplaint,
  admin,
  parents,
}) {
  const [staff, setStaff] = useState([]);
  const [complainD, setComplainD] = useState({
    complainTitle: "",
    complainDesc: "",
    isAnonymous: false,
    staffType_id: "",
    complainOn: null,
    complainTo: null,
  });
  const [classes, setClasses] = useState([]);
  const [sections, setSection] = useState([]);
  const [students, setStudents] = useState([]);
  const [classSec, setClassSec] = useState({});
  const [isShow, setIsShow] = useState(true);
  const [showTeacher, setShowTeacher] = useState(false);
  const [error, seterror] = useState(null);

  const ref = useRef();
  const type = getTypeToken();

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

  const getClasses = async () => {
    let res = await fetch(SERVER + "/classes/allClasses", {
      credentials: "include",
    });
    if (res.status === 200) {
      res = await res.json();
      setClasses(res);
    } else console.log(res, "ERROR ---");
  };

  const getSections = (id) => {
    fetch(SERVER + `/section/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setSection(data));
  };

  const getStudents = async (class_id, sec_id) => {
    const resp = await fetch(`${SERVER}/studentAlign/getinfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        class_id: class_id,
        section: sec_id,
      }),
      credentials: "include",
    });
    const res = await resp.json();
    if (res.status === "success") {
      // console.log(res.data);
      setStudents(res.data);
    }

    // getStaff("65250229bc125698a293b59b");
  };

  const handleAnonymous = (e) => {
    complainD[e.target.name] = e.target.checked;
  };

  const handleChange = (e) => {
    complainD[e.target.name] = e.target.value;
    setComplainD({ ...complainD });
  };

  const handleSelect = (e) => {
    if (e.target.value === "student") {
      setIsShow(false);
      getClasses();
    } else {
      setIsShow(true);
      if (e.target.value === "") {
        complainD["complainOn"] = null;
      } else {
        getStaff(e.target.value);
      }
    }

    complainD[e.target.name] = e.target.value;
    setComplainD({ ...complainD });
  };

  const handleSendTo = (e) => {
    if (e.target.value === "parent") {
      let toId = complainD.complainOn?.onId;
      let category = "parent";
      complainD["complainTo"] = { toId, category };
      setShowTeacher(false);
    }
    if (e.target.value === "admin") {
      let toId = admin._id;
      let category = "admin";
      complainD["complainTo"] = { toId, category };
      setShowTeacher(false);
    }
    if (e.target.value === "teacher") {
      handleGetTeachers();
      complainD["complainTo"] = null;
      setShowTeacher(true);
    }
    setComplainD(complainD);
  };

  // complaint to
  const handleSelectTeacher = (e) => {
    let toId = e.target.value;
    let category = "staff";
    complainD[e.target.name] = { toId, category };
    setComplainD({ ...complainD });
  };

  // on complaint
  const handleSelectStaff = (e) => {
    let onId = e.target.value;
    if (onId === "") {
      complainD[e.target.name] = null;
    } else {
      let category = "staff";
      complainD[e.target.name] = { onId, category };
    }
    setComplainD({ ...complainD });
  };

  const handleSelectStudent = (e) => {
    let onId = e.target.value;
    let category = "student";

    complainD[e.target.name] = { onId, category };
    setComplainD({ ...complainD });
  };

  const handleGetSection = (e) => {
    getSections(e.target.value);
    classSec[e.target.name] = e.target.value;
    setClassSec({ ...classSec });
  };

  const handleGetStudents = (e) => {
    getStudents(classSec["class_id"], e.target.value);
    setClassSec({ ...classSec, [e.target.name]: e.target.value });
  };

  const handleGetTeachers = async () => {
    let st = staffType.filter((item) => item.name === "Teacher");
    await fetch(SERVER + `/complain/complainStaff/${st[0]._id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setStaff(data));
  };

  const handleFileInputChange = (event) => {
    const { name, files } = event.target;
    const file = files[0];
    const maxFileSize = 5 * 1024 * 1024;
    if (file && file.size > maxFileSize) {
      seterror(true);
      return;
    } else {
      seterror(null);
      setComplainD((complainD) => ({
        ...complainD,
        [name]: file,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddComplaint(complainD);
    setComplainD({
      complainTitle: "",
      complainDesc: "",
      isAnonymous: false,
      staffType_id: "",
      complainOn: null,
      complainTo: null,
    });
    setIsShow(true);
    ref.current.value = "";
    setClasses([]);
    setSection([]);
    setStudents([]);
    setClassSec({});
    // setStaff([]);
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
              Add Complain
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body tab-pane" id="complain">
            <div className="d-flex justify-content-end">
              <div className="form-check form-switch theme-switch mb-3">
                <span
                  className="form-label fs-5 "
                  style={{ paddingLeft: "15px" }}
                >
                  <strong>Set Anonymous</strong>
                </span>

                <input
                  className="form-check-input fs-5 "
                  type="checkbox"
                  id="theme-switch"
                  name="isAnonymous"
                  value={complainD.isAnonymous}
                  onChange={handleAnonymous}
                />
              </div>
            </div>

            <div className="g-3 row">
              <h6 className="mb-0 fw-bold col">Complaint On:</h6>
              <div className="ml-3 col">
                <label htmlFor="formFileMultipleone" className="form-label">
                  Select User Type
                </label>
                <select
                  className="form-select"
                  aria-label="Default select "
                  name="staffType_id"
                  value={complainD.staffType_id}
                  onChange={handleSelect}
                >
                  <option value="" defaultChecked>
                    Select User Type
                  </option>
                  {staffType.map((item, idx) => {
                    return (
                      <option
                        value={item._id}
                        key={idx}
                        selected={complainD.staffType_id === item._id}
                      >
                        {item.name}
                      </option>
                    );
                  })}
                  <option value="student">Student</option>
                </select>
              </div>
              {isShow ? (
                <div className="ml-3 col">
                  <label htmlFor="formFileMultipleone" className="form-label">
                    Select User
                  </label>
                  <select
                    className="form-select"
                    aria-label="Default select"
                    name="complainOn"
                    // value={complainD.complainOn?.onId}
                    onChange={handleSelectStaff}
                  >
                    <option value={""} defaultValue>
                      Select User
                    </option>
                    {staff.map((item, idx) => {
                      return (
                        <option
                          value={item._id}
                          key={idx}
                          selected={complainD.complainOn?.onId === item._id}
                        >
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              ) : (
                <div>
                  <div className="row">
                    <div className="col-sm">
                      <select
                        className="form-select"
                        aria-label="Default select Class"
                        onChange={handleGetSection}
                        name="class_id"
                      >
                        <option defaultValue>Class</option>
                        {classes.map((item, idx) => {
                          return (
                            <option key={idx} value={item._id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="col-sm">
                      <select
                        className="form-select"
                        aria-label="Select a section"
                        onChange={handleGetStudents}
                        name="section_id"
                      >
                        <option defaultValue>Section</option>
                        {sections.length &&
                          sections.map((item, idx) => {
                            return (
                              <option key={idx} value={item._id}>
                                {item.name}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    <div className="col-sm">
                      <select
                        className="form-select"
                        aria-label="Default select Student"
                        onChange={handleSelectStudent}
                        name="complainOn"
                      >
                        <option value={""} defaultChecked>
                          select student
                        </option>
                        {students.map((item, idx) => {
                          return (
                            <option key={idx} value={item.studentid._id}>
                              {item.studentid.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <h6 className="mb-0 fw-bold col">Send to :</h6>
                    <div className="col-sm">
                      <select
                        className="form-select"
                        aria-label="Default select Student"
                        onChange={handleSendTo}
                        name="complainTo"
                      >
                        <option defaultValue>Select</option>
                        {
                          <>
                            {type === "teacher" ? (
                              <option value={"parent"}>Parent</option>
                            ) : (
                              ""
                            )}
                            <option value={"teacher"}>Teacher</option>
                            <option value={"admin"}>Principal</option>
                          </>
                        }
                      </select>
                    </div>
                  </div>
                  {showTeacher ? (
                    <div className="ml-3 col">
                      <label
                        htmlFor="formFileMultipleone"
                        className="form-label"
                      >
                        Select Teacher to send your complain
                      </label>
                      <select
                        className="form-select"
                        aria-label="Default select Priority"
                        name="complainTo"
                        onChange={handleSelectTeacher}
                      >
                        <option defaultValue>Select Teacher</option>
                        {staff.map((item, idx) => {
                          return (
                            <option value={item._id} key={idx}>
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>

            <div className="col-sm-12">
              <label htmlFor="fileimg" className="form-label">
                Attach document (5Mb)
              </label>
              <input
                type="file"
                className="form-control"
                name="complainDoc"
                onChange={handleFileInputChange}
                ref={ref}
              />
              {error && (
                <div class="alert alert-danger mt-3" role="alert">
                  File size should be less than 5MB
                </div>
              )}
            </div>
            <div className="col-sm-12">
              <label htmlFor="depone" className="form-label">
                Complain Title
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
                Complain
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
                (complainD.staffType_id === "student" &&
                  complainD.complainOn === null &&
                  complainD.complainTo === null)
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
