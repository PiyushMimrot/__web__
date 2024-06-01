import { useNavigate } from "react-router-dom";

export default function QueryDash({ query }) {
  const nav = useNavigate();

  return (
    <div
      className="col-md-3 d-flex align-items-center flex-fill"
      style={{ cursor: "pointer" }}
      onClick={() => nav("/queries")}
    >
      <div
        className="col-md-3 d-flex align-items-center flex-fill"
        style={{
          backgroundColor: "rgb(72,76,127)",
          padding: "10px",
          borderRadius: "5px",
          color: "white",
        }}
      >
        <div className="d-flex flex-column ps-3  flex-fill">
          <h6 className="fw-bold mb-0 fs-4">Query</h6>
          <span style={{ marginTop: "10px" }} className="text">
            {query?.resolved || 0} <i className="icofont-checked"></i>
          </span>
          <span className="text">
            {query?.pending || 0} <i className="icofont-warning"></i>
          </span>
          <i
            style={{ marginTop: "10px" }}
            className="icofont-flag fs-3 text-muted"
          ></i>
        </div>
      </div>
    </div>
  );
}
