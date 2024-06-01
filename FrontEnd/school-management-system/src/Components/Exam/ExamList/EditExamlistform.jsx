import { useState, useEffect } from "react";
import { SERVER } from "../../../config";
import { MultiSelect } from "react-multi-select-component";

export default function EditExamlistform({
  formId,
  examType,
  handleExamlist,
  editData,
}) {
  const [examList, setExamlist] = useState({
    exam_name: "",
    exam_type: "",
    exam_date: "",
    exam_time: "",
    exam_duration: "",
  });
  const [sections, setSections] = useState([]);
  const [selectedSections, setselectedSections] = useState([]);

  const getSection = (id) => {
    fetch(SERVER + `/section/${id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        let tempSections = data.map((item) => ({
          label: item.name,
          value: item._id,
          classId: item.class_id,
          schoolId: item.school_id,
        }));
        setSections(tempSections);
      });
  };
  const handleChange = (e) => {
    setExamlist({ ...examList, [e.target.name]: e.target.value });
    // examList[e.target.name] = e.target.value;
    // console.log(e.target.name, e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(examList);
    let sections = selectedSections.map((item) => item.value);
    console.log("--------------");
    console.log(examList);
    handleExamlist({
      ...examList,
      section_id: sections,
      class_id: editData.class,
    });
    setExamlist({
      exam_type: "",
      exam_date: "",
      exam_time: "",
      class_id: "",
    });
  };

  const handleSecAdd = (data) => {
    setselectedSections(data);
  };

  useEffect(() => {
    if (editData?._id) {
      setExamlist({
        exam_name: editData.name,
        exam_type: editData.type,
        exam_date: editData.date,
        exam_time: editData.time,
        exam_duration: editData.duration,
      });
      setselectedSections(editData.section);
    }
  }, [editData._id]);

  useEffect(() => {
    if (editData?.class) {
      getSection(editData.class);
    }
  }, [editData?.class]);

  // console.log(examList);

  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="addholidayLabel">
              {" "}
              Edit Exam list
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setExamlist({})}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Exam Name</label>
              <input
                type="text"
                placeholder="name of the exam"
                className="form-control"
                onChange={handleChange}
                value={examList.exam_name}
                name="exam_name"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Exam Type</label>
              <select
                className="form-select"
                aria-label="Default select example"
                name="exam_type"
                onChange={handleChange}
                value={examList.exam_type}
              >
                {examType.map((item, idx) => {
                  // console.log(item._id);
                  return (
                    <option
                      key={idx}
                      value={item._id}
                      selected={item._id === examList.type}
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
                  Exam Date
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="datepickerded123"
                  onChange={handleChange}
                  name="exam_date"
                  value={examList.exam_date}
                  //   value="2023-02-23"
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
                />
              </div>

              <div className="col">
                <label htmlFor="" className="form-label">
                  Duration
                </label>
                <input
                  type="number"
                  className="form-control"
                  onChange={handleChange}
                  name="exam_duration"
                  value={examList.exam_duration}
                />
              </div>
            </div>
            <div className="row g-3 mb-3">
              <div className="col-sm">
                <label htmlFor="formFileMultipleone" className="form-label">
                  Section
                </label>

                <MultiSelect
                  options={sections}
                  value={selectedSections}
                  onChange={handleSecAdd}
                  labelledBy="sections"
                />
              </div>
            </div>
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
}
