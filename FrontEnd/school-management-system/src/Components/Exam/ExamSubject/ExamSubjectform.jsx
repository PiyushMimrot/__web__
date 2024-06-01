import { useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import axios from "axios";
import { SERVER } from "../../../config";

export default function ExamSubjectform({
  formId,
  title,
  handleExamSubject,
  allSubjects,
  enteredSubjects,
}) {
  const [examSubject, setexamSubject] = useState("");
  const [mark, setMark] = useState("");
  const [chapterLists, setchapterLists] = useState([]);
  const [SelectedChapters, setSelectedChapters] = useState([]);

  const getChapters = async (id) => {
    try {
      const res = await axios.get(`${SERVER}/course/getCourse/${id}`, {
        withCredentials: true,
      });

      if (Array.isArray(res.data.data)) {
        // setCourses(res.data.data);
        console.log(res.data.data);
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

  const subjectChangeHandler = (e) => {
    setexamSubject(e.target.value);
    getChapters(e.target.value);
    setSelectedChapters([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let tempChapt = SelectedChapters.map((item) => item.value);
    handleExamSubject({
      subject_id: examSubject,
      total_marks: mark,
      chapters: tempChapt,
    });
    setexamSubject("");
    setSelectedChapters([]);
    setchapterLists([]);
    setMark("");
  };

  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <form className="modal-content" onSubmit={handleSubmit}>
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
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Subject Name
              </label>

              <select
                className="form-select"
                aria-label="Default select Class"
                onChange={subjectChangeHandler}
                name="class_id"
                value={examSubject}
                // onClick={handleClassChange}
              >
                <option>Select Subject</option>
                {allSubjects &&
                  allSubjects
                    .filter(
                      (item) =>
                        !enteredSubjects?.some(
                          (enteredSubject) => enteredSubject.name === item.name
                        )
                    )
                    .map((item, idx) => {
                      return (
                        <option key={idx} value={item._id}>
                          {item.name}
                        </option>
                      );
                    })}
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Total Marks
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleFormControlInput1"
                placeholder="subject marks"
                value={mark}
                onChange={(e) => setMark(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="formFileMultipleone" className="form-label">
                Chapters
              </label>

              <MultiSelect
                options={chapterLists}
                value={SelectedChapters}
                labelledBy="chapters"
                onChange={(data) => setSelectedChapters(data)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              {formId === "editExamSubject" ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
