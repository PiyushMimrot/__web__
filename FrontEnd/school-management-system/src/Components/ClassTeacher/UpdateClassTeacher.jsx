import React, { useState } from "react";

const UpdateClassTeacher = ({ title, formId, teachers, handleSubmitData }) => {
  const [selectedTeacher, setselectedTeacher] = useState("");
  const updateClassTeacherSubmitHandler = (e) => {
    console.log(e.preventDefault());
    let classaliginInfoIds = selectedTeacher.split("+");
    console.log(classaliginInfoIds);
    const [newclassTeacher, newTeacherid, oldclassTeacher] = classaliginInfoIds;
    handleSubmitData({ newclassTeacher, newTeacherid, oldclassTeacher });
    setselectedTeacher("");
  };
  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <form
          className="modal-content"
          onSubmit={updateClassTeacherSubmitHandler}
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
            <div>
              {
                <select
                  className="form-select"
                  aria-label="Default select Teacher"
                  onChange={(e) => setselectedTeacher(e.target.value)}
                  name="teacher_id"
                  required
                  // disabled={showSelect ? true : false}
                >
                  <option>Select Teacher</option>
                  {teachers.map((item, idx, array) => {
                    let class_teacher = array.find(
                      (item) => item?.IsClassTeacher === true
                    );
                    console.log(item);
                    return (
                      <option
                        key={idx}
                        value={`${item?._id}+${item?.teacher_id?._id}+${class_teacher?._id}`}
                        disabled={class_teacher?._id === item?._id}
                        // selected={selectedSection === item._id}
                      >
                        {item?.teacher_id?.name}
                      </option>
                    );
                  })}
                </select>
              }
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              disabled={selectedTeacher === "" ? true : false}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateClassTeacher;
