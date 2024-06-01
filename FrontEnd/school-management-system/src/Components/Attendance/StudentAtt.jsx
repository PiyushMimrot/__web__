import { useEffect, useState } from "react";
import { SERVER } from "../../config";
import { Calendar, Badge } from "antd";

export default function StudentAttendence() {
  const [report, setReport] = useState([]);
  const [event, setEvent] = useState([]);
  const [showAttendance, setShowAttendance] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      const getType = await fetch(`${SERVER}/profile/type`, {
        credentials: "include",
      });
      if (!getType.ok) {
        throw new Error(`HTTP error! Status: ${getType.status}`);
      }
      const { currentId, type } = await getType.json();

      const data = await fetch(
        SERVER + `/attendance/getStudentAtt/${currentId}`,
        {
          credentials: "include",
        }
      );
      if (!data.ok) {
        throw new Error(`HTTP error! Status: ${data.status}`);
      }
      const myAtt = await data.json();
      setReport(myAtt.data);

      const eventData = await fetch(`${SERVER}/calender/getevent`, {
        credentials: "include",
      });
      if (!eventData.ok) {
        throw new Error(`HTTP error! Status: ${eventData.status}`);
      }
      const dateEvent = await eventData.json();
      setEvent(dateEvent);
    };

    fetchInfo();
  }, []);

  const handleToggle = () => {
    setShowAttendance(!showAttendance);
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
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const eventCellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  const attendanceCellRender = (value) => {
    const dateString = value.format("YYYY-MM-DD");
    const attendanceInfo = report.find((item) => {
      const itemDate = new Date(item.date).toISOString().split("T")[0];
      return itemDate === dateString;
    });

    if (attendanceInfo) {
      return (
        <div
          style={{
            display: "flex",
            gap: "4px",
            justifyContent: "flex-start",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              borderRadius: "50%",
              width: "16px",
              height: "16px",
              backgroundColor: attendanceInfo.present ? "#557C55" : "#D71313",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              bottom: "10px",
              left: "0",
            }}
          >
            <span style={{ fontSize: "11px" }}>
              {attendanceInfo.present ? "P" : "A"}
            </span>
          </div>

          <div
            style={{
              color: !attendanceInfo.presnt && "red",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              bottom: "8px",
              left: "20px",
            }}
          >
            <span style={{ fontSize: "12px" }}>
              {!attendanceInfo.present && " Absent"}
            </span>
          </div>
        </div>
      );
    }

    return null;
  };

  const onPanelChange = (value, mode) => {
    console.log(value.format("YYYY-MM-DD"), mode);
  };

  return (
    <div>
      <h2> Attendance Report </h2>
      <div
        className="form-check form-switch  fs-5"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBlock: "10px",
        }}
      >
        <input
          className="form-check-input"
          type="checkbox"
          id="toggleAttendance"
          checked={showAttendance}
          onChange={handleToggle}
        />
        <label className="form-check-label" htmlFor="toggleAttendance">
          {showAttendance ? "Attendance" : "Events"}
        </label>
      </div>
      <Calendar
        onPanelChange={onPanelChange}
        cellRender={showAttendance ? attendanceCellRender : eventCellRender}
      />
    </div>
  );
}
