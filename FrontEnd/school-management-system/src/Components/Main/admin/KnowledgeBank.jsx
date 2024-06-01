import { useEffect, useRef, useState } from "react";
import "./admin.css";
import { SERVER } from "../../../config";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import axios from "axios";
import { RiFileExcel2Line } from "react-icons/ri";
import Accordion from "react-bootstrap/Accordion";
import Carousel from "react-multi-carousel";
import { IoMdAdd } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import ViewBank, { SupperAdminOption } from "./ViewBank";
import { BackDrop } from "../../../utils/popups/backdrop";
import Logo from "../../../utils/Adds/Logo.png";

const KnowledgeBank = () => {
  const currentType = localStorage.getItem("type");
  const [allClasses, setallClasses] = useState([]);
  const [allSubjects, setallSubjects] = useState([]);
  const [allChapters, setAllChapters] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [excelData, setExcelData] = useState();
  const [selection, setSelection] = useState("Class");
  const [success, setSuccess] = useState(false);
  const [currentTypeError, setcurrentTypeError] = useState({
    status: "good",
    msg: "Select a File!",
  });
  const [activeKey, setActiveKey] = useState(null); // Initialize activeKey with null
  const [allTopics, setAllTopics] = useState([]);
  const [reReq, setreReq] = useState(false);
  const [activeItems, setActiveItems] = useState({
    classId: "",
    subjectId: "",
    chapterId: "",
    topicId: "",
  });
  const [material, setMaterial] = useState(null);
  const [data, setData] = useState({
    title: "",
    desc: "",
    url: "",
    class_id: "",
    subject_id: "",
    chapter_id: "",
    topic_id: "",
  });
  const handleChapterSelect = async (chapterId) => {
    setActiveItems({ ...activeItems, chapterId: chapterId, topicId: "" });
    await axios
      .get(`${SERVER}/topic/gettopic/${chapterId}`, { withCredentials: true })
      .then((res) => setAllTopics(res.data));
  };
  const handleAllCollapse = () => {
    setActiveKey(null);
  };
  const fileInputRef = useRef(null);
  const materialInputRef = useRef(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch(`${SERVER}/class/getall`, {
          credentials: "include",
        });
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const data = await res.json();
        setallClasses(data);

        const result = await fetch(`${SERVER}/topic/getall`, {
          credentials: "include",
        });
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchInfo();
  }, [reReq]);
  const handleChapterExcel = async (file) => {
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const formattedData = data.reduce((acc, row, index) => {
          if (index === 0) {
            row.forEach((chapter) => {
              acc.push({ [chapter]: [] });
            });
          } else {
            row.forEach((cell, idx) => {
              if (acc[idx][data[0][idx]]) {
                acc[idx][data[0][idx]].push(cell);
              }
            });
          }
          return acc;
        }, []);
        await axios
          .post(
            `${SERVER}/chapter/addManyExcel`,
            { excelData: formattedData, subjectId: activeItems.subjectId },
            {
              withCredentials: true,
            }
          )
          .then(async (response) => {
            if (response.data.success) {
              await axios
                .get(`${SERVER}/chapter/getchapt/${activeItems.subjectId}`, {
                  withCredentials: true,
                })
                .then((res) => setAllChapters(res.data));
              handleAllCollapse();
              Swal.fire({
                title: "Success",
                text: "Chapter and Topics Added Successfully",
                icon: "success",
                timer: 3000,
              });
            } else {
              Swal.fire({
                title: "Try Again!",
                icon: "warning",
                timer: 3000,
              });
            }
          })
          .catch((error) => {
            console.error("Error sending data:", error);
            Swal.fire({
              title: "Try Again!",
              icon: "warning",
              timer: 3000,
            });
          });
      } catch (error) {
        console.error("Error processing Excel file:", error);
        Swal.fire({
          title: "Try Again!",
          icon: "warning",
          timer: 3000,
        });
      }
    };
    reader.readAsBinaryString(file);
  };
  const handleMaterialExcel = async (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        const result = json.map((i) => ({
          ...i,
          class_id: activeItems.classId,
          subject_id: activeItems.subjectId,
          chapter_id: activeItems.chapterId,
          topic_id: activeItems.topicId,
        }));
        if (result.length > 0) {
          try {
            axios
              .post(`${SERVER}/knowledgebank/addExcel`, result, {
                withCredentials: true,
              })
              .then((res) => {
                Swal.fire({
                  title: "Success",
                  text: "Successfully added Materials",
                  icon: "success",
                  timer: 3000,
                });
              });
          } catch (error) {
            Swal.fire({
              title: "Try Again!",
              icon: "warning",
              timer: 3000,
            });
          }
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };
  const handleClassSelect = async (Item) => {
    setActiveItems({
      classId: Item?._id,
      subjectId: "",
      chapterId: "",
      topicId: "",
    });
    await axios
      .get(`${SERVER}/subject/getsub/${Item?._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data) {
          setallSubjects(res.data);
        }
      });
  };
  const handleSubjectSelect = async (Item) => {
    setSelection("Chapter");
    setActiveItems({
      ...activeItems,
      subjectId: Item?._id,
      chapterId: "",
      topicId: "",
    });
    await axios
      .get(`${SERVER}/chapter/getchapt/${Item?._id}`, {
        withCredentials: true,
      })
      .then((res) => setAllChapters(res.data));
    handleAllCollapse();
  };
  const handleTopicSelect = async (item) => {
    setActiveItems({
      ...activeItems,
      topicId: item?._id,
    });
    await axios
      .get(`${SERVER}/knowledgebank/getbank/${item?._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setMaterials(res.data);
      });
    // .then(() => {
    //   if (currentType === "supperadmin") {
    //     let modal = new bootstrap.Modal(
    //       document.getElementById("maddterialModal")
    //     );
    //     modal.show();
    //   } else {
    //     let modal = new bootstrap.Modal(
    //       document.getElementById("materialModal")
    //     );
    //     modal.show();
    //   }
    // });
  };

  const handleExcelUpload = (selectedFile) => {
    const filecurrentTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    if (selectedFile) {
      setcurrentTypeError({ status: "good", msg: "Click on Upload" });
      setSuccess(true);

      const reader = new FileReader();
      reader.readAsBinaryString(selectedFile);
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { currentType: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        setExcelData(parsedData);
        console.log(parsedData);
      };
    } else {
      console.log("Please Select File");
      setSuccess(false);
    }
  };
  const submitFileUpload = async () => {
    // Classes
    await axios
      .post(
        `${SERVER}/excelknowledgebank`,
        { excelData },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        Swal.fire({
          title: "Success",
          text: "Student Sheet Added Successfully",
          icon: "success",
          timer: 3000,
        });
      });
  };
  const addHandleChange = (event) => {
    setData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  const addNewDocument = async () => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("desc", data.desc);
    formData.append("url", data.url);
    formData.append("class_id", data.class_id);
    formData.append("subject_id", data.subject_id);
    formData.append("chapter_id", data.chapter_id);
    formData.append("topic_id", data.topic_id);
    if (material) {
      formData.append("material", material);
    }
    await axios
      .post(`${SERVER}/knowledgebank/add`, formData, { withCredentials: true })
      .then((res) => {
        if (res.status === 201) {
          Swal.fire({
            title: "Successfully Added!",
            icon: "success",
            confirmButtonText: "Okay",
          });
          setData({
            title: "",
            desc: "",
            url: "",
            class_id: "",
            subject_id: "",
            chapter_id: "",
            topic_id: "",
          });
          setallSubjects([]);
          setAllChapters([]);
          setAllTopics([]);
          setMaterial(null);
          materialInputRef.current.value = "";
        } else {
          console.log("Bad");
        }
      });
  };
  return (
    <div>
      <div className="d-flex justify-content-end m-2 gap-3">
        {currentType === "supperadmin" && (
          <>
            <button
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#addModal"
            >
              Add New
            </button>
            <button
              className="btn btn-success text-white"
              data-bs-toggle="modal"
              data-bs-target="#mymodal"
            >
              <RiFileExcel2Line size={20} /> <e> Add Bulk</e>
            </button>
          </>
        )}
      </div>
      <div className="d-flex gap-3 pt-3 card px-3 justify-content-center">
        <div className="d-flex justify-content-between p-2">
          <h2 className="fw-bold text-primary">Your Knowledge Bank</h2>
          {selection !== "Class" && (
            <button
              className="btn btn-primary px-4"
              onClick={() => {
                setSelection("Class");
                setAllChapters([]);
                setAllTopics([]);
                setallSubjects([]);
              }}
            >
              <FaArrowRightArrowLeft />
            </button>
          )}
        </div>
      </div>
      {/* Class Cards */}
      {selection === "Class" && (
        <>
          <h5 className="my-3">Select Your Class</h5>
          <div className="d-flex flex-wrap gap-4 align-items-center justify-content-center py-3">
            {allClasses?.map((item) => (
              <button
                className="btn bg-white p-2 shadow-lg rounded-lg rounded d-flex flex-column align-items-center justify-content-center gap-4"
                style={{ width: 150 }}
                onClick={() => handleClassSelect(item)}
                data-bs-toggle="modal"
                data-bs-target="#subjectModal"
              >
                <img
                  // src="../src/utils/Adds/logo.png"
                  src={Logo}
                  height={100}
                  width={100}
                />
                <h4 className="fw-bold">{item?.class_name}</h4>
              </button>
            ))}
            {currentType === "supperadmin" && (
              <button
                className="btn bg-primary text-white p-2 shadow-lg rounded-lg rounded d-flex align-items-center justify-content-center"
                style={{ width: 150 }}
                data-bs-toggle="modal"
                data-bs-target="#addClass"
              >
                <IoMdAdd size={30} />
              </button>
            )}
          </div>
        </>
      )}
      {/* Chapter */}
      {selection === "Chapter" && (
        <>
          <h5 className="my-3">Select a Chapter</h5>
          <Accordion
            activeKey={activeKey}
            onSelect={(key) => setActiveKey(key)}
          >
            {allChapters?.map((item, index) => (
              <BootAccordion
                key={index}
                index={index}
                data={item}
                allTopics={allTopics}
                setAllTopics={setAllTopics}
                handleChapterSelect={handleChapterSelect}
                handleTopicSelect={handleTopicSelect}
                setActiveItems={setActiveItems}
                materials={materials}
                setMaterials={setMaterials}
              />
            ))}
          </Accordion>
          {currentType === "supperadmin" && (
            <div className="d-flex gap-3 justify-content-center">
              <button
                className="btn bg-primary text-white p-2 shadow-lg rounded-lg rounded mt-3"
                style={{ width: 150 }}
                data-bs-toggle="modal"
                data-bs-target="#addChapter"
              >
                <IoMdAdd size={30} />
              </button>
              <button
                className="btn bg-success text-white p-2 shadow-lg rounded-lg rounded mt-3"
                style={{ width: 150 }}
                data-bs-toggle="modal"
                data-bs-target="#chaptertopicexcel"
              >
                <RiFileExcel2Line size={30} />
              </button>
            </div>
          )}
        </>
      )}
      {/* Subject Modal */}
      <div
        class="modal fade"
        id="subjectModal"
        tabindex="-1"
        aria-labelledby="transparentModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content bg-transparent border-0">
            <div class="modal-body">
              <div className="d-flex flex-column gap-2">
                {allSubjects.length > 0 ? (
                  allSubjects?.map((item) => (
                    <button
                      className="btn btn-white text-black pt-4"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={() => {
                        handleSubjectSelect(item);
                      }}
                    >
                      <p className="text-center">{item?.subject_name}</p>
                    </button>
                  ))
                ) : (
                  <div
                    className="bg-white d-flex justify-content-center align-items-center rounded rounded-lg shadow-lg"
                    style={{ height: 200 }}
                  >
                    <h3>No Data!</h3>
                  </div>
                )}
                {currentType === "supperadmin" && (
                  <div className="d-flex justify-content-center">
                    <button
                      className="btn btn-primary text-white"
                      data-bs-toggle="modal"
                      data-bs-target="#addSubject"
                    >
                      <IoMdAdd size={30} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Excel Modal */}
      <ExcelModal
        formId="chaptertopicexcel"
        submitFileUpload={handleChapterExcel}
      />
      <ExcelModal
        formId="excelmaterialadd"
        // submitFileUpload={handleMaterialExcel}
        submitFileUpload={handleMaterialExcel}
      />
      {/* Add Modal */}
      <div
        class="modal fade"
        id="addModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Add Knowledgebank
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  name="title"
                  value={data.title}
                  onChange={addHandleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="url" className="form-label">
                  URL
                </label>
                <input
                  type="text"
                  value={data?.url}
                  className="form-control"
                  id="url"
                  onChange={addHandleChange}
                  name="url"
                />
              </div>
              <div className="mb-3 row d-flex">
                {/* Class */}
                <div className="col-sm-6">
                  <select
                    className="form-select"
                    aria-label="Default select Class"
                    onChange={(e) => {
                      handleClassSelect(e);
                      setData({ ...data, class_id: e.target.value });
                    }}
                    name="class_id"
                  >
                    <option defaultValue value={null}>
                      Select a Class
                    </option>
                    {allClasses?.map((item, idx) => {
                      return (
                        <option key={idx} value={item._id}>
                          {item.class_name}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {/* Subject */}
                <div className="col-sm-6">
                  <select
                    className="form-select"
                    aria-label="Default select Class"
                    onChange={(e) => {
                      handleSubjectSelect(e);
                      setData({ ...data, subject_id: e.target.value });
                    }}
                    name="class_id"
                  >
                    <option defaultValue value={null}>
                      Select a Subject
                    </option>
                    {allSubjects?.map((item, idx) => {
                      return (
                        <option key={idx} value={item._id}>
                          {item.subject_name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="mb-3 row d-flex">
                {/* Chapter */}
                <div className="col-sm-6">
                  <select
                    className="form-select"
                    aria-label="Default select Class"
                    onChange={(e) => {
                      handleChapterSelect(e.target.value);
                      setData({ ...data, chapter_id: e.target.value });
                    }}
                    name="class_id"
                  >
                    <option defaultValue value={null}>
                      Select a Chapter
                    </option>
                    {allChapters?.map((item, idx) => (
                      <option key={idx} value={item._id}>
                        {item.chapter_name}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Topic */}
                <div className="col-sm-6">
                  <select
                    className="form-select"
                    aria-label="Default select Class"
                    onChange={(e) => {
                      setData({ ...data, topic_id: e.target.value });
                    }}
                    name="topic_id"
                  >
                    <option defaultValue value={null}>
                      Select a Topic
                    </option>
                    {allTopics?.map((item, idx) => {
                      return (
                        <option key={idx} value={item._id}>
                          {item.topic_name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div>
                <input
                  type="file"
                  className="form-control"
                  ref={materialInputRef}
                  onChange={(e) => setMaterial(e.target.files[0])}
                />
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={addNewDocument}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Add Class */}
      <AddClass formId="addClass" reReq={reReq} setreReq={setreReq} />
      {/* Add Subject */}
      <AddSubject
        formId="addSubject"
        reReq={reReq}
        setreReq={setreReq}
        activeItems={activeItems}
      />
      <AddMultiple
        formId="addChapter"
        reReq={reReq}
        setreReq={setreReq}
        activeItems={activeItems}
        handleAllCollapse={handleAllCollapse}
        setItemData={setAllChapters}
      />
      <AddMultiple
        formId="addTopic"
        reReq={reReq}
        setreReq={setreReq}
        activeItems={activeItems}
        handleAllCollapse={handleAllCollapse}
        setItemData={setAllTopics}
      />
    </div>
  );
};

export default KnowledgeBank;

function BootAccordion({
  index,
  data,
  allTopics,
  handleChapterSelect,
  handleTopicSelect,
  setActiveItems,
  materials,
  setMaterials,
}) {
  const currentType = localStorage.getItem("type");
  return (
    <Accordion.Item eventKey={index}>
      <Accordion.Header onClick={() => handleChapterSelect(data?._id)}>
        <div className="d-flex align-items-center justify-content-between me-5 w-100">
          {data?.chapter_name}
        </div>
      </Accordion.Header>
      <Accordion.Body>
        <div className="row my-3 w-100">
          {allTopics?.map((item, index) => (
            <Topic
              item={item}
              key={index}
              handleTopicSelect={handleTopicSelect}
              setActiveItems={setActiveItems}
              materials={materials}
              setMaterials={setMaterials}
            />
          ))}
          {currentType === "supperadmin" && (
            <div className="col-3 d-flex justify-content-center gap-3 mx-3">
              <button
                className=" btn my-1 py-3 bg-primary shadow-lg text-white shadow-lg rounded"
                data-bs-toggle="modal"
                data-bs-target="#addTopic"
              >
                <IoMdAdd size={20} />
              </button>
            </div>
          )}
        </div>
      </Accordion.Body>
    </Accordion.Item>
  );
}
function Topic({
  item,
  setActiveItems,
  materials,
  setMaterials,
  handleTopicSelect,
}) {
  const currentType = localStorage.getItem("type");
  const [studentInFocus, setStudentInFocus] = useState({});

  return (
    <>
      <div
        className="col-3 d-flex justify-content-between align-items-center my-2 mx-3 p-2 rounded shadow-sm border border-primary"
        data-bs-toggle="modal"
        data-bs-target={currentType === "supperadmin" && "#maddterialModal"}
        onClick={() => {
          handleTopicSelect(item);
          if (currentType !== "supperadmin") {
            setStudentInFocus({ for: "material" });
          } else {
            setStudentInFocus({ for: "options" });
          }
        }}
      >
        {item?.topic_name}
      </div>
      {/* Material modal */}
      <div
        class="modal fade"
        id="materialModal"
        tabindex="-1"
        aria-labelledby="largeTransparentModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
          <div class="modal-content border-0 bg-transparent">
            <div className="modal-body">
              {materials?.length > 0 ? (
                <div className="d-flex gap-5">
                  <h2>{materials?.length}</h2>
                  {materials?.map((item, index) => (
                    <a
                      href={item?.url}
                      target="_blank"
                      className="shadow-lg rounded rounded-lg "
                      style={{ height: 250 }}
                    >
                      <div style={{ height: "75%", width: 200 }}>
                        <img
                          src={"assets/images/gallery/Logo.png"}
                          alt="..."
                          style={{ height: "100%", width: "100%" }}
                        />
                      </div>
                      <div
                        style={{ height: "25%" }}
                        className=" bg-primary text-white p-2"
                      >
                        <div className="">
                          <div
                            style={{ fontSize: 12 }}
                            className="m-0 d-flex justify-content-end align-items-center"
                          >
                            <e>
                              <IoEyeOutline size={15} />
                            </e>
                            <e>2.5k</e>
                          </div>
                          <div className="d-flex flex-column ">
                            <p className="m-0" style={{ fontSize: 10 }}>
                              Title:
                            </p>
                            <h6
                              className="mb-0 text-capitalize"
                              style={{ fontSize: 15 }}
                            >
                              {item?.title}
                            </h6>
                          </div>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <div
                  className="d-flex bg-white justify-content-center align-items-center rounded rounded-lg shadow-lg"
                  style={{ height: 200 }}
                >
                  <h5>No Materials to show!</h5>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sampel */}
      <BackDrop show={studentInFocus.for === "options"}>
        <SupperAdminOption
          onClose={() => setStudentInFocus({})}
          setStudentInFocus={setStudentInFocus}
        />
      </BackDrop>
      <BackDrop show={studentInFocus.for === "material"}>
        <ViewBank
          onClose={() => setStudentInFocus({})}
          onSubmit={(item) => {
            console.log("Hello");
          }}
          materials={materials}
          // setCurrentStudent={setStudentInFocus}
        />
      </BackDrop>
    </>
  );
}

function AddClass({ formId, reReq, setreReq }) {
  const [newClass, setNewClass] = useState("");
  const handleClassAdd = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      `${SERVER}/class/add`,
      { class_name: newClass },
      { withCredentials: true }
    );
    if (res.data) {
      setreReq(!reReq);
      setNewClass("");
    }
  };
  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <form className="modal-content" onSubmit={handleClassAdd}>
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="addholidayLabel">
              {" "}
              Add New Class
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
                Class Name
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleFormControlInput1"
                placeholder="Enter New Class Name"
                name="name"
                value={newClass}
                onChange={(e) => setNewClass(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              disabled={newClass.trim() ? false : true}
              type="submit"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
function AddSubject({ formId, reReq, setreReq, activeItems }) {
  const [newSubject, setNewSubject] = useState("");
  const handleSubjectAdd = async (e) => {
    e.preventDefault();
    const res = await axios.post(
      `${SERVER}/subject/add`,
      { class_id: activeItems.classId, subject_name: newSubject },
      { withCredentials: true }
    );
    if (res.data) {
      setreReq(!reReq);
      setNewSubject("");
    }
  };
  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <form className="modal-content" onSubmit={handleSubjectAdd}>
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="addholidayLabel">
              {" "}
              Add New Subject
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
              <input
                type="text"
                className="form-control"
                id="exampleFormControlInput1"
                placeholder="Enter New Subject Name"
                name="name"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              disabled={newSubject.trim() ? false : true}
              type="submit"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
function AddMultiple({
  formId,
  reReq,
  setreReq,
  activeItems,
  setItemData,
  handleAllCollapse,
}) {
  const [newItems, setNewItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const handleMultiAdd = async (e) => {
    e.preventDefault();
    let transfromArray;
    if (formId === "addChapter") {
      transfromArray = newItems.map((item) => ({
        chapter_name: item,
        subject_id: activeItems.subjectId,
      }));
      const res = await axios.post(
        `${SERVER}/chapter/addMany`,
        transfromArray,
        {
          withCredentials: true,
        }
      );
      if (res.data) {
        await axios
          .get(`${SERVER}/chapter/getchapt/${activeItems.subjectId}`, {
            withCredentials: true,
          })
          .then((res) => setItemData(res.data));
        handleAllCollapse();
        setNewItems([]);
        setNewItem("");
      }
    }
    if (formId === "addTopic") {
      transfromArray = newItems.map((item) => ({
        topic_name: item,
        chapter_id: activeItems.chapterId,
      }));
      const res = await axios.post(`${SERVER}/topic/addMany`, transfromArray, {
        withCredentials: true,
      });
      if (res.data) {
        await axios
          .get(`${SERVER}/topic/gettopic/${activeItems.chapterId}`, {
            withCredentials: true,
          })
          .then((res) => setItemData(res.data));
        handleAllCollapse();
        setNewItems([]);
        setNewItem("");
      }
    }
  };
  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <form className="modal-content" onSubmit={handleMultiAdd}>
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="addholidayLabel">
              {" "}
              {formId === "addChapter" && "Add New Chapters"}
              {formId === "addTopic" && "Add New Topics"}
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
                {formId === "addChapter" && "Add Chapter"}
                {formId === "addTopic" && "Add Topic"}{" "}
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleFormControlInput1"
                placeholder={
                  formId === "addChapter"
                    ? "Enter New Chapter Name"
                    : "Enter New Topic Name"
                }
                name="name"
                value={newItem}
                onChange={(e) => {
                  setNewItem(e.target.value);
                }}
              />
            </div>
            <div className="d-flex flex-column">
              <div className="d-flex flex-wrap gap-2 p-2">
                {newItems?.map((item, index) => (
                  <button
                    className="rounded rounded-lg btn btn-info"
                    onClick={() => {
                      setNewItems(newItems.filter((i, idx) => idx !== index));
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setNewItems([...newItems, newItem]);
                  setNewItem("");
                }}
                disabled={newItem.trim() === ""}
              >
                Add
              </button>
            </div>
          </div>
          <div className="modal-footer">
            <button
              disabled={newItems.length ? false : true}
              type="submit"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
function ExcelModal({ formId, submitFileUpload }) {
  const fileInputRef = useRef(null);
  const handleClear = () => {
    fileInputRef.current.value = null;
  };
  return (
    <div
      class="modal fade"
      id={formId}
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              {formId === "chaptertopicexcel"
                ? " Add Chapter & its Topics"
                : "Add Materials"}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={handleClear}
            ></button>
          </div>
          <div class="modal-body">
            <input
              type="file"
              accept=".xlsx, .xls"
              className="form-control"
              ref={fileInputRef}
            />
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              onClick={() => {
                submitFileUpload(fileInputRef.current.files[0]);
                handleClear();
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
