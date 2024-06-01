import { useParams } from "react-router-dom";
import { SERVER } from "../../../config";
import { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import ExamResultform from "./ExamResultform";
import Swal from "sweetalert2";
import { getTypeToken } from "../../../Context/localStorage";

const type = getTypeToken();

export default function ExamResult() {
  const [examD, setExam] = useState({});
  const [subject, setSubject] = useState([]);
  const [examList, setExamList] = useState({});
  const [students, setStudents] = useState([]);
  const [section, setSection] = useState([]);
  const [showStudent, setShowStudent] = useState([]);
  const [crrSub, setCrrSub] = useState({ name: "", id: "", mark: "", id2: "" });
  const [subMark, setSubMark] = useState([]);
  const [examRes, setExamRes] = useState([]);
  const [edit, setEdit] = useState({});
  const [sltSec, setSltSec] = useState("");
  const [shouldSubmit, setshouldSubmit] = useState(false);

  const { exam, examSub } = useParams();

  useEffect(() => {
    getExamSubject();
    getExamListById();
  }, []);

  useEffect(() => {
    if (crrSub.name && sltSec) {
      getExamResult();
    }
  }, [crrSub, sltSec]);

  const getExamResult = async () => {
    // const res = await fetch(SERVER + `/examResult/examSub`, { credentials: 'include'});
    await fetch(`${SERVER}/examResult/examSub`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        examId: exam,
        subId: crrSub.id,
        sectionId: sltSec,
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        data = data.filter(
          (item) => item.sectionId === sltSec && item.exam_subject === crrSub.id
        );
        console.log(data);
        if (data.length) {
          setShowStudent(data);
          setExamRes(data);
        } else {
          let std = students.filter((item) => item.section_id === sltSec);
          setExamRes([]);
          setShowStudent(std);
        }
      });
  };

  const getExamSubject = async () => {
    await fetch(SERVER + `/examSubject/${exam}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setExam(data[0]);
        setSubject(data[0].subject);
      });
  };
  const getExamListById = async () => {
    await fetch(SERVER + `/examlist/${exam}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setExamList(data, "examlist");
        // console.log(response.data);
        setSection(data.section_id);
        return data.class_id;
      })
      .then((getExternalId) => {
        console.log(getExternalId);
        // getClasses(getExternalId._id);
        // setSection(data.data);
        const res = fetch(`${SERVER}/studentAlign/studentByClass`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            class_id: getExternalId._id,
          }),
          credentials: "include",
        });
        return res;
      })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setStudents(data.data);
        // setShowStudent(data.data);
      });
  };
  // const getClasses = (id) => {
  //   // console.log(id,'id')

  //   fetch(SERVER + `/section/getSectionClass/${id}`, { credentials: "include" })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setSection(data.data);
  //     });
  // };

  const handleSectionChange = (e) => {
    setSltSec(e.target.value);
    setSubMark([]);
    setshouldSubmit(false);
  };
  const handleSubChange = (e) => {
    let sv = e.target.value.split("-");
    console.log(sv);
    setCrrSub({ name: sv[1], id: sv[0], mark: sv[2], id2: sv[3] });
    setSubMark([]);
    setshouldSubmit(false);
  };

  const handleMarks = (e, stdId, idx) => {
    let update = [...subMark];
    if (
      Number(e.target.value) >= 0 &&
      Number(e.target.value) <= Number(crrSub.mark)
    ) {
      update[idx] = {
        marksObtain: e.target.value,
        student_id: stdId,
        exam_subject: crrSub.id,
        exam_id: exam,
        sectionId: sltSec,
        exam_subject_name_id: crrSub.id2,
      };
      setSubMark(update);
    }

    // console.log(showStudent.length , update.length);
    if (showStudent.length === update.length) {
      let allEnter = update.some((item) => item.marksObtain === "");
      if (!allEnter) {
        setshouldSubmit(true);
      } else {
        setshouldSubmit(false);
      }
    }
  };

  const postResult = async (data) => {
    try {
      await fetch(`${SERVER}/examResult`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data,
        }),
        credentials: "include",
      }).then((res) => {
        Swal.fire({
          title: "Success",
          text: "Result Added Successfully",
          icon: "success",
          timer: 3000,
        });
        getExamResult();
      });
    } catch (error) {
      console.error("Error:", error);
    }

    getExamResult();
  };

  const handleAddResult = (e) => {
    e.preventDefault();
    console.log(subMark);

    if (showStudent.length !== subMark.length) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "please enter all students marks",
        timer: 3000,
      });
    }
    let allEnter = subMark.some((item) => item.marksObtain === "");
    if (allEnter) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "please enter all students marks",
        timer: 3000,
      });
    } else {
      postResult(subMark);
    }
  };

  const handleAddEdit = async (data) => {
    try {
      // await axios.put(SERVER + `/examResult/${data._id}`, uata, {withCredentials: true});
      await fetch(`${SERVER}/examResult/${data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      }).then((res) => {
        Swal.fire({
          title: "Success",
          text: "Result Edited Successfully",
          icon: "success",
          timer: 3000,
        });
        getExamResult();
      });
    } catch {}
  };
  console.log(subMark);
  return (
    <div>
      <div className="card p-3">
        <div className="d-flex gap-2 align-items-center text-primary">
          <h3 className="fw-bold">Name :</h3>
          <h3 className="text-dark">{examList?.exam_name}</h3>
        </div>
        <div className="d-flex gap-2 align-items-center text-primary ">
          <h4 className="fw-bold">Type :</h4>
          <h4 className="text-dark text-lowercase">
            {examList?.exam_type?.exam_name}
          </h4>
        </div>
        <div className="row">
          <div className="col-sm">
            <label htmlFor="formFileMultipleone" className="form-label">
              Select Section
            </label>
            <select
              className="form-select"
              aria-label="Default select Section"
              name="section_id"
              onChange={handleSectionChange}
            >
              <option value={"selectall"}>Select Section</option>
              {section.map((sec, id) => {
                // console.log(sec);
                return (
                  <option key={id} value={sec._id}>
                    {sec.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col-sm">
            <label htmlFor="formFileMultipleone" className="form-label">
              Select Subject
            </label>
            <select
              className="form-select"
              aria-label="Default select Section"
              name="section_id"
              onChange={handleSubChange}
            >
              <option defaultValue={""}>Select Subject</option>
              {subject.map((sub, id) => {
                //   console.log(sub);
                return (
                  <option
                    key={id}
                    value={
                      sub._id +
                      "-" +
                      sub.subject_id.name +
                      "-" +
                      sub.total_marks +
                      "-" +
                      sub.subject_id._id
                    }
                  >
                    {sub.subject_id.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
      <div className="table-responsive card mt-4">
        {sltSec && crrSub.name ? (
          !examRes.length ? (
            <form onSubmit={handleAddResult}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Students</th>
                    <th>
                      {crrSub.name}({crrSub.mark}){/* check */}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {showStudent.map((std, idx) => {
                    // console.log(std);
                    const mark = subMark.find(
                      (item) => item.student_id === std.studentid._id
                    );
                    return (
                      <tr key={idx}>
                        <td>{std.studentid.name}</td>
                        <td>
                          <input
                            type="number"
                            value={
                              mark?.marksObtain
                                ? parseInt(mark.marksObtain)
                                : ""
                            }
                            onChange={(e) =>
                              handleMarks(e, std.studentid._id, idx)
                            }
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {shouldSubmit && (
                <button type="submit" className="btn btn-outline-primary">
                  Add Result
                </button>
              )}
            </form>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Students</th>
                  <th>Subject Mark ({crrSub.mark})</th>
                  {(type === "admin" || type === "teacher") && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {showStudent?.map((std, idx) => {
                  // let {name} = std.studentid
                  // console.log(std);
                  return (
                    <tr key={idx}>
                      <td>{std?.student_id?.name}</td>
                      <td>{std?.marksObtain}</td>
                      {(type === "admin" || type === "teacher") && (
                        <td>
                          <button
                            className="btn btn-secondary"
                            data-bs-toggle="modal"
                            data-bs-target={"#editResult"}
                            onClick={() => setEdit(std)}
                            disabled={examList?.status}
                          >
                            <AiFillEdit />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        ) : (
          ""
        )}
      </div>
      <ExamResultform
        title={"Edit Marks"}
        formId={"editResult"}
        editData={edit || {}}
        subjectMark={crrSub?.mark || null}
        addEditMarks={handleAddEdit}
      />
    </div>
  );
}
