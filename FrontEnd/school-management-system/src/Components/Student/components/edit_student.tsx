import React, { useRef, useState } from "react";
import { StudentInfo } from "../student_apis.js";
import { StudentInFocus } from "../student.js";

export const EditStudent = (props: {
  onSubmit: (student: StudentInfo) => void;
  onClose: () => void;
  currentStudent: StudentInFocus;
  setCurrentStudent: any;
}) => {
  //   const studentRef = useRef<StudentInfo>(
  //     props?.currentStudent ? props.currentStudent?.student : {}
  //   );
  const { currentStudent, setCurrentStudent } = props;
  console.log(currentStudent.student);

  return (
    <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title  fw-bold" id="leaveaddLabel">
            Edit Student
          </h5>
          <button type="button" className="btn-close" onClick={props.onClose} />
        </div>
        <div className="modal-body">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              props.onSubmit(
                currentStudent?.student ? currentStudent?.student : {}
              );
            }}
          >
            <div className="mb-3">
              <label htmlFor="sub1" className="form-label">
                Name
              </label>
              <input
                type="text"
                onChange={(e) =>
                  setCurrentStudent({
                    ...currentStudent,
                    student: {
                      ...currentStudent?.student,
                      name: e.target.value,
                    },
                  })
                }
                value={currentStudent?.student?.name}
                className="form-control"
                id="sub1"
                name={"name"}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="sub1" className="form-label">
                Number
              </label>
              <input
                type="text"
                onChange={(e) =>
                  setCurrentStudent({
                    ...currentStudent,
                    student: {
                      ...currentStudent?.student,
                      number: e.target.value,
                    },
                  })
                }
                value={currentStudent?.student?.number}
                className="form-control"
                id="sub1"
                name={"number"}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="sub1" className="form-label">
                DOB
              </label>
              <input
                type="date"
                className="form-control"
                id="sub1"
                name={"dob"}
                onChange={(e) =>
                  setCurrentStudent({
                    ...currentStudent,
                    student: {
                      ...currentStudent?.student,
                      dob: e.target.value,
                    },
                  })
                }
                value={currentStudent?.student?.dob?.slice(0, 10)}
              />
            </div>
            <button
              // disabled={
              //   editDetail.name === "" ||
              //   editDetail.number === "" ||
              //   editDetail.dob === ""
              //     ? true
              //     : false
              // }
              type="submit"
              className="btn btn-primary"
              //   data-bs-dismiss="modal"
              //   onClick={() => handleEdit(editstudent._id)}
            >
              Save changes
            </button>
            {/* <div className="form-check form-switch theme-switch">
              <input
                className="form-check-input"
                type="checkbox"
                id="theme-switch"
                name={"status"}
                onChange={handleChange}
                checked={editstudent["status"]}
              />
              <label className="form-check-label" htmlFor="theme-switch">
                Status
              </label>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};
