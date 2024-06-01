import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { StudentInfo, addNewStudent } from "../student_apis.js";
import { useClassAndSectionInfo } from "../../../hooks/basic.js";
import Swal from "sweetalert2";

export const AddNewStudent = (props: { onClose: () => void }) => {
  const studentRef = useRef<StudentInfo>({});
  const [showMore, setShowMore] = useState(false);
  const [sections, setSections] = useState<string[]>();
  const classAndSectionInfo = useClassAndSectionInfo();

  const addStudent = async (student: StudentInfo) => {
    // let regExp = /^([a-zA-Z'-.]+ [a-zA-Z'-.]+)$/;
    if (student.name) {
      const result = await addNewStudent(student);
      console.log("Resuled data=>", result);
      if (result.success) {
        props.onClose();
        Swal.fire({
          title: "Success",
          text: "Student Added Successfully",
          icon: "success",
          timer: 3000,
        });
      } else {
        Swal.fire("Failed to Add Student", "error");
      }
    } else {
      Swal.fire("Name not defined!", "error");
    }
  };

  return (
    <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title  fw-bold" id="leaveaddLabel">
            Add Student
          </h5>
          <button type="button" className="btn-close" onClick={props.onClose} />
        </div>
        <div className="modal-body">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addStudent(studentRef.current);
            }}
          >
            <p className="text-primary m-0 text-center fw-bolder">
              Academic Details
            </p>
            {/* Name */}
            <div className="mb-3">
              <label htmlFor="sub" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Student Name"
                onChange={(e) => (studentRef.current.name = e.target.value)}
                required
                data-bs-toggle="tooltip"
                data-bs-placement="left"
                title="Enter Name"
              />
            </div>
            {/* Number */}
            <div className="mb-3">
              <label htmlFor="sub" className="form-label">
                Number
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Student Number"
                onChange={(e) => (studentRef.current.number = e.target.value)}
                required
                data-bs-toggle="tooltip"
                data-bs-placement="left"
                title="Enter Number"
                maxLength={10}
                pattern="\b\d{10}\b"
              />
            </div>
            {/* DOB Gender */}
            <div className="row">
              <div className="col">
                <label htmlFor="sub" className="form-label">
                  Date Of Birth
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="Enter Date"
                  onChange={(e) => (studentRef.current.dob = e.target.value)}
                  required
                  data-bs-toggle="tooltip"
                  data-bs-placement="left"
                  title="Enter Date Of Birth"
                />
              </div>

              <div className="col">
                <label htmlFor="gender" className="form-label">
                  Gender
                </label>
                <select
                  name="gender"
                  className="form-select mb-2"
                  aria-label="Default select example"
                  onChange={(e) => (studentRef.current.gender = e.target.value)}
                  required
                  data-bs-toggle="tooltip"
                  data-bs-placement="left"
                  title="Select Gender"
                >
                  <option value={""}>Select Gender</option>
                  <option value={"Male"}>Male</option>
                  <option value={"Female"}>Female</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="mb-3 col">
                <label htmlFor="sub" className="form-label">
                  Class
                </label>
                <select
                  className="form-select"
                  aria-label="Class select"
                  name="class_id"
                  onChange={(e) => {
                    studentRef.current.cls = e.target.value;
                    setSections(
                      classAndSectionInfo?.find(
                        (item) => item.cls === e.target.value
                      )?.sections
                    );
                  }}
                  required
                  data-bs-toggle="tooltip"
                  data-bs-placement="left"
                  title="Select Class"
                >
                  <option value={""}>No Class</option>
                  {classAndSectionInfo?.map((item, idx) => (
                    <option key={idx} value={item.cls}>
                      {item.cls}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3 col">
                <label htmlFor="sub" className="form-label">
                  Section
                </label>
                <select
                  className="form-select"
                  aria-label="Section select"
                  onChange={(e) =>
                    (studentRef.current.sec = e.target.selectedOptions[0].text)
                  }
                  required
                  data-bs-toggle="tooltip"
                  data-bs-placement="left"
                  title="Select Section"
                >
                  <option value={""}>No Section</option>
                  {sections?.map((item, idx) => (
                    <option key={idx} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <p className="text-primary my-2 text-center fw-bolder">
              Personal Details
            </p>
            <div className="mb-3">
              <label htmlFor="sub" className="form-label">
                Father Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Father Name"
                required
                onChange={(e) =>
                  (studentRef.current.fatherName = e.target.value)
                }
                data-bs-toggle="tooltip"
                data-bs-placement="left"
                title="Enter Father Name"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="sub" className="form-label">
                Mother Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Mother Name"
                required
                onChange={(e) =>
                  (studentRef.current.motherName = e.target.value)
                }
                data-bs-toggle="tooltip"
                data-bs-placement="left"
                title="Enter Mother Name"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="sub" className="form-label">
                Parent Number
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Parent Number"
                required
                onChange={(e) =>
                  (studentRef.current.parentNumber = e.target.value)
                }
                data-bs-toggle="tooltip"
                data-bs-placement="left"
                title="Enter Parent Number"
                maxLength={10}
                minLength={10}
                pattern="\b\d{10}\b"
              />
            </div>

            {showMore && <MoreDetails studentRef={studentRef} />}

            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "Less" : "More"}
              </button>
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                Add Student
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const MoreDetails = (props: { studentRef: MutableRefObject<StudentInfo> }) => {
  const [photo, setPhoto] = useState<File>();
  const [aadhar, setAadhar] = useState<File>();

  return (
    <div>
      <p className="text-primary m-0 text-center fw-bolder my-2">
        Addtional Details (Optional)
      </p>
      <div className="row">
        <div className="mb-3 col">
          <label htmlFor="address" className="form-label">
            Nationality
          </label>
          <input
            type="text"
            name="nationality"
            className="form-control"
            id="nationality"
            placeholder="Student Nationality"
            onChange={(e) =>
              (props.studentRef.current.nationality = e.target.value)
            }
            required
            data-bs-toggle="tooltip"
            data-bs-placement="left"
            title="Enter Nationality"
          />
        </div>
        <div className="mb-3 col">
          <label htmlFor="address" className="form-label">
            Religion
          </label>
          <input
            type="text"
            name="religion"
            className="form-control"
            id="religion"
            placeholder="Student Religion"
            onChange={(e) =>
              (props.studentRef.current.religion = e.target.value)
            }
            data-bs-toggle="tooltip"
            data-bs-placement="left"
            title="Enter Religion"
          />
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="address" className="form-label">
          Adhar Number
        </label>
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Student Adher Number"
              onChange={(e) =>
                (props.studentRef.current.aadhar_number = e.target.value)
              }
              data-bs-toggle="tooltip"
              data-bs-placement="left"
              title="Enter Adher Number"
              maxLength={12}
              pattern="\b\d{12}\b"
            />
          </div>
        </div>
      </div>

      <div className="row">
        <div className="mb-3 col">
          <i className="icofont-user fs-5 " />
          <label htmlFor="photo" className="form-label btn btn-warning">
            Upload Photo
          </label>
          <input
            className="form-control"
            type="file"
            id="photo"
            accept="image/*"
            name="photo"
            onChange={(e) => {
              props.studentRef.current.photo = e.target.files?.[0];
              setPhoto(e.target.files?.[0]);
            }}
            data-bs-toggle="tooltip"
            data-bs-placement="left"
            title="Upload Photo"
            max-size="1024"
            style={{ display: "none" }}
          />
          {photo ? (
            <img
              src={URL.createObjectURL(photo)}
              alt="assignment"
              width="200px"
              height="auto"
            />
          ) : null}
        </div>

        <div className="mb-3 col">
          <i className="icofont-file-document fs-5" />
          <label htmlFor="aadhar" className="form-label btn btn-warning">
            Upload Adharcard
          </label>
          <input
            className="form-control"
            type="file"
            id="aadhar"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                props.studentRef.current.aadhaar_file = e.target.files[0];
                setAadhar(e.target.files[0]);
              }
            }}
            data-bs-toggle="tooltip"
            data-bs-placement="left"
            title="Upload Aadhar Card"
            style={{ display: "none" }}
          />
          {aadhar ? (
            <img
              src={URL.createObjectURL(aadhar)}
              alt="assignment"
              width="200px"
              height="auto"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};
