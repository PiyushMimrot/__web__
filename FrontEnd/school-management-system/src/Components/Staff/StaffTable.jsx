import { useState, useEffect } from "react";
import axios from "axios";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Table from "../MainComponents/Table";
import { SERVER } from "../../config";
export default function StaffTable() {
  const [sub, setSub] = useState("");

  const [subjects, setSubjects] = useState([]);

  const [editName, setEditName] = useState("");

  let tableRowData = [
    "No",
    "First Name",
    "Last Name",
    "Email",
    "Staff Type",
    "Salary",
    "Date",
    "Last Date",
    "Status",
    "Actions",
  ];

  let selector = ["name"];

  const addSubject = async () => {
    const res = await axios.post(`${SERVER}/subject/createSubject`, {
      name: sub,
    });
    //(res);
    setSubjects([...subjects, res.data.data]);
  };

  const getSubjects = async () => {
    const res = await axios.get(`${SERVER}/subject/getSubject`);
    //(res)
    setSubjects(res.data.data);
    setSub("");
  };

  const handleSubjectDelete = async (id) => {
    const res = await axios.delete(`${SERVER}/subject/deleteSubject/${id}`);

    //(res);

    setSubjects(subjects.filter((item) => item._id !== id));
  };

  const handleSubjectUpdate = async (upid) => {
    setSubjects(
      subjects.map((item) =>
        item._id === upid ? { ...item, name: editName } : item
      )
    );
    setEditName("");
    //(res);
  };

  useEffect(() => {
    getSubjects();
  }, []);

  return (
    <>
      <div className="body d-flex py-lg-3 py-md-2">
        <div className="container-xxl">
          <div className="row align-items-center">
            <div className="border-0 mb-4">
              <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                <h3 className="fw-bold mb-0">Staff</h3>
                <div className="col-auto d-flex w-sm-100">
                  <button
                    type="button"
                    className="btn btn-dark btn-set-task w-sm-100"
                    data-bs-toggle="modal"
                    data-bs-target="#tickadd"
                  >
                    <AiOutlinePlusCircle className="d-inline-block mb-1 me-1" />{" "}
                    Add Staff
                  </button>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* Row end  */}
          <Table
            titleRowData={tableRowData}
            mainData={subjects}
            selector={selector}
          >
            {(subject, index) => (
              <>
                <div
                  className="modal fade"
                  id={`edittickit${subject._id}`}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5
                          className="modal-title fw-bold"
                          id="edittickitLabel"
                        >
                          Edit Subject {subject.name}
                        </h5>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        />
                      </div>
                      <div className="modal-body">
                        <div className="mb-3">
                          <label htmlFor="sub1" className="form-label">
                            Subject
                          </label>
                          <input
                            type="text"
                            value={editName}
                            className="form-control"
                            id="sub1"
                            onChange={(e) => setEditName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={() => handleSubjectUpdate(subject._id)}
                        >
                          Save changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </Table>
          {/* Row End */}
        </div>
      </div>

      {/* Add Tickit*/}

      <div className="modal fade" id="tickadd" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="leaveaddLabel">
                Add Subject
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="sub" className="form-label">
                  Subject
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="sub"
                  placeholder="Enter Subject name here"
                  value={sub}
                  onChange={(e) => setSub(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => addSubject()}
              >
                Add Subject
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
