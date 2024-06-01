import { MdOutlineDateRange } from "react-icons/md";
import moment from "moment";

export default function ViewD({ formId, doubt }) {
  if (Object.keys(doubt).length) {
    return (
      <div className="modal fade" id={formId} tabindex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mt-5">
                <div className="lesson_name">
                  <div className="project-block bg-warning">
                    <i className="icofont-read-book-alt fs-1 text"></i>
                  </div>

                  <span className="small text-muted project_name fw-bold">
                    {" "}
                    <h3 className="mb-0 fw-bold  fs-6  mb-2">
                      {" "}
                      Please help !{" "}
                    </h3>
                  </span>
                </div>
              </div>

              <div className="row g-2 pt-4">
                <div className="col-6">
                  <div className="d-flex align-items-center primary">
                    <i className="icofont-paper-clip "></i>
                    <span className="ms-2">1 Attach</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <MdOutlineDateRange />
                    <span className="ms-2">
                      Date :{moment(doubt.date).format("DD MMM YYYY")}
                    </span>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="icofont-sand-clock"></i>
                    <span className="ms-2">
                      Time :{moment(doubt.date).format("LT")}
                    </span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center">
                    <i className="icofont-group-students "></i>
                    <span className="ms-2">{doubt.teacherId.name}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="mb-0 fs-6  mb-2">My Question- </h4>
                <span className="ms-2 text">
                  <h6>{doubt.doubt}</h6>
                </span>
                <div className="d-flex gap-3">
                  {doubt?.attachDocument && (
                    <a
                      className="btn btn-primary"
                      href={`${SERVER}/doubts/${doubt.attachDocument}`}
                      target="_blank"
                    >
                      Attachment
                    </a>
                  )}
                  {doubt?.teacherDocument && (
                    <a
                      className="btn btn-primary"
                      href={`${SERVER}/doubts/${doubt.teacherDocument}`}
                      target="_blank"
                    >
                      Solution
                    </a>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
