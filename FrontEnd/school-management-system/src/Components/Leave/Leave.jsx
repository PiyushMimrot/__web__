import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { SERVER } from "../../config";

export default function Leave() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [credentials, setCredentials] = useState({
    subject: "",
    description: "",
    leaveDate: "",
  });

  const EventDate = events.map((event) => event.date);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${SERVER}/leave/add`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
  };

  const weekDay = (date) => {
    const day = new Date(date).getDay();
    return day !== 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name !== "leaveDate") {
      setCredentials({ ...credentials, [name]: value });
      return;
    }

    if (EventDate.includes(value)) {
      alert("You cannot get leave on Events");
      //   Swal.fire({
      //     title: "Try Again!",
      //     text: "You cannot get leave on events!",
      //     icon: "warning",
      //     timer: 3000,
      //   });
      setSelectedDate("");
      setCredentials({ ...credentials, leaveDate: "" });
      return;
    }

    if (!weekDay(value)) {
      alert("You cannot get leave on Sundays");
      setSelectedDate("");
      setCredentials({ ...credentials, leaveDate: "" });
      return;
    }
    setSelectedDate(value);
    setCredentials({ ...credentials, leaveDate: value });
  };

  const getHandleEvents = async () => {
    await axios
      .get(`${SERVER}/calender/getevent`, { withCredentials: true })
      .then((res) => {
        setEvents(res.data);
        console.log(res.data);
      });
  };

  useEffect(() => {
    getHandleEvents();
  }, []);

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        LeaveDetails
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Leave Details
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3 ">
                  <label htmlFor="subject" className="form-label fw-bold">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="form-control border-dark"
                    value={credentials.subject}
                    onChange={handleChange}
                    name="subject"
                    id="subject"
                    placeholder="Enter subject"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label fw-bold">
                    Description
                  </label>
                  <textarea
                    className="form-control border-dark"
                    id="description"
                    value={credentials.description}
                    onChange={handleChange}
                    name="description"
                    rows="3"
                    placeholder="Enter description"
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="leaveDate" className="form-label fw-bold">
                    Leave Date
                  </label>

                  <input
                    type="date"
                    className="form-control border-dark"
                    value={selectedDate}
                    onChange={handleChange}
                    name="leaveDate"
                    id="leaveDate"
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
