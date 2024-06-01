import { SERVER } from "../../config";
import { useEffect, useState } from "react";
import Table2 from "../MainComponents/Table2";
import { Link } from "react-router-dom";
import { AiOutlineEye } from "react-icons/ai";
import axios from "axios";

export default function Classflow() {
  const [subjectTeacher, setSubjectTeacher] = useState([]);
  const [userType, setUserType] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [className, setClassName] = useState("");
  const [sectionName, setSectionName] = useState("");

  useEffect(() => {
    const fetchInfo = async () => {
      const getType = await fetch(`${SERVER}/profile/type`, {
        credentials: "include",
      });
      if (!getType.ok) {
        throw new Error(`HTTP error! Status: ${getType.status}`);
      }
      const { currentId, type } = await getType.json();
      // console.log(currentId, type);
      setUserType(type);

      if (type === "student") {
        const data = await fetch(
          `${SERVER}/studentAlign/studentById/${currentId}`,
          {
            credentials: "include",
          }
        );
        if (!data.ok) {
          throw new Error(`HTTP error! Status: ${data.status}`);
        }
        const studentAlign = await data.json();
        const classid = studentAlign[0]?.Class_id?._id;
        setClassName(studentAlign[0]?.Class_id?.name);
        setSectionName(studentAlign[0]?.section_id?._id);

        const subs = await fetch(
          `${SERVER}/subject/getSubjectClass/${classid}`,
          {
            credentials: "include",
          }
        );

        if (!subs.ok) {
          throw new Error(`HTTP error! Status: ${subs.status}`);
        }

        const subjects = await subs.json();
        setSubjects(subjects.data);
      }
      if (type === "teacher") {
        getTeacher();
      }
    };
    fetchInfo();
  }, []);

  const tableHeader = {
    id: "ID",
    class_name: "Class",
    section_name: "Section",
    subject: "Subject",
    Progress: "View",
  };

  const getTeacher = () => {
    fetch(`${SERVER}/ClassTeacher/getSubTeachers`, { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let nResD = data.data.reduce((acc, crr, idx) => {
          //   console.log(crr);
          acc.push({
            _id: crr._id,
            class_name: crr.class_id["name"],
            section_name: crr.section_id.name,
            subject: crr.subject_id.name,
          });
          return acc;
        }, []);
        setSubjectTeacher(nResD);
      })
      .catch((err) => console.error("Error fetching Subject Teacher:", err));
  };

  const handleClick = async () => {};
  return (
    <div>
      <h2
        className="fw-bold mb-0 text-primary"
        style={{ paddingBottom: "20px" }}
      >
        Class Progress
      </h2>

      {userType === "student" && (
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>ID</th>
              <th>Class</th>
              <th>Subject</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((ele, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{className}</td>
                <td>{ele.name}</td>
                <td>
                  <Link
                    to={`/classflow/student/${ele._id}`}
                    state={sectionName}
                  >
                    <AiOutlineEye />
                  </Link>
                </td>
                {/* <td><button className="btn btn-primary">View</button></td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {userType === "teacher" && (
        <div className="card">
          <Table2
            tableHeader={tableHeader}
            tableData={subjectTeacher}
            noOfCol={5}
            view={1}
          />
        </div>
      )}

      {userType === "admin" && <AdminClassFlow />}
    </div>
  );
}

export const AdminClassFlow = () => {
  const [allteachers, setAllteachers] = useState([]);
  const [subjectTeacher, setSubjectTeacher] = useState([]);
  const [selectTeacher, setselectTeacher] = useState(null);

  const tableHeader = {
    id: "ID",
    class_name: "Class",
    section_name: "Section",
    subject: "Subject",
    Progress: "View",
  };

  const getAllTeachers = async () => {
    const { data } = await axios.get(`${SERVER}/ClassTeacher/getTeachers`, {
      withCredentials: true,
    });
    if (data.success) {
      setAllteachers(data.data);
    }
  };

  const getTeacher = (id) => {
    fetch(`${SERVER}/ClassTeacher/getSubTeachers?teacherid=${id}`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let nResD = data.data.reduce((acc, crr, idx) => {
          //   console.log(crr);
          acc.push({
            _id: crr._id,
            class_name: crr.class_id["name"],
            section_name: crr.section_id.name,
            subject: crr.subject_id.name,
          });
          return acc;
        }, []);
        setSubjectTeacher(nResD);
      })
      .catch((err) => console.error("Error fetching Subject Teacher:", err));
  };

  useEffect(() => {
    getAllTeachers();
  }, []);

  useEffect(() => {
    if (selectTeacher) {
      getTeacher(selectTeacher);
    }
  }, [selectTeacher]);

  return (
    <>
      <div className="card p-2">
        <div className="">
          <div className="row">
            <div className="col-6">
              <label htmlFor="formFileMultipleone" className="form-label">
                Teacher
              </label>
              <select
                className="form-select"
                aria-label="Default select Class"
                onChange={(e) => setselectTeacher(e.target.value)}
                name="class_id"
              >
                <option value="" defaultChecked>
                  Select Teacher
                </option>
                {allteachers.map((item, idx) => {
                  return (
                    <option
                      key={idx}
                      value={item._id}
                      selected={selectTeacher === item._id}
                    >
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card mt-3">
        <Table2
          tableHeader={tableHeader}
          tableData={subjectTeacher}
          noOfCol={5}
          view={1}
        />
      </div>
    </>
  );
};
