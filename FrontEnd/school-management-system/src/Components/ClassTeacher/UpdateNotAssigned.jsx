import React, { useEffect, useState } from "react";

const UpdateNotAssigned = ({
  title,
  formId,
  teachers,
  subjects,
  handleSubmitData,
}) => {
  const [teacherselectedSubjects, setteacherselectedSubjects] = useState([]);
  console.log(teacherselectedSubjects);

  useEffect(() => {
    if (subjects) {
      let update = subjects.map((item) => ({
        teacher: "",
        subject: item._id,
      }));
      setteacherselectedSubjects(update);
    }
  }, [subjects]);
  console.log(teacherselectedSubjects);

  const HandlerSetTeacherToSubject = (e, index) => {
    const update = [...teacherselectedSubjects];
    update[index]["teacher"] = e.target.value;
    setteacherselectedSubjects(update);
  };

  const addNewNotAssignedSubmitHandler = (e) => {
    e.preventDefault();
    handleSubmitData(teacherselectedSubjects);
  };
  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <form
          className="modal-content"
          onSubmit={addNewNotAssignedSubmitHandler}
          required
        >
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="addholidayLabel">
              {title}
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {subjects &&
              subjects.map((subD, index) => (
                <div className="row mb-3" key={index}>
                  <div className="col">
                    <label htmlFor="">{subD.name}</label>
                  </div>
                  <div className="col">
                    {
                      <select
                        className="form-select"
                        aria-label="Default select Teacher"
                        onChange={(e) => HandlerSetTeacherToSubject(e, index)}
                        name="teacher_id"
                        required
                        // disabled={showSelect ? true : false}
                      >
                        <option>Select Teacher</option>
                        {teachers.map((item, idx) => {
                          return (
                            <option key={idx} value={item._id}>
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                    }
                  </div>
                </div>
              ))}
          </div>

          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateNotAssigned;
