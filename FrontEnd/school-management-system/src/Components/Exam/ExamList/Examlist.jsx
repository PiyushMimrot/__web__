import { useEffect, useState } from "react";
import { SERVER } from "../../../config";
import axios from "axios";
import Addbutton from "../../../utils/AddButton/Addbutton";
import Table2 from "../../MainComponents/Table2";
import Examlistform from "./Examlistform";
import EditExamlistform from "./EditExamlistform";
import Swal from "sweetalert2";
import { InstilTable, TableState } from "../../MainComponents/InstillTable";
import { AiFillEdit, AiFillDelete, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { AddNewExamListApi } from "./api";
import { FaFileUpload } from "react-icons/fa";
import moment from "moment";
import { getTypeToken } from "../../../Context/localStorage";
import { FaRegFileAlt } from "react-icons/fa";

const type = getTypeToken();

export default function Examtype() {
  const [examlistData, setExamlistData] = useState([]);
  const [filterexamlistData, setfilterExamlistData] = useState([]);

  const [examtype, setExamType] = useState([]);
  const [classes, setClasses] = useState([]);
  const [examSubject, setExamSubject] = useState([]);
  const [edit, setEdit] = useState();
  const [subjects, setSubjects] = useState();
  const [tableState, setTableState] = useState(TableState.LOADING);
  const [file, setFile] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState("");

  // filters usestates
  const [allclassess, setallclassess] = useState([]);
  const [selectedClass, setselectedClass] = useState("All");
  const [selectedExamType, setselectedExamType] = useState("All");

  const getClasses = async () => {
    if (type === "admin") {
      await fetch(SERVER + "/classes/allClasses", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setallclassess(data));
    } else {
      await fetch(SERVER + "/classes", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setClasses(data));
    }
  };

  const getExamlistData = () => {
    fetch(SERVER + "/examlist", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setfilterExamlistData(data);
        setExamlistData(data);
      });
  };

  const handleRequest = async () => {
    const request1 = await fetch(SERVER + "/examlist", {
      credentials: "include",
    }).then((res) => res.json());
    const request2 = await fetch(SERVER + "/examtype", {
      credentials: "include",
    }).then((res) => res.json());
    const request3 =
      type === "admin"
        ? await fetch(SERVER + "/classes/allClasses", {
          credentials: "include",
        }).then((res) => res.json())
        : await fetch(SERVER + "/classes", { credentials: "include" }).then(
          (res) => res.json()
        );
    const request4 = await fetch(SERVER + "/examSubject", {
      credentials: "include",
    }).then((res) => res.json());
    const request5 = await fetch(SERVER + "/subject/getTeacherSubject", {
      credentials: "include",
    }).then((res) => res.json());

    Promise.all([request1, request2, request3, request4, request5])
      .then(([data1, data2, data3, data4, data5]) => {
        setExamlistData(data1);
        setfilterExamlistData(data1);
        setExamType(data2);
        setClasses(data3);
        setExamSubject(data4);
        setSubjects(data5.data);
        setTableState(TableState.SUCCESS);
      })
      .catch((error) => {
        console.error(error);
        setTableState(TableState.ERROR);
      });
  };

  const AddSubject = (subjectData) => {
    console.log(subjectData, "sd");

    fetch(SERVER + "/examSubject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subjectData),
      credentials: "include",
    })
      .then((response) => {
        response.json();
        Swal.fire({
          title: "New Exam Added",
          text: "new exam is created successfully",
          icon: "success",
        });
      })
      .catch((error) => {
        console.error("Error adding Exam Subjects:", error);
      });
  };

  const AddExamList = async (newData, subjects, tMarks) => {
    // console.log(newData, ' ',subjects,' ',tMarks);

    newData = { ...newData };
    console.log(newData, "new");

    fetch(SERVER + "/examlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newData),
      credentials: "include",
    })
      .then((response) => response.json())
      .then((res) => {
        console.log(res._id, "resid");
        getExamlistData();

        AddSubject({
          subject: subjects,
          total_marks: tMarks,
          exam_id: res._id,
        });
      })
      .catch((error) => {
        alert(error);
        console.error("Error adding Examlist:", error);
      });
    //   const { data, success, status, error } = await AddNewExamListApi(newData);
    //   console.log(status);
    //   if (status === 400) {
    //     alert(error);
    //   } else {
    //     Swal.fire({
    //       title: "Success",
    //       text: "Exam Added Successfully",
    //       icon: "success",
    //       timer: 3000,
    //     });
    //   }
  };

  // opening the edit popup
  const openEditPopUp = async (id) => {
    const { data } = await axios.get(`${SERVER}/examlist/${id}`, {
      withCredentials: true,
    });
    if (data?._id) {
      let filterData = {
        _id: id,
        type: data.exam_type._id,
        name: data.exam_name,
        date: data.exam_date.slice(0, 10),
        time: data.exam_time,
        duration: Number(data.exam_duration),
        class: data.class_id._id,
        section: data.section_id.map((item) => ({
          label: item.name,
          value: item._id,
        })),
      };
      console.log(filterData);
      setEdit(filterData);
    }
  };

  const editExamlist = async (updatedD) => {
    let updateData = { ...updatedD };
    // console.log(updateData);

    try {
      await axios
        .put(SERVER + `/examlist/${edit._id}`, updateData, {
          withCredentials: true,
        })
        .then(() => getExamlistData());
    } catch (error) {
      console.error("Error updating Exam list:", error);
    }

    Swal.fire({
      title: "Success",
      text: "Exam Edited Successfully",
      icon: "success",
      timer: 3000,
    });
  };

  const handleDeleteExamlist = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          axios
            .delete(SERVER + `/examlist/${id}`, { withCredentials: true })
            .then(() => getExamlistData());
        } catch (error) {
          console.error("Error deleting Exam List:", error);
        }

        Swal.fire("Deleted!", "Exam has been deleted.", "success");
      }
    });
  };

  const handleResultStatus = async (exam) => {
    if (!exam.status) {
      exam.status = true;
    }
    try {
      // ${SERVER}/courseplatform/student/photo/${res.data[0]?.student_id?._id}
      const { data } = await axios.patch(
        SERVER +
        `/examlist/publishresult/${exam._id}?sections=${exam.section_id.length}`,
        null,
        { withCredentials: true }
      );
      if (data.success) {
        Swal.fire({
          title: "Success",
          text: "Exam Results Successfully Published",
          icon: "success",
          timer: 3000,
        });
        getExamlistData();
      }
    } catch (error) {
      console.error("Error updating Exam list:", error);
      Swal.fire({
        icon: "warning",
        title: "Oops...",
        text: error.response.data.message,
      });
    }
  };
  // console.log(examlistData);

  const titles = ["ID", "Name", "Exam Type", "Class", "Exam Date", "View"];
  if (type === "admin" || type === "teacher" ) {
    titles.push("Action", "");
  }
  if  (type === "student") {
    titles.push("Marksheet", "m");
  }

  //Upload
  const uploadTopperDocs = async (check) => {
    try {
      if (file) {
        const data = new FormData();
        const fileName = Date.now() + file?.name;
        data.append("name", fileName);
        data.append("file", file);

        // Uploading the file to the public/assignment folder
        const uploadResponse = await fetch(`${SERVER}/topperDocs/upload`, {
          method: "POST",
          credentials: "include",
          body: data,
        });
        if (!uploadResponse.ok) {
          throw new Error(`HTTP error! Status: ${uploadResponse.status}`);
        }

        const uploadData = await uploadResponse.json();
        console.log(uploadData, "file upload");

        if (uploadResponse.ok) {
          const uploadData = await fetch(
            `${SERVER}/examlist/uploadTopperDocs/addDocs`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                exam_id: selectedExamId,
                document: fileName,
              }),
            }
          );
          const uploaded = await uploadData.json();

          if (uploaded) {
            Swal.fire({
              icon: "success",
              title: "Success",
              showConfirmButton: false,
              timer: 1500,
            });
            setFile("");
            getExamlistData();

            // Subjects();
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // filter functions
  const filterByClass = (e) => {
    let selectClass = e.target.value;
    setselectedExamType("All");
    setselectedClass(selectClass);
    if (selectClass === "All") {
      setfilterExamlistData(examlistData);
    } else {
      let update = examlistData.filter(
        (item) => item?.class_id?._id === selectClass
      );
      setfilterExamlistData(update);
    }
  };
  const filterByExamType = (e) => {
    let selectexamtype = e.target.value;
    setselectedExamType(selectexamtype);
    setselectedClass("All");
    if (selectexamtype === "All") {
      setfilterExamlistData(examlistData);
    } else {
      let update = examlistData.filter(
        (item) => item?.exam_type?._id === selectexamtype
      );
      setfilterExamlistData(update);
    }
  };

  useEffect(() => {
    setTableState(TableState.LOADING);
    handleRequest();
    if (type === "admin" || type === "teacher") {
      getClasses();
    }
  }, []);
  console.log(examlistData);
  return (
    <div>
      {type === "admin" || type === "teacher" ? (
        <Addbutton
          title="Exam List"
          buttonTitle="Add new exam list"
          formId="addExamList"
        />
      ) : (
        <h2 className="fw-bold mb-0 text-primary">Exam List</h2>
      )}

      {/* filter */}

      <div className="card p-3">
        <div>
          <div className="row">
            {(type === "admin" || type === "teacher") && (
              <div className="col-6">
                <select
                  className="form-select"
                  aria-label="Default select Class"
                  onChange={filterByClass}
                  name="class_id"
                >
                  <option defaultChecked value={"All"}>
                    All Classes
                  </option>
                  {allclassess.map((item, idx) => {
                    return (
                      <option
                        key={idx}
                        value={item._id}
                        selected={selectedClass === item._id}
                      >
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            <div className="col-6">
              <select
                className="form-select"
                aria-label="Default select Class"
                onChange={filterByExamType}
                name="class_id"
              >
                <option defaultChecked value={"All"}>
                  All Types
                </option>
                {examtype.map((item, idx) => {
                  return (
                    <option
                      key={idx}
                      value={item._id}
                      selected={selectedExamType === item._id}
                    >
                      {item.exam_name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      </div>

      {type === "admin" || type === "teacher" ? (
        <InstilTable
          tableState={tableState}
          titles={titles}
          rows={filterexamlistData?.map((item, idx) => ({
            [titles[0]]: idx + 1,
            // [titles[1]]: item?.exam_name,
            [titles[1]]: <button type="button"
              className="btn btn-secondary" data-bs-toggle="tooltip"
              data-bs-placement="right"
              title={item?.exam_name}>
              {item?.exam_name}
            </button>,
            [titles[2]]: item?.exam_type?.exam_name,
            [titles[3]]: item?.class_id?.name,
            [titles[4]]: moment(item.exam_date).format("D MMM YYYY"),
            [titles[5]]: (
              <Link
                to={`${item._id}`}
                className=" btn btn btn-outline-primary "
              >
                <AiOutlineEye />
              </Link>
            ),
            [titles[6]]: (type === "admin" || type === "teacher") &&
              !item.status && (
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Basic outlined example"
                >
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    data-bs-toggle="modal"
                    data-bs-target={"#editExamlist"}
                    onClick={() => openEditPopUp(item._id)}
                  >
                    <AiFillEdit />
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary deleterow"
                    onClick={() => handleDeleteExamlist(item._id)}
                  >
                    <AiFillDelete className="text-danger" />
                  </button>
                </div>
              ),
            [titles[7]]:
              (type === "admin" || type === "teacher") && item.status ? (
                <button
                  className="btn btn-success"
                  disabled={item?.topperDocument ? true : false}
                  data-bs-toggle="modal"
                  data-bs-target={"#uploadTopperSheet"}
                  onClick={() => setSelectedExamId(item._id)}
                >
                  <FaFileUpload />
                </button>
              ) : (
                <button
                  className="btn btn-secondary"
                  onClick={() => handleResultStatus(item)}
                  disabled={item.status ? true : false}
                >
                  Publish
                </button>
              ),
          }))}
        />
      ) : (
        <InstilTable
          tableState={tableState}
          titles={titles}
          rows={filterexamlistData?.map((item, idx) => ({
            [titles[0]]: idx + 1,
            // [titles[1]]: item?.exam_name,
            [titles[1]]: <button type="button"
              className="btn btn-secondary" data-bs-toggle="tooltip"
              data-bs-placement="right"
              title={item?.exam_name}>
              {item?.exam_name}
            </button>,
            [titles[2]]: item.exam_type?.exam_name,
            [titles[3]]: item.class_id?.name,
            [titles[4]]: moment(item.exam_date).format("D MMM YYYY"),
            [titles[5]]: (
              <Link
                to={`${item._id}`}
                className=" btn btn btn-outline-primary "
              >
                <AiOutlineEye />
              </Link>
            ),
            [titles[6]]: (
              <button
                className="btn btn-success"
              // data-bs-toggle="modal"
              // data-bs-target={"#uploadTopperSheet"}
              >
                <FaRegFileAlt />
              </button>
            ),
          }))}
        />
      )}

      <Examlistform
        formId="addExamList"
        examType={examtype}
        classes={classes}
        subjectsD={subjects}
        handleExamlist={AddExamList}
        editData={{}}
      />
      <EditExamlistform
        formId="editExamlist"
        examType={examtype}
        classes={classes}
        handleExamlist={editExamlist}
        editData={edit || {}}
      />
      {/* Result */}
      {/* <ResultModal isOpen={true} /> */}

      <div
        className="modal fade"
        id="uploadTopperSheet"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Upload Topper Answer Sheet
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="input-group mb-3">
                {/* <label className="input-group-text" for="inputGroupFile01">
                  Upload
                </label> */}
                <input
                  type="file"
                  className="form-control"
                  id="inputGroupFile01"
                  accept=".pdf, .doc, .docx"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={(e) => {
                  e.preventDefault();
                  uploadTopperDocs("edit");
                }}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
