import { useEffect, useState } from "react";

import { AiOutlinePlusCircle } from "react-icons/ai";
import { SERVER } from "../../config";

import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";
import Swal from "sweetalert2";
import Logo from "../../utils/Adds/Logo.png";

import { MdRemoveCircle } from "react-icons/md";
export default function Template() {
  const [school, setSchool] = useState([]);
  const [templateData, setTemplateData] = useState([]);

  const [description, setDescription] = useState([]);

  const [descriptionBlk, setDescriptionBlk] = useState([0]); //map this array

  const [editData, setEditData] = useState({});

  let [result, setResult] = useState({
    name: "",
    subject: "",
    desc: [],
    for: "",
  });

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

  const handleChangeEdit = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResult({ ...result, [name]: value });
  };

  const handleaddDescription = (e, index) => {
    description[index] = e.target.value;
    setDescription([...description]);
  };

  const handleEditDescription = (e, index) => {
    editData.desc[index] = e.target.value;

    setEditData({ ...editData, desc: [...editData.desc] });
  };

  const handleTemplateDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTemplate(id);
      }
    });
  };

  const getTemplates = async () => {
    try {
      const response = await fetch(`${SERVER}/template`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const data = await response.json();

      setTemplateData(data.templates);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    getTemplates();
  }, []);

  const editTemplate = async (e, id) => {
    e.preventDefault();
    console.log("edit", editData);

    try {
      const response = await fetch(`${SERVER}/template/update/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(editData),
      });
      const data = await response.json();
      if (data) {
        getTemplates();
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const deleteTemplate = async (id) => {
    console.log("item deleted");

    try {
      const response = await fetch(`${SERVER}/template/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const data = await response.json();

      if (data) {
        getTemplates();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("data submitted", result);
    try {
      const response = await fetch(`${SERVER}/template/add`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify({ ...result, desc: description }),
      });
     
      const data = await response.json();
      if (data) {
        getTemplates();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // `${server}/template/add`
  return (
    <>
      <div className="body d-flex py-lg-3 py-md-2">
        <div className="container-xxl custom-bg rounded-3">
          <div className="row align-items-center">
            <div className="border-0 mb-4">
              <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                <h3 className="fw-bold mb-0 text-primary">Template</h3>
              </div>
              <div className=" d-flex  justify-content-end">
                <div className="col-4 w-sm-100 d-flex justify-content-center align-items-center">
                  <button
                    type="button"
                    className="btn btn-dark btn-set-task p-2"
                    data-bs-toggle="modal"
                    data-bs-target="#tickadd"
                  >
                    <AiOutlinePlusCircle className="d-inline-block mb-1 me-1" />{" "}
                    Add Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <table className="table mt-5 " style={{ background: "white" }}>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">View</th>
            <th scope="col">Action</th>
            {/* <th scope="col">Delete</th> */}
          </tr>
        </thead>
        <tbody>
          {templateData.map((item, index) => (
            <>
              <tr>
                <td key={index}>{item.name}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#viewmodal"
                    onClick={() => setEditData(item)}
                  >
                    View
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    data-bs-toggle="modal"
                    data-bs-target="#edittickit"
                    onClick={() => setEditData(item)}
                  >
                    <AiFillEdit />
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => handleTemplateDelete(item._id)}
                  >
                    <AiFillDelete className="text-danger" />
                  </button>
                </td>
              </tr>
            </>
          ))}
        </tbody>
      </table>

      {/* Add Template */}
      <div className="modal fade" id="tickadd" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="leaveaddLabel">
                {" "}
                Add Template
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
                  <div className="mb-3">
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      onChange={handleChange}
                      value={result.name}
                      className="form-control"
                      id="name"
                      name="name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="subject">Subject:</label>
                    <input
                      type="text"
                      onChange={handleChange}
                      value={result.subject}
                      className="form-control"
                      id="subject"
                      name="subject"
                    />
                  </div>

                  <div className="">
                    {Array.isArray(descriptionBlk) &&
                      descriptionBlk.map((item, index) => {
                        return (
                          <div key={index} className="mb-3">
                            <label htmlFor={"index"}>
                              Description {index + 1}:
                            </label>

                            {description.length > 1 && (
                              <div
                                className="btn  col-2"
                                onClick={() => {
                                  description.splice(index, 1),
                                    descriptionBlk.splice(index, 1);

                                  setDescription([...description]);
                                  setDescriptionBlk([...descriptionBlk]);
                                }}
                              >
                                <MdRemoveCircle className="fs-5 text-danger shadow" />
                              </div>
                            )}

                            <textarea
                              onChange={(e) => handleaddDescription(e, index)}
                              value={description[index]}
                              className="form-control"
                              id={`desc${index}`}
                              name={`desc${index}`}
                              rows={3}
                              placeholder="new description"
                              style={{ resize: "none" }}
                            ></textarea>
                          </div>
                        );
                      })}
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={() => setDescriptionBlk([...descriptionBlk, 0])}
                    >
                      Add Extra Description
                    </button>
                  </div>
                  <div className="mb-3 row">
                    <div className="col">
                      <label htmlFor="for">For:</label>

                      <select
                        value={result.for}
                        onChange={handleChange}
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
                  <div>
                    Please mention STUDENT in capital for studentName and STAFF for staffName
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                  disabled={
                    result.name && result.subject && result.desc && result.for
                      ? false
                      : true
                  }
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* { Edit Template} */}

      <div
        className="modal fade"
        id="edittickit"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="leaveaddLabel">
                {" "}
                Edit Template
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => editTemplate(e, editData?._id)}>
                <div>
                  <div className="mb-3">
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      onChange={handleChangeEdit}
                      value={editData.name}
                      className="form-control"
                      id="name"
                      name="name"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="subject">Subject:</label>
                    <input
                      type="text"
                      onChange={handleChangeEdit}
                      value={editData.subject}
                      className="form-control"
                      id="subject"
                      name="subject"
                    />
                  </div>

                  <div className="">
                    {Array.isArray(editData.desc) &&
                      editData.desc.map((item, index) => {
                        return (
                          <div key={index} className="mb-3">
                            <label htmlFor={"index"}>
                              Description {index + 1}:
                            </label>
                            {editData.desc.length > 1 && (
                              <div
                                className="btn  col-2"
                                onClick={() => {
                                  editData.desc.splice(index, 1),
                                    setEditData({
                                      ...editData,
                                      desc: editData.desc,
                                    });
                                }}
                              >
                                <MdRemoveCircle className="fs-5 text-danger shadow" />
                              </div>
                            )}

                            <textarea
                              onChange={(e) => handleEditDescription(e, index)}
                              value={editData.desc[index]}
                              className="form-control"
                              id={`desc${index}`}
                              name={`desc${index}`}
                              rows={3}
                              placeholder="new description"
                              style={{ resize: "none" }}
                            ></textarea>
                          </div>
                        );
                      })}
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={() =>
                        setEditData({
                          ...editData,
                          desc: [...editData.desc, ""],
                        })
                      }
                    >
                      Add Extra Description
                    </button>
                  </div>
                  <div className="mb-3 row">
                    <div className="col">
                      <label htmlFor="for">For:</label>

                      <select
                        value={editData.for}
                        onChange={handleChangeEdit}
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
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* { View Modal } */}

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
                  <p className="h1 fw-bold mt-3">{editData.name}</p>
                </div>

                {/* <div className=' m-3 w-100'  >
                                <div>From</div>
                                <div>STUDENT</div>

                                <div>Date :01/02/24</div>
                            </div> */}
                <div className=" m-3">
                  <div>To,</div>
                  <div>TheStudent/Staff</div>
                  <div>Address</div>
                  <div>Delhi</div>
                </div>
                <div className=" m-3 d-flex">
                  <div className="fw-bold">Subject :</div>
                  <div className="fw-bold">&emsp; {editData.subject}</div>
                </div>
                <div className="m-3">
                  {/* <div> :</div> */}
                  <p className="">{editData.desc}</p>
                </div>

                <div className="m-3 d-flex">
                  {/* <div>For : </div> */}
                  <div>{editData.for}</div>
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

      {/* <div className="modal fade" id="viewmodal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-xl modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">View Template</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                           

                           

                        </div>

                    </div>
                </div>
            </div> */}
    </>
  );
}
