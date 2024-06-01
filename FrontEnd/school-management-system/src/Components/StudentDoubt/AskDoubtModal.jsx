import { useState } from "react";

export default function AskDoubtModal({
  formId,
  title,
  handleSubmit,
  teachers = [],
}) {
  const [detail, setDetail] = useState({
    teacherId: "",
    doubt: "",
    attachDocument: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDetail((detail) => ({
      ...detail,
      [name]: value,
    }));
  };

  const handleFileInputChange = (event) => {
    const { name, files } = event.target;
    const file = files[0];
    setDetail((detail) => ({
      ...detail,
      [name]: file,
    }));
  };

  const handleSubmitDetail = (e) => {
    e.preventDefault();
    console.log(detail, "in");
    handleSubmit(detail);
    setDetail({
      teacherId: "",
      doubt: "",
      attachDocument: "",
    });
  };

  return (
    <div className="modal fade" id={formId} tabIndex={-1} aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <form className="modal-content" onSubmit={handleSubmitDetail}>
          <div className="modal-header">
            <h5 className="modal-title fw-bold" id="edittickitLabel">
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="teacherId" className="">
                Teacher:
              </label>
              <select
                name="teacherId"
                onChange={handleInputChange}
                className="btn  btn-warning-outline "
                required
              >
                <option value="" defaultChecked>
                  Select a teacher
                </option>
                {teachers.length &&
                  teachers.map((teacher) => (
                    <option
                      key={teacher._id}
                      value={teacher._id}
                      selected={teacher._id === detail.teacherId}
                    >
                      {teacher.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="doubt" className="form-label">
                Doubt
              </label>
              <input
                type="text"
                name="doubt"
                className="form-control"
                value={detail.doubt}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="attachDocument" className="form-label">
                Document Path
              </label>
              <input
                type="file"
                accept=""
                name="attachDocument"
                onChange={handleFileInputChange}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              disabled={
                detail.doubt === "" || detail.teacherId === "" ? true : false
              }
            >
              Submit{" "}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
