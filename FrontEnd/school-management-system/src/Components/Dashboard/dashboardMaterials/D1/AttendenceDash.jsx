import { useNavigate } from "react-router-dom";

export default function AttendanceDash({ attendance }) {
  const nav = useNavigate();

  return (
    <div
      className="col-md-3 d-flex align-items-center flex-fill"
      style={{ cursor: "pointer" }}
      onClick={() => nav("/attendance")}
    >
      <div
        className="col-md-3 d-flex align-items-center flex-fill"
        style={{
          backgroundColor: "rgb(72,76,127)",
          padding: "8px",
          borderRadius: "5px",
          color: "white",
        }}
      >
        <div className="d-flex flex-column ps-3  flex-fill">
          <h6 className="fw-bold mb-0 fs-4">Student</h6>
          <span style={{ marginTop: "10px" }} className="text">
            {attendance?.present || 0} - Present
          </span>
          <span className="text">{attendance?.absent || 0} - Absent</span>
          <i
            style={{ marginTop: "10px" }}
            className="icofont-group-students fs-3 text-muted"
          ></i>
        </div>
      </div>
    </div>
  );
}
