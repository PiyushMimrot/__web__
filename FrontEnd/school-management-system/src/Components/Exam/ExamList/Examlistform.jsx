import { useEffect, useState, useRef } from "react";
import { SERVER } from "../../../config";
import { MultiSelect } from "react-multi-select-component";
import { AiFillDelete } from "react-icons/ai";
import axios from "axios";

export default function Examlistform({
  formId,
  examType,
  classes,
  handleExamlist,
  subjectsD = {},
}) {
  const [examList, setExamlist] = useState({
    exam_name: "",
    exam_type: "",
    exam_date: "",
    exam_time: "",
    exam_duration: "",
    class_id: "",
  });
  const [subjects, setSubject] = useState([]);
  const [classSubject, setClassSubject] = useState([]);
  const [sectionsOptions, setsectionsOption] = useState([]);
  const [selectSec, setSelectSec] = useState([]);
  const [showAddSubject, setshowAddSubject] = useState(true);
  const [chapterLists, setchapterLists] = useState([]);
  // const [SelcChapters, setSelcChapters] = useState([]);
  const [isModal1, setisModal1] = useState(true);
  const [shouldSubmit, setshouldSubmit] = useState(false);

  const getSection = (id) => {
    fetch(SERVER + `/section/getSectionClass/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        let tempSections = data.data.map((item) => ({
          label: item.name,
          value: item._id,
          classId: item.class_id,
          schoolId: item.school_id,
        }));
        setsectionsOption(tempSections);
      });
  };

  const subjectsOnchange = (e, index) => {
    let update = [...subjects];
    update[index][e.target.name] = e.target.value;
    if (e.target.name === "name") {
      getCourses(e.target.value);
      setshouldSubmit(false);
      update[index]["chapters"] = [];
    }

    setSubject(update);
    CheckShouldShowAddButton(update);
  };

  const deleteSubject = (index) => {
    let update = [...subjects];
    update.splice(index, 1);
    setSubject(update);
    if (update.length <= classSubject.length) {
      setshowAddSubject(true);
    }
    CheckShouldShowAddButton(update);
  };

  const handleChange = (e) => {
    setExamlist({ ...examList, [e.target.name]: e.target.value });

    if (e.target.name === "class_id") {
      getSection(e.target.value);
      setSelectSec([]);
      let subD = subjectsD.filter(
        (item, idx) => item.class_id === e.target.value
      );
      setClassSubject(subD);
    }
  };

  const addSubject = () => {
    if (classSubject.length <= subjects.length) {
      setshowAddSubject(false);
    } else {
      setSubject([...subjects, { name: "", total_marks: "", chapters: [] }]);
      setshouldSubmit(false);
    }
  };

  const handleSecAdd = (data) => {
    setSelectSec(data);
  };

  const handleSecletedChaptersAdd = (data, index) => {
    let update = [...subjects];
    update[index]["chapters"] = data;
    setSubject(update);
    CheckShouldShowAddButton(update);
  };

  // getting a course chapter list
  const getCourses = async (id) => {
    try {
      const res = await axios.get(`${SERVER}/course/getCourse/${id}`, {
        withCredentials: true,
      });
      // console.log(res, "getcourses");

      if (Array.isArray(res.data.data)) {
        // setCourses(res.data.data);
        let addData = res.data.data.map((item) => ({
          value: item._id,
          label: item.name,
        }));
        setchapterLists(addData);
      } else {
        // setCourses([]); // Set to an empty array to avoid the error
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      // setCourses([]); // Set to an empty array in case of an error
    }
  };

  function CheckShouldShowAddButton(data) {
    let isDataNotEmpty = data.some((item) => {
      let check =
        item.name === "" ||
        item.total_marks === "" ||
        item.chapters.length === 0;

      // console.log(item.chapters.length);
      return !check;
    });
    setshouldSubmit(isDataNotEmpty);
  }

  // console.log(subjects);
  // submiting the exam list data
  const handleSubmit = (e) => {
    e.preventDefault();
    let subD = subjects.filter((item, idx) => item.name !== "");

    subD = subD.map((item) => ({
      subject_id: item.name,
      total_marks: Number(item.total_marks),
      chapters: item.chapters.map((item) => item.value),
    }));

    let selectedSectionArray = selectSec.map((item) => item.value);
    // console.log(subD);
    // return;

    handleExamlist({ ...examList, section_id: selectedSectionArray }, subD);
    setExamlist({
      exam_name: "",
      exam_type: "",
      exam_date: "",
      exam_time: "",
      exam_duration: "",
      class_id: "",
    });
    setSubject([]);
    setSelectSec([]);
    setsectionsOption([]);
    setchapterLists([]);
    setisModal1(true);
  };

  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="addholidayLabel">
              {" "}
              Add New Exam list
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            {isModal1 ? (
              <>
                <div className="row g-3 mb-3">
                  <div className="col-sm">
                    <label htmlFor="formFileMultipleone" className="form-label">
                      Class
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select Class"
                      onChange={handleChange}
                      name="class_id"
                      required
                    >
                      <option defaultChecked>Select Class</option>
                      {classes.map((item, idx) => {
                        return (
                          <option
                            key={idx}
                            value={item._id}
                            selected={examList.class_id === item._id}
                          >
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="col-sm">
                    <label htmlFor="formFileMultipleone" className="form-label">
                      Section
                    </label>
                    <MultiSelect
                      options={sectionsOptions}
                      value={selectSec}
                      onChange={handleSecAdd}
                      labelledBy="sections"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Exam Name</label>
                  <input
                    type="text"
                    placeholder="name of the exam"
                    className="form-control"
                    onChange={handleChange}
                    value={examList.exam_name}
                    name="exam_name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Exam Type</label>
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    name="exam_type"
                    onChange={handleChange}
                    required
                  >
                    <option defaultChecked>Select Exam type</option>
                    {examType.map((item, idx) => {
                      return (
                        <option
                          key={idx}
                          value={item._id}
                          selected={examList.exam_type === item._id}
                        >
                          {item.exam_name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="row g-3 mb-3">
                  <div className="col">
                    <label htmlFor="datepickerded123" className="form-label">
                      Exam Start Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="datepickerded123"
                      onChange={handleChange}
                      name="exam_date"
                      value={examList.exam_date}
                      required
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="timepickerded456" className="form-label">
                      Exam time
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      id="datepickerded456"
                      onChange={handleChange}
                      name="exam_time"
                      value={examList.exam_time}
                      required
                    />
                  </div>
                  <div className="col">
                    <label htmlFor="timepickerded456" className="form-label">
                      Duration
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="datepickerded456"
                      placeholder="minutes"
                      onChange={handleChange}
                      name="exam_duration"
                      value={examList.exam_duration}
                      required
                    />
                  </div>
                </div>

                <button
                  disabled={
                    examList.exam_name === "" ||
                    examList.exam_type === "" ||
                    examList.exam_date === "" ||
                    examList.exam_time === "" ||
                    examList.exam_duration === "" ||
                    examList.class_id === "" ||
                    selectSec.length === 0
                      ? true
                      : false
                  }
                  onClick={() => setisModal1(false)}
                  className="btn btn-primary float-right"
                >
                  Next
                </button>
              </>
            ) : (
              <>
                <div className="row g-3 mb-3">
                  <div>
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      Subjects
                    </label>
                    {subjects.map((item, idx) => {
                      return (
                        <div key={idx} class_name="card card-body">
                          <div className="row g-3 mb-3 ">
                            <div className="col-sm gap-3 d-flex justify-content-between">
                              <input
                                type="text"
                                className="form-control col-sm"
                                id="exampleFormControlInput1"
                                name="total_marks"
                                placeholder="Total Marks"
                                value={item.total_marks}
                                onChange={(e) => subjectsOnchange(e, idx)}
                              />
                              <select
                                className="form-select col-sm"
                                aria-label="Default select Section"
                                onChange={(e) => subjectsOnchange(e, idx)}
                                name="name"
                                value={item.name}
                              >
                                <option value={"selectall"}>
                                  Select Subject
                                </option>
                                {classSubject.map((sub, id) => {
                                  return (
                                    <option key={id} value={sub._id}>
                                      {sub.name}
                                    </option>
                                  );
                                })}
                              </select>
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => deleteSubject(idx)}
                              >
                                <AiFillDelete className="text-danger" />
                              </button>
                            </div>
                            <div>
                              <label
                                htmlFor="formFileMultipleone"
                                className="form-label"
                              >
                                Chapters
                              </label>

                              <MultiSelect
                                options={chapterLists}
                                value={item.chapters}
                                onChange={(data) =>
                                  handleSecletedChaptersAdd(data, idx)
                                }
                                labelledBy="chapters"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* ------------------ */}
                  <div></div>

                  {showAddSubject && (
                    <button
                      type="button"
                      className="btn btn-secondary w-100"
                      onClick={addSubject}
                      disabled={examList.exam_type ? false : true}
                    >
                      ADD SUBJECTS
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
          {!isModal1 && (
            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={() => setisModal1(true)}
              >
                Prev
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                disabled={!shouldSubmit}
              >
                Add
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
