import { useState, useEffect } from "react";
import { SERVER } from "../../config";
import { useNavigate, useParams } from "react-router-dom";
import { getTypeToken } from "../../Context/localStorage";
import moment from "moment";
import Swal from "sweetalert2";
import { FaFileDownload } from "react-icons/fa";

export default function ViewComplain({}) {
  const params = useParams();
  const [complain, setComplain] = useState({});
  const [comOn, setComOn] = useState({});
  const [comTo, setComTo] = useState({});
  const [comFrom, setComFrom] = useState(null);
  const [shouldSubmit, setshouldSubmit] = useState(false);
  const [myid, setmyid] = useState(null);
  const [ResolvedData, setResolvedData] = useState({
    complainStatus: false,
    dateResolved: "",
  });
  const nav = useNavigate();
  const type = getTypeToken();

  useEffect(() => {
    getComplain();
  }, []);
  // console.log(params);
  const getComplain = async () => {
    try {
      await fetch(SERVER + `/complain/get1Complain/${params.view}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          let { complaint, comOn, comTo, comFrom, myid } = data;
          setComplain(complaint);
          setComOn(comOn);
          setComTo(comTo);
          setmyid(myid);
          if (comFrom) {
            setComFrom(comFrom);
          }
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleIsResolved = async (e, isResolved) => {
    if (isResolved) {
      return;
    }
    setshouldSubmit(e.target.checked);
    let tempX = {
      complainStatus: e.target.checked,
      dateResolved: new Date(),
    };
    setResolvedData(tempX);
  };
  // getComplainFor()
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(SERVER + `/complain/updateComplain/${complain._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ResolvedData),
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            getComplain();
            Swal.fire({
              title: complain.queryStatus ? "Query" : "Complain",
              text: "Successfully Updated",
              icon: "success",
              timer: 3000,
            });
          }
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };
  console.log(ResolvedData);
  if (Object.keys(complain).length) {
    return (
      <div className="card shadow">
        <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
          <h4 className="mb-0 fw-bold ">
            {complain.queryStatus ? "Query" : "Complain"}
          </h4>
        </div>
        <div className="card-body card-hover-show">
          <form onSubmit={handleSubmit} name="complainForm">
            <div className="row g-3 mb-3">
              <div className="g-3 row ">
                {!complain.queryStatus && (
                  <div className="col d-flex gap-3">
                    <h6 className="mb-0 fw-bold">On:</h6>

                    {!comOn?.name ? (
                      <div>
                        <p className="badge bg-danger fs-6">
                          {comOn.studentid.name}
                        </p>
                        <p className="fs-6">
                          {" "}
                          Class : {comOn?.Class_id?.name}/
                          {comOn?.section_id?.name}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="badge bg-danger fs-6">{comOn?.name}</p>
                      </div>
                    )}
                  </div>
                )}
                <div className="col d-flex gap-3 ">
                  <h6 className="mb-0 fw-bold">To:</h6>
                  <div>
                    {comTo?.name && (
                      <p className="badge bg-success fs-6">{comTo?.name}</p>
                    )}
                    {comTo?.fathername && (
                      <>
                        <p className="badge bg-success fs-6">
                          {comTo?.fathername}
                        </p>
                        <p>Parent</p>
                      </>
                    )}
                  </div>
                </div>
                <div className="col d-flex gap-3 ">
                  <h6 className="mb-0 fw-bold">From:</h6>
                  <div>
                    {!complain.isAnonymous ? (
                      <>
                        {comFrom?.studentid && (
                          <>
                            {" "}
                            <p className="badge bg-warning fs-6">
                              {comFrom.studentid.name}
                            </p>
                            <p className="fs-6">
                              {" "}
                              Class {comFrom?.Class_id?.name}/
                              {comFrom?.section_id?.name}
                            </p>
                          </>
                        )}
                        {comFrom?.name && (
                          <p className="badge bg-warning fs-6">
                            {comFrom?.name}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="fw-bold badge bg-secondary fs-6">
                        Anonymous
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <hr />

              <div className="">
                <div className="table-responsive">
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th scope="col" colSpan={2}>
                          <center>Details</center>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td scope="col">Registered On : </td>
                        <td>
                          {moment(complain.dateCreated).format("D MMM YYYY")}
                        </td>
                      </tr>

                      <tr>
                        <td className="col">Resolved On : </td>
                        <td>
                          {complain.dateResolved
                            ? moment(complain.dateResolved).format("D MMM YYYY")
                            : "Pending"}{" "}
                        </td>
                      </tr>

                      <tr>
                        <td className="col">Title : </td>
                        <td>{complain.complainTitle}</td>
                      </tr>
                      <tr>
                        <td className="col">Description : </td>
                        <td>{complain.complainDesc}</td>
                      </tr>

                      <tr>
                        <td className="col">Document : </td>
                        <td>
                          {complain?.complainDoc ? (
                            <a
                              href={`${SERVER}/complaints/${complain.complainDoc}`}
                              target="_blank"
                              className="btn btn-secondary"
                              style={{ fontSize: "large" }}
                            >
                              <FaFileDownload />
                            </a>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {type !== "student" ? (
                <div className="form-check form-switch theme-switch">
                  <label className="form-label">
                    <strong>Is Resolved</strong>
                  </label>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="theme-switch"
                    name="isAnonymous"
                    checked={complain.complainStatus ? true : null}
                    readOnly={complain.complainStatus ? true : false}
                    onChange={(e) =>
                      handleIsResolved(e, complain.complainStatus)
                    }
                  />
                </div>
              ) : (
                ""
              )}
            </div>

            <div className="card-footer d-flex gap-2 ">
              {type !== "student" &&
                type !== "parent" &&
                myid !== complain?.complainFor[0]?.forId &&
                !complain.dateResolved && (
                  <button
                    type="submit"
                    className="btn btn-primary lift"
                    disabled={shouldSubmit ? false : true}
                  >
                    Submit
                  </button>
                )}

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  let to = complain.queryStatus ? "/queries" : "/complaints";
                  nav(to);
                }}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
