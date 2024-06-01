import { Badge, Calendar } from "antd";
import "./styles.css";
import { useEffect, useState } from "react";
import { SERVER } from "../../config";
import { MdDeleteOutline } from "react-icons/md";
import { InstilTable, TableState } from "../MainComponents/InstillTable";
import { AiOutlineEye, AiFillEdit, AiFillDelete } from "react-icons/ai";
import axios from "axios";
import Swal2 from "sweetalert2";
const Calender = () => {
  const [event, setEvent] = useState([]);
  const [input, setInput] = useState({});
  const [eventSelectedDate, setEventSelectedDate] = useState("");
  const [eventSelectedName, setEventSelectedName] = useState("");
  const [eventSelectedId, setEventSelectedId] = useState("");
  const type = localStorage.getItem("type");
  const [reReq, setReReq] = useState(false);
  useEffect(() => {
    const fetchInfo = async () => {
      const data = await fetch(`${SERVER}/calender/getevent`, {
        credentials: "include",
      });
      if (!data.ok) {
        throw new Error(`HTTP error! Status: ${data.status}`);
      }
      const dateEvent = await data.json();
      setEvent(dateEvent);
    };
    fetchInfo();
  }, [reReq]);

  const handleSelect = (event) => {
    setInput({ ...input, [event.target.name]: event.target.value });
  };

  // const handleDateClick = (value) => {
  //   const date = `${value.$y}-${value.$M}-${value.$D}`;
  // };

  const handleSubmit = async () => {
    const data = await fetch(`${SERVER}/calender/addevent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
      credentials: "include",
    });
    if (!data.ok) {
      throw new Error(`HTTP error! Status: ${data.status}`);
    }
    const dateEvent = await data.json();
    setEvent([...event, dateEvent]);
    setInput({ date: "" });
  };

  const handleCheck = async () => {
    const data = await fetch(`${SERVER}/calender/geteventbydate`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date: eventSelectedDate }),
    });
    if (!data.ok) {
      throw new Error(`HTTP error! Status: ${data.status}`);
    }
    const getEvent = await data.json();
    console.log(getEvent);
  };

  const getListData = (value) => {
    const formattedDate = value.format("YYYY-MM-DD");
    const filteredEvents = event.filter(
      (event) => event.date === formattedDate
    );
    return filteredEvents.map((event) => ({
      type: event.type || "success",
      content: event.title,
    }));
  };

  const getMonthData = (value) => {};

  const monthCellRender = (value) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        {/* <span>Backlog number</span> */}
      </div>
    ) : null;
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData?.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };
  const handleEventEdit = async () => {
    await axios
      .put(
        `${SERVER}/calender/editevent/` + eventSelectedId,
        { title: eventSelectedName, date: eventSelectedDate },
        { withCredentials: true }
      )
      .then((res) => {
        if (res.data.success) {
          Swal2.fire(
            "Success!",
            "Your event has been successfully updated!",
            "success"
          );
          setReReq(!reReq);
        } else {
          Swal2.fire(
            "Error!",
            "There was an error updating your event. Please try again later.",
            "error"
          );
        }
      });
  };

  const handleEventDelete = (id) => {
    Swal2.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .get(`${SERVER}/calender/deleteevent/` + id, {
            withCredentials: true,
          })
          .then((res) => {
            if (res.data.success) {
              Swal2.fire(
                "Success!",
                "Your event has been successfully deleted!",
                "success"
              );
              setReReq(!reReq);
            } else {
              Swal2.fire(
                "Error!",
                "There was an error deleting your event. Please try again later.",
                "error"
              );
            }
          });
        // Perform the action on confirmation
        // Swal.fire(
        //   'Deleted!',
        //   'Your file has been deleted.',
        //   'success'
        // );
      }
    });
  };
  return (
    <>
      <ul class="nav nav-tabs justify-content-center mb-4" role="tablist">
        <li class="nav-item" role="presentation">
          <a
            class="nav-link active"
            data-bs-toggle="tab"
            href="#justified-tabpanel-0"
            role="tab"
          >
            {" "}
            Calendar View
          </a>
        </li>
        <li class="nav-item" role="presentation">
          <a
            class="nav-link"
            data-bs-toggle="tab"
            href="#justified-tabpanel-1"
            role="tab"
          >
            {" "}
            List View
          </a>
        </li>
      </ul>
      {/* Calender */}
      <div class="tab-content" id="tab-content">
        <div
          class="tab-pane active"
          id="justified-tabpanel-0"
          role="tabpanel"
          aria-labelledby="justified-tab-0"
        >
          <div className="d-flex justify-content-end">
            {type === "admin" ? (
              <div
                className="col-auto d-flex mb-2"
                style={{ display: "flex", gap: "50px" }}
              >
                <button
                  type="button"
                  className="btn btn-dark "
                  data-bs-toggle="modal"
                  data-bs-target="#addevent"
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Event
                </button>
              </div>
            ) : (
              <h2
                className="fw-bold mb-0 text-primary"
                style={{ paddingBottom: "20px" }}
              >
                School Calender
              </h2>
            )}
          </div>
          <Calendar cellRender={cellRender} />
        </div>
        <div
          class="tab-pane"
          id="justified-tabpanel-1"
          role="tabpanel"
          aria-labelledby="justified-tab-1"
        >
          <div className="d-flex justify-content-end">
            {type === "admin" && (
              <div
                className="col-auto d-flex"
                style={{ display: "flex", gap: "50px" }}
              >
                <button
                  type="button"
                  className="btn btn-dark "
                  data-bs-toggle="modal"
                  data-bs-target="#addevent"
                >
                  <i className="icofont-plus-circle me-2 fs-6"></i>Add Event
                </button>
              </div>
            )}
          </div>
          <InstilTable
            tableState={TableState}
            titles={[
              "No.",
              "Event Name",
              "Date",
              type === "admin" && "Actions",
            ]}
            rows={event?.map((item, idx) => ({
              "No.": idx + 1,
              "Event Name": item?.title,
              Date: item?.date,
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
                    data-bs-target="#editeventlist"
                    onClick={() => {
                      setEventSelectedId(item._id);
                      setEventSelectedDate(item.date);
                      setEventSelectedName(item.title);
                    }}
                  >
                    <AiFillEdit />
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary deleterow"
                    onClick={() => {
                      // setEventSelectedId(item._id);
                      handleEventDelete(item._id);
                    }}
                  >
                    <AiFillDelete className="text-danger" />
                  </button>
                </div>
              ),
            }))}
          />
        </div>
      </div>
      {/* Add event */}
      <div
        className="modal fade"
        id="addevent"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="eventaddLabel">
                Add Event
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
                <form>
                  <div className="row g-3 mb-3">
                    <div className="col">
                      <label htmlFor="datepickerded" className="form-label">
                        Select Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="datepickerded"
                        name="date"
                        value={input.date || ""}
                        onChange={handleSelect}
                      />
                    </div>
                  </div>
                </form>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput99"
                  className="form-label"
                >
                  Event Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput99"
                  name="title"
                  value={input.title || ""}
                  onChange={handleSelect}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                disabled={!input?.title?.trim() || !input?.date?.trim()}
                onClick={handleSubmit}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Edit Event (Calender) */}
      <div
        className="modal fade"
        id="editevent"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="eventaddLabel">
                Edit Event
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
                <form>
                  <div className="row g-3 mb-3">
                    <div className="col">
                      <label htmlFor="datepickerded" className="form-label">
                        Select Date
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="datepickerded"
                        name="date"
                        onChange={(e) => setEventSelectedDate(e.target.value)}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                disabled={!eventSelectedDate}
                onClick={handleCheck}
              >
                CheckEvent
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* edit event (List) */}
      <div
        className="modal fade"
        id="editeventlist"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="eventaddLabel">
                Edit Event
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
                  <div className="col">
                    <label htmlFor="datepickerded" className="form-label">
                      Edit Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={eventSelectedDate}
                      onChange={(e) => setEventSelectedDate(e.target.value)}
                      id="datepickerded"
                      name="date"
                    />
                  </div>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col">
                    <label htmlFor="event" className="form-label">
                      Edit Event
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={eventSelectedName}
                      onChange={(e) => setEventSelectedName(e.target.value)}
                      id="event"
                      name="event"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleEventEdit}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Calender;
