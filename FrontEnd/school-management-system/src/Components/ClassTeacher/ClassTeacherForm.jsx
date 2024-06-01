import { useEffect, useState } from "react";
import { SERVER } from "../../config";
import { InstilTable, TableState } from "../MainComponents/InstillTable";
import Swal from "sweetalert2";

export default function ClassTeacherForm({
  title,
  formId,
  classes,
  session,
  teachers,
  handleNewData,
  allClassTeachers,
}) {
  const [subjects, setSubjects] = useState([]);
  const [newClassTeacher, setNewClassTeacher] = useState({});
  // const [IsClassTeacher,setIsClassTeacher] = useState(false);
  const [subTeacher, setSubTeacher] = useState([]);
  const [sections, setSections] = useState([]);
  const [classTeacher, setClassTeacher] = useState([]);
  const [isTeacherAssign, setIsTeacherAssign] = useState(false);
  const [showBtn, setShowBtn] = useState(true);
  const [showSelect, setShowSelect] = useState(false);
  const [tableState, setTableState] = useState(TableState.LOADING);
  const [isClassTeacherAdded, setisClassTeacherAdded] = useState(false);

  useEffect(() => {
    if (newClassTeacher["class_id"]) {
      getSections();
      classSubjects();
    }
  }, [newClassTeacher?.class_id]);

  const getSections = () => {
    fetch(SERVER + `/section/${newClassTeacher["class_id"]}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setSections(data));
  };

  const classSubjects = async () => {
    setTableState(TableState.LOADING);
    await fetch(
      `${SERVER}/subject/getSubjectClass/${newClassTeacher["class_id"]}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((data) => setSubjects(data.data));
    setTableState(TableState.SUCCESS);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "section_id") {
      let isPresent = allClassTeachers.some(
        (item) =>
          item.section_id._id === value && item.session_id === session._id
      );

      setIsTeacherAssign(isPresent);
    }
    setNewClassTeacher({ ...newClassTeacher, [name]: value });
  };

  const checkClassTeacher = async () => {
    setShowBtn(false);
    setShowSelect(true);

    const updatedClassTeacher = [...classTeacher];

    for (let i = 0; i < updatedClassTeacher.length; i++) {
      const fetchData = await fetch(`${SERVER}/ClassTeacher/classteacher`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacher_id: updatedClassTeacher[i].teacher_id,
          sessionid: session._id,
        }),
        credentials: "include",
      });

      const checkClassTeacher = await fetchData.json();
      if (checkClassTeacher?.IsClassTeacher === true) {
        updatedClassTeacher[i] = {
          ...updatedClassTeacher[i],
          alreadyClassTeacher: true,
        };
      }
    }

    setClassTeacher(updatedClassTeacher);
  };

  const handleSubTeacher = (e, sub) => {
    let teacherId = e.target.value.split("-");
    let subT = {
      [e.target.name]: teacherId[0],
      subject_id: sub["_id"],
      name: teacherId[1],
      alreadyClassTeacher: false,
    };
    let isUpdated = false;
    for (let i = 0; i < subTeacher.length; i++) {
      if (subTeacher[i].subject_id === subT.subject_id) {
        subTeacher[i].teacher_id = subT.teacher_id;
        subTeacher[i].name = subT.name;
        isUpdated = true;
      }
    }
    if (!isUpdated) {
      subTeacher.push(subT);
    }

    // let classT = { ...subT, name: teacherId[1] };

    const uniqueTeachers = subTeacher.reduce((acc, item) => {
      if (!acc[item.teacher_id]) {
        acc[item.teacher_id] = item;
      }
      return acc;
    }, {});

    const uniqueData = Object.values(uniqueTeachers);

    // classTeacher.push(uniqueData);

    setSubTeacher([...subTeacher]);
    setClassTeacher(uniqueData);
    // checkClassTeacher(uniqueData);
    // setClassTeacher([...classTeacher]);
  };

  const handleSelectClass = (e) => {
    let classTeach = subTeacher.map((item, idx) => {
      if (item.teacher_id === e.target.value) {
        item = { ...item, IsClassTeacher: true };
        setisClassTeacherAdded(true);
      } else {
        item = { ...item, IsClassTeacher: false };
      }
      return item;
    });

    setSubTeacher([...classTeach]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (subjects.length === subTeacher.length) {
      let newData = {
        ...newClassTeacher,
        class_id: newClassTeacher["class_id"],
        session_id: session._id,
        subTeacher,
      };
      let isCheck = subTeacher.filter((item) => item.IsClassTeacher === true);
      if (isCheck.length) {
        handleNewData(newData);
        setNewClassTeacher({});
        setSubjects([]);
        setSubTeacher([]);
        setShowBtn(true);
        setShowSelect(false);
        setSections([]);
      } else {
        Swal.fire({
          title: "Warning !!",
          text: "Please select Class Teacher",
          icon: "warning",
          timer: 3000,
        });
      }
    } else {
      Swal.fire({
        title: "Warning !!",
        text: "Please select Subject Teacher",
        icon: "warning",
        timer: 3000,
      });
    }
  };
  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <form className="modal-content" onSubmit={handleSubmit} required>
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
            <div className="col-sm">
              <label htmlFor="formFileMultipleone" className="form-label">
                Class
              </label>
              <select
                className="form-select"
                aria-label="Default select Class"
                onChange={handleInputChange}
                name="class_id"
              >
                <option>Select Class</option>
                {classes.map((item, idx) => {
                  return (
                    <option
                      key={idx}
                      value={item._id}
                      selected={newClassTeacher?.class_id === item._id}
                    >
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
            {newClassTeacher.class_id && (
              <div className="col-sm">
                <label htmlFor="formFileMultipleone" className="form-label">
                  Section
                </label>
                <select
                  className="form-select"
                  aria-label="Default select Section"
                  onChange={handleInputChange}
                  name="section_id"
                >
                  <option>Select Section</option>
                  {sections.map((item, idx) => {
                    return (
                      <option key={idx} value={item._id}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}
            {!isTeacherAssign ? (
              newClassTeacher?.section_id ? (
                <InstilTable
                  tableState={tableState}
                  titles={["Subject", "Teacher"]}
                  rows={subjects.map((subject, idx) => ({
                    Subject: subject.name,
                    Teacher: (
                      <select
                        className="form-select"
                        aria-label="Default select Teacher"
                        onChange={(e) => handleSubTeacher(e, subject)}
                        name="teacher_id"
                        required
                        disabled={showSelect ? true : false}
                      >
                        <option>Select Teacher</option>
                        {teachers.map((item, idx) => {
                          return (
                            <option
                              key={idx}
                              value={item._id + "-" + item.name}
                            >
                              {item.name}
                            </option>
                          );
                        })}
                      </select>
                    ),
                  }))}
                />
              ) : (
                ""
              )
            ) : (
              "Teachers already Assigned"
            )}
            {subTeacher.length > 0 && subTeacher.length === subjects.length && (
              <div>
                {showBtn ? (
                  <a
                    className="btn btn-primary mt-3 mb-3"
                    onClick={checkClassTeacher}
                  >
                    Add Class Teacher
                  </a>
                ) : (
                  <a
                    className="btn btn-secondary mt-3 mb-3"
                    onClick={() => {
                      setShowBtn(true);
                      setShowSelect(false);
                    }}
                  >
                    Change Subject
                  </a>
                )}
                {classTeacher.length && !showBtn && (
                  <div className="col-sm">
                    <label htmlFor="formFileMultipleone" className="form-label">
                      Select Class Teacher
                    </label>

                    <select
                      className="form-select"
                      aria-label="Default select Teacher"
                      onChange={(e) => handleSelectClass(e)}
                      name="teacher_id"
                    >
                      <option>Select Teacher</option>
                      {classTeacher.map((item, idx) => {
                        return (
                          <option
                            disabled={item?.alreadyClassTeacher}
                            key={idx}
                            value={item.teacher_id}
                          >
                            {item.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              disabled={
                !(
                  subTeacher.length > 0 &&
                  subTeacher.length === subjects.length &&
                  isClassTeacherAdded
                )
              }
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
