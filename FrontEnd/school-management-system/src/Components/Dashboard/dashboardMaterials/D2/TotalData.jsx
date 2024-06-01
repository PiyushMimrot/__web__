import { useNavigate } from "react-router-dom";

export default function TotalData({ total }) {
  const nav = useNavigate();

  return (
    <div className="card-body">
      <div className="row g-2 row-deck">
        <div className="col-md-6 col-sm-6">
          <div className="card">
            <div
              className="card-body "
              style={{ cursor: "pointer" }}
              onClick={() => nav("/students")}
            >
              <i className="icofont-group-students fs-3"></i>
              <h6 className="mt-3 mb-0 fw-bold small-14">Total Student</h6>
              <span className="text-muted">
                {total?.students &&
                  Number(total.students.boys ?? 0) +
                    Number(total.students.girls ?? 0)}
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-sm-6">
          <div className="card">
            <div
              className="card-body "
              style={{ cursor: "pointer" }}
              onClick={() => nav("/staff")}
            >
              <i className="icofont-teacher fs-3"></i>
              <h6 className="mt-3 mb-0 fw-bold small-14">Total Staff</h6>
              <span className="text-muted">{total?.staffs || 0}</span>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-sm-6">
          <div className="card">
            <div
              className="card-body "
              style={{ cursor: "pointer" }}
              onClick={() => nav("/classes")}
            >
              <i className="icofont-school-bag fs-3"></i>
              <h6 className="mt-3 mb-0 fw-bold small-14">Total Classes</h6>
              <span className="text-muted">{total?.classes || 0}</span>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-sm-6">
          <div className="card">
            <div className="card-body ">
              <i className="icofont-beach-bed fs-3"></i>
              <h6 className="mt-3 mb-0 fw-bold small-14">Leave Apply</h6>
              <span className="text-muted">{total?.leave || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
