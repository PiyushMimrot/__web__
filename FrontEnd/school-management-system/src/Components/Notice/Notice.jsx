import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { SERVER } from "../../config.ts";
import { InstilTable, TableState } from "../MainComponents/InstillTable";
import { AiFillEdit, AiFillDelete, AiOutlineEye } from "react-icons/ai";
import Swal from "sweetalert2";
function Notice() {
  const [notices, setNotices] = useState([]);
  const [showDateInput, setShowDateInput] = useState(false);
  const [file, setFile] = useState();
  const fileInputRef = useRef(null);
  const [noticeInputs, setNoticeInputs] = useState({
    title: "",
    desc: "",
    type: "general",
    date: "",
  });
  const [currentNotice, setCurrentNotice] = useState();
  const currentType = localStorage.getItem("type");
  useEffect(() => {
    fetchNotices();
  }, []);
  const fetchNotices = async () => {
    await axios
      .get(`${SERVER}/notice/`, { withCredentials: true })
      .then((res) => setNotices(res.data.Notices));
  };
  const noticeInputChange = (e) => {
    setNoticeInputs({ ...noticeInputs, [e.target.name]: e.target.value });
    if (!Object.values(noticeInputs).some((item) => item === "")) {
    }
  };
  const handleAddNotice = async () => {
    try {
      const noticeData = new FormData();

      for (const key in noticeInputs) {
        noticeData.append(key, noticeInputs[key]);
      }
      noticeData.append("material", file);

      let response = await fetch(`${SERVER}/notice/addnotice`, {
        method: "POST",
        body: noticeData,
        credentials: "include",
      });
      response = await response.json();
      if (response) {
        setFile(null);
        setNoticeInputs({
          title: "",
          desc: "",
          type: "general",
          date: "",
        });
        setShowDateInput(false);
        fileInputRef.current.value = null;
        fetchNotices();
        Swal2.fire({
          title: "Notice Added",
          // text: "successfully ",
          icon: "success",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteNotice = async (noticeId) => {
    Swal.fire({
      title: `Are you sure you want to delete?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .delete(`${SERVER}/notice/delete/${noticeId}`, {
            withCredentials: true,
          })
          .then((res) => {
            if (res.data.success) {
              Swal.fire({
                title: "Success",
                text: "Successfully Deleted item",
                icon: "success",
                timer: 3000,
              });
              fetchNotices();
            }
          })
          .catch((err) => {
            Swal.fire({
              title: "Try Again!",
              icon: "warning",
              timer: 3000,
            });
          });
      }
    });
  };
  const handleNoticeEdit = async () => {
    await axios
      .put(`${SERVER}/notice/update/${currentNotice?._id}`, currentNotice, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          Swal.fire({
            title: "Success",
            text: "Successfully Edited",
            icon: "success",
            timer: 3000,
          });
          fetchNotices();
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "Try Again!",
          icon: "warning",
          timer: 3000,
        });
      });
  };
  return (
    <div className="">
      <div className="d-flex gap-3 pt-3 card px-3 justify-content-center">
        <div className="d-flex justify-content-between p-2">
          <h2 className="fw-bold text-primary">Notice</h2>
          {currentType === "admin" && (
            <button
              type="button"
              className="btn btn-dark "
              data-bs-toggle="modal"
              data-bs-target="#addNoticeModal"
            >
              <i className="icofont-plus-circle me-2 fs-6"></i>Add Notice
            </button>
          )}
        </div>
      </div>
      <InstilTable
        tableState={TableState}
        titles={[
          "No.",
          "Title",
          "Type",
          "View",
          currentType === "admin" && "Actions",
        ]}
        rows={notices?.map((item, idx) => ({
          "No.": idx + 1,
          Title: item?.title,
          Type: item?.type,
          View: (
            <button
              type="button"
              className="btn btn-dark btn-set-task w-sm-100"
              data-bs-toggle="modal"
              data-bs-target="#viewModal"
              onClick={() => setCurrentNotice(item)}
            >
              <AiOutlineEye />
            </button>
          ),
          Actions: (
            <div
              className="btn-group"
              role="group"
              aria-label="Basic outlined example"
            >
              <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-toggle="modal"
                data-bs-target="#editnotice"
                onClick={() => setCurrentNotice(item)}
              >
                <AiFillEdit />
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary deleterow"
                onClick={() => {
                  handleDeleteNotice(item?._id);
                }}
              >
                <AiFillDelete className="text-danger" />
              </button>
            </div>
          ),
        }))}
      />
      {/* Add Notice */}
      <div
        class="modal fade"
        id="addNoticeModal"
        tabindex="-1"
        aria-labelledby="addNoticeModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addNoticeModalLabel">
                Add Notice
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <div className="d-flex flex-column gap-3">
                  <label htmlFor="name">Title</label>
                  <input
                    type="text"
                    name="title"
                    className=" form-control"
                    value={noticeInputs.title}
                    onChange={noticeInputChange}
                  />
                  <label htmlFor="desc">Description</label>
                  <textarea
                    value={noticeInputs.desc}
                    onChange={noticeInputChange}
                    class="form-control"
                    id="desc"
                    name="desc"
                    rows="3"
                    placeholder="Enter notice description"
                  ></textarea>

                  <div className="d-flex gap-3">
                    <div className="w-75">
                      <label htmlFor="material">Add Material</label>
                      <input
                        className="form-control"
                        type="file"
                        id="material"
                        accept=".pdf"
                        ref={fileInputRef}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file || file.type !== "application/pdf") {
                            alert("Please select a PDF file");
                            return;
                          } else {
                            setFile(e.target.files[0]);
                          }
                        }}
                      />
                    </div>
                    <div className="w-25">
                      <label htmlFor="type">Type</label>
                      <select
                        class="form-control"
                        id="noticeType"
                        name="type"
                        value={noticeInputs.type}
                        onChange={noticeInputChange}
                      >
                        <option value="general">General</option>
                        <option value="event">Event</option>
                        <option value="holiday">Holiday</option>
                        <option value="exam">Exam</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="w-50 form-check form-check">
                      <input
                        type="checkbox"
                        className="form-check-input text-lg"
                        name="event"
                        checked={showDateInput}
                        onChange={() => setShowDateInput(!showDateInput)}
                      />
                      <label
                        class="form-check-label"
                        style={{ fontSize: 15 }}
                        for="event"
                      >
                        Add to Event
                      </label>{" "}
                    </div>
                    {showDateInput && (
                      <div className="w-50">
                        <label htmlFor="eventDate">Event Date:</label>
                        <input
                          type="date"
                          id="eventDate"
                          name="date"
                          className="form-control"
                          onChange={noticeInputChange}
                          value={noticeInputs.date}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={handleAddNotice}
                disabled={
                  noticeInputs.title.trim() === "" ||
                  noticeInputs.desc.trim() === "" ||
                  (showDateInput && noticeInputs.date === "")
                }
                type="button"
                class="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Submit Notice
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* View Notice */}
      <div
        class="modal fade"
        id="viewModal"
        tabindex="-1"
        aria-labelledby="viewModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="viewModalLabel">
                {currentNotice?.title}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div>
                <e>Type:</e>
                <p>{currentNotice?.type}</p>
              </div>
              <div>
                <e>Desc:</e>
                <p>{currentNotice?.desc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* edit event (List) */}
      <div
        className="modal fade"
        id="editnotice"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="eventaddLabel">
                Edit Notice
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="deadline-form">
                <div className="row g-3 mb-3">
                  <label htmlFor="name">Title</label>
                  <input
                    type="text"
                    name="title"
                    className=" form-control"
                    value={currentNotice?.title}
                    onChange={(e) =>
                      setCurrentNotice({
                        ...currentNotice,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="row g-3 mb-3">
                  <label htmlFor="desc">Description</label>
                  <textarea
                    value={currentNotice?.desc}
                    onChange={(e) =>
                      setCurrentNotice({
                        ...currentNotice,
                        desc: e.target.value,
                      })
                    }
                    class="form-control"
                    id="desc"
                    name="desc"
                    rows="3"
                    placeholder="Enter notice description"
                  ></textarea>
                </div>
                <div className="w-25">
                  <label htmlFor="type">Type</label>
                  <select
                    class="form-control"
                    id="noticeType"
                    name="type"
                    value={currentNotice?.type}
                    onChange={(e) =>
                      setCurrentNotice({
                        ...currentNotice,
                        type: e.target.value,
                      })
                    }
                  >
                    <option value="general">General</option>
                    <option value="event">Event</option>
                    <option value="holiday">Holiday</option>
                    <option value="exam">Exam</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleNoticeEdit}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Notice;
