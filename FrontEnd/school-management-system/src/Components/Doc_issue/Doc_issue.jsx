import { useEffect, useState, useRef } from "react";

import { AiOutlinePlusCircle } from "react-icons/ai";
import { SERVER } from "../../config";

import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../../utils/Adds/Logo.png";
import { InstilTable, TableState } from "../MainComponents/InstillTable";

import Swal from "sweetalert2";
export default function DocIssue() {
  const navigate = useNavigate();
  const [user_id, setUser_id] = useState("");
  const [userType, setUserType] = useState("");

  const [isDelete, setIsDelete] = useState(false);
  const [staffs, setStaffs] = useState([]);
  const [templates, setTemplates] = useState([]);
  // const [userName, setUserName] = useState("")
  const [school, setSchool] = useState("");
  const [createDocument, setCreateDocument] = useState("");

  const [subjectName, setSubjectName] = useState("");
  const [Item, setItem] = useState("");

  const [docs, setDocs] = useState([]);

  const [staffName, setStaffName] = useState("");

  const [documentName, setDocumentName] = useState("");

  const [template_id, setTemplate_id] = useState([]);

  const printRef = useRef(null);

  useEffect(() => {
    getStaffs();
  }, []);

  useEffect(() => {
    getDocs();
  }, []);

  useEffect(() => {
    getTemplate();
  }, []);

  const printInvoiceFunction = () => {
    window.print(printRef.current.innerHTML);
  };
  useEffect(() => {
    const fetchSession = async () => {
      const res = await axios.get(`${SERVER}/sessions/active`, {
        withCredentials: true,
      });

      const schoolInfoData = await fetch(
        `${SERVER}/school/getschool/${res.data.data.school_id}`,
        {
          credentials: "include",
        }
      );
      const schoolInfo = await schoolInfoData.json();

      setSchool(schoolInfo);
    };
    fetchSession();
  }, []);

  const getStaffs = async () => {
    try {
      const response = await fetch(`${SERVER}/staffmanage/staff`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      setStaffs(data);
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const handleSelectChange = (e) => {
    const { value } = e.target;

    if (value === "student") {
      const myModalEl = document.getElementById("addDoc");
      const modal = bootstrap.Modal.getInstance(myModalEl);
      modal.hide();

      navigate("/studentDocuments");
    } else {
      setUserType(e.target.value);
    }
    // setResult({ ...result, [name]: value })
  };

  const getDocs = async () => {
    try {
      const response = await fetch(`${SERVER}/templateDocs/getDocuments`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await response.json();

      setDocs(data.result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getTemplate = async () => {
    try {
      const response = await fetch(`${SERVER}/template`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const data = await response.json();
      setTemplates(data.templates);

      // const tempName = data.templates.find((item) => item._id === documentId).name;
      // setDocName(tempName)
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      staffName: staffName,
      isDelete: isDelete,
      userType: userType,
      template_id: template_id,
      user_id: user_id,
    };

    try {
      const response = await fetch(`${SERVER}/templateDocs/createDocument`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      // const newformData = data.map((item)=>

      // )
      setCreateDocument(formData);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleDocumentDelete = async (id) => {
    console.log("id-----------", id);
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const response = await fetch(`${SERVER}/templateDocs/${id}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (response.status === 200) {
            getDocs();
          }
        }
      });
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  return (
    <div>
      <div className="body d-flex py-lg-3 py-md-2">
        <div className="container-xxl custom-bg rounded-3">
          <div className="row align-items-center">
            <div className="border-0 mb-4">
              <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                <h3 className="fw-bold mb-0 text-primary">Document Center</h3>
              </div>
              <div className=" d-flex  justify-content-end">
                <div className="col-4 w-sm-100 d-flex justify-content-center align-items-center">
                  <button
                    type="button"
                    className="btn btn-dark btn-set-task p-2"
                    data-bs-toggle="modal"
                    data-bs-target="#addDoc"
                  >
                    <AiOutlinePlusCircle className="d-inline-block mb-1 me-1" />{" "}
                    Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InstilTable
        tableState={TableState}
        titles={["NAME", "TYPE", "DOCUMENT", "VIEW", "ACTION"]}
        rows={docs?.map((item, index) => {
          return {
            NAME: item.userData.name,
            TYPE: item.document.userType,
            DOCUMENT: item.document.template_id.name,
            VIEW: (
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#viewmodal"
                onClick={() => setItem(item)}
              >
                View
              </button>
            ),

            ACTION: (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => handleDocumentDelete(item.document._id)}
              >
                <AiFillDelete className="text-danger" />
              </button>
            ),
          };
        })}
      />

      {/* {         Add Document       } */}

      <div className="modal fade" id="addDoc" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="leaveaddLabel">
                {" "}
                Add Document
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div>
                  <div className="mb-3 row">
                    <div className="col">
                      <label htmlFor="for">For:</label>

                      <select
                        value={userType}
                        onChange={handleSelectChange}
                        className="form-control"
                        id="for"
                        name="for"
                        required
                      >
                        <option value="" disabled={true}>
                          Select{" "}
                        </option>
                        <option value="staff">Staff </option>
                        <option value="student">Student </option>
                      </select>
                    </div>
                  </div>

                  {userType === "staff" && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="staff">Staff Name:</label>

                        <select
                          value={staffName}
                          onChange={(e) => {
                            setStaffName(e.target.value);
                            setUser_id(e.target.value);
                          }}
                          className="form-control"
                          id="staff"
                          name="staff"
                          required
                        >
                          {staffs &&
                            staffs?.map((item, index) => (
                              <option key={index} value={item._id}>
                                {item.name}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <div className="col">
                          <label htmlFor="for">Document Name:</label>
                          <select
                            value={documentName}
                            onChange={(e) => {
                              setDocumentName(e.target.value);
                              setTemplate_id(e.target.value);
                            }}
                            className="form-control"
                            id="for"
                            name="for"
                            required
                          >
                            {templates &&
                              templates?.map((item, index) => (
                                <option key={index} value={item._id}>
                                  {item.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#showmodal"
                  disabled={
                    userType && documentName && staffName ? false : true
                  }
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* // show ddocument */}

      <div
        className="modal fade"
        id="showmodal"
        ref={printRef}
        tabIndex="-1"
        aria-labelledby="InvoiceModalPrintLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <div className="d-flex w-100 border-bottom border-5 border-info ">
                <div className="d-flex align-items-center w-100">
                  <div className="w-25 d-flex align-items-center justify-content-center">
                    <img
                      style={{ height: 150, width: 150 }}
                      src={
                        school?.logo
                          ? `${SERVER}/school_logo/${school?.logo}`
                          : Logo
                      }
                      onError={(e) => {
                        e.currentTarget.src = Logo;
                      }}
                      alt="logo"
                      className="avatar xl rounded-circle img-thumbnail shadow-sm"
                    />
                  </div>
                  <div className="w-75 d-flex flex-column align-items-center py-3">
                    <h1 className="text-primary fw-bold">{school?.name}</h1>
                    <h5 className="text-primary fw-bold">{school?.address}</h5>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
            </div>
            <div className="modal-body">
              <div className=" bg-dark" style={{ padding: "1px" }}></div>

              <div style={{ fontSize: "30px" }}>
                <div className="d-flex justify-content-center">
                  <p className="h1 fw-bold mt-3">
                    {" "}
                    {
                      templates?.find((item) => item?._id === documentName)
                        ?.name
                    }
                  </p>
                </div>

                <div className=" m-3">
                  <div>To,</div>
                  <div>
                    {staffs.find((item) => item._id === staffName)?.name}
                  </div>
                  {/* <div>{school.name}</div> */}
                  {/* <div>Delhi</div> */}
                </div>
                <div className=" m-3 d-flex">
                  <div className="fw-bold">Subject :</div>
                  <div className="fw-bold">
                    {
                      templates?.find((item) => item?._id === template_id)
                        ?.subject
                    }
                  </div>
                </div>
                <div className="m-3 d-flex">
                  {/* <div> :</div> */}
                  <div className="col">
                    {" "}
                    {staffs?.find((item) => item._id === staffName)?.name}
                    {templates
                      ?.find((item) => item?._id === template_id)
                      ?.desc.map((descItem) => {
                        if (descItem?.includes("STAFF")) {
                          return descItem.replace("STAFF", staffName?.name);
                        } else {
                          return descItem;
                        }
                      
                       } )
                    }
                  </div>
                </div>

                <div className="m-3 d-flex">
                  {/* <div>For : </div> */}
                  {/* <div>{editData.for}</div> */}
                </div>
              </div>
              <div className="col-lg-12 text-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg my-1"
                  onClick={printInvoiceFunction}
                >
                  <i className="fa fa-print"></i> Print
                </button>
                {/* <button type="button" className="btn btn-primary btn-lg my-1">
                  <i className="fa fa-paper-plane-o"></i> Send Invoice
                </button> */}
              </div>
              <div className=" bg-dark" style={{ padding: "1px" }}></div>

              <div className="m-2">
                <div className="h4 text-center">
                  {school.name},{school.address}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {          View Document              } */}

      <div
        className="modal fade"
        id="viewmodal"
        // ref={printRef}
        tabIndex="-1"
        aria-labelledby="InvoiceModalPrintLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <div className="d-flex w-100 border-bottom border-5 border-info ">
                <div className="d-flex align-items-center w-100">
                  <div className="w-25 d-flex align-items-center justify-content-center">
                    <img
                      style={{ height: 150, width: 150 }}
                      src={
                        school?.logo
                          ? `${SERVER}/school_logo/${school?.logo}`
                          : Logo
                      }
                      onError={(e) => {
                        e.currentTarget.src = Logo;
                      }}
                      alt="logo"
                      className="avatar xl rounded-circle img-thumbnail shadow-sm"
                    />
                  </div>
                  <div className="w-75 d-flex flex-column align-items-center py-3">
                    <h1 className="text-primary fw-bold">{school?.name}</h1>
                    <h5 className="text-primary fw-bold">{school?.address}</h5>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
            </div>
            <div className="modal-body">
              <div className=" bg-dark" style={{ padding: "1px" }}></div>

              <div style={{ fontSize: "30px" }}>
                <div className="d-flex justify-content-center">
                  {/* {templates?.map((item) =>
                                        <p className="h1 fw-bold mt-3" key={item._id}>{item.name}</p>)} */}
                  <p className="h1 fw-bold mt-3">
                    {Item?.document?.template_id?.name}
                  </p>
                </div>

                <div className=" m-3">
                  <div>To,</div>

                  <div>{Item?.userData?.name}</div>
                  <div>{school.name}</div>
                  <div>Delhi</div>
                </div>
                <div className=" m-3 d-flex">
                  <div className="fw-bold">Subject :</div>
                  <div className="fw-bold">
                    &emsp; {Item?.document?.template_id?.subject}
                  </div>
                </div>
                <div className="m-3 d-flex">
                  {/* <div> :</div> */}
                  <div className="col">{Item?.document?.template_id?.desc}</div>
                  {/* {console.log(Item?.find((item)=>item._id === template_id).name)} */}
                  {/* {Item?.find((item) => item._id === template_id)?.name}
                    {templates
                      ?.find((item) => item?._id === template_id)
                      ?.desc.map((descItem) => {
                        if (descItem?.includes("STAFF")) {
                          return descItem.replace("STAFF", staffName?.name);
                        } else {
                          return descItem;
                        }
                      
                       } )
                    } */}
                </div>

                <div className="m-3 d-flex">
                  {/* <div>For : </div> */}
                  {/* <div>{editData.for}</div> */}
                </div>
              </div>
              <div className=" bg-dark" style={{ padding: "1px" }}></div>

              <div className="m-2">
                <div className="h4 text-center">
                  {school.name},{school.address}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
