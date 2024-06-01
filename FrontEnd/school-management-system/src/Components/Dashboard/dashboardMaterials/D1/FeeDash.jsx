import { useNavigate } from "react-router-dom";

export default function FeeDash({ fee }) {
  const nav = useNavigate();
  return (
    <div
      className="col-md-3 d-flex align-items-center flex-fill"
      style={{ cursor: "pointer" }}
      onClick={() => nav("/collectionhistory")}
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
          <h6 className="fw-bold mb-0 fs-4">Fee</h6>
          <span style={{ marginTop: "10px" }} className="text">
            ₹ {fee?.paid || 0} <i className="icofont-checked"></i>{" "}
          </span>
          <span className="text">
            ₹ {fee?.due || 0} <i className="icofont-warning"></i>{" "}
          </span>
          <i
            style={{ marginTop: "10px" }}
            className="icofont-briefcase-1 fs-3 text-muted"
          ></i>
        </div>
      </div>
    </div>
  );
}
