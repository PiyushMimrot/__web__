import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Addbutton from "../../utils/AddButton/Addbutton";
import { SERVER } from "../../config";
import ChakraUiTable from "../ChakraUiTable/ChakraUiTable";
import AskDoubtModal from "./AskDoubtModal";
import { InstilTable, TableState } from "../MainComponents/InstillTable";
import { AiOutlineEye, AiFillDelete } from "react-icons/ai";

import ViewDoubt from "./ViewDoubt";
import ViewStudentDoubt from "./ViewStudentDoubt";
function StudentDoubt() {
  const [doubts, setDoubts] = useState([]);
  const [view, setView] = useState({});
  const [Staff, SetStaffs] = useState([]);
  const [Students, setStudents] = useState([]);
  const type = localStorage.getItem("type");
  const [tableState, setTableState] = useState(TableState.LOADING);
  const [showRating, setShowRating] = useState(false);

  const Staffs = async () => {
    try {
      const response = await fetch(
        `${SERVER}/StudentDoubt/studentClassTeacher`,
        { credentials: "include" }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setStudents(data.data.studentDetail);
          SetStaffs(data.data.teachers);
        });
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };

  const [Editdata, setEdit] = useState(null);

  //(doubts, "this is line number 147 ")
  useEffect(() => {
    (async () => {
      setTableState(TableState.LOADING);
      await fetchMaterials();
      await Staffs();
      setTableState(TableState.SUCCESS);
    })();

    // fetchstudents()
  }, []);

  const fetchMaterials = async () => {
    try {
      const response = await fetch(`${SERVER}/StudentDoubt/student-doubts`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setDoubts(data));
    } catch (error) {
      console.error("Error fetching materials:", error);
    }
  };
  console.log(doubts);
  const handleDownload = async (material) => {
    try {
      const response = await axios.get(
        `${SERVER}/StudentDoubt/student-doubts/download/${material}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = material.doc_path;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEdit((prevMaterial) => ({
      ...prevMaterial,
      [name]: value,
    }));
  };

  const handleEditFileInputChange = (event) => {
    const { name, files } = event.target;
    const file = files[0];
    setEdit((prevMaterial) => ({
      ...prevMaterial,
      [name]: file,
    }));
  };

  // Submit new edit form data
  const updateData = async (editData) => {
    await fetch(SERVER + `/StudentDoubt/studentdoubts/${editData._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editData),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the JSON response
      })
      .then(() => fetchMaterials())
      .catch((error) => {
        // Handle errors here
        console.error("Error updating material:", error);
      });
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    //(Editdata, "line 104")
    updateData(Editdata);
  };

  // Delete a item by id
  const handleDoubtDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios
            .delete(`${SERVER}/StudentDoubt/deleteDoubt/${id}`, {
              withCredentials: true,
            })
            .then((res) => {
              if (res.data.success) {
                Swal.fire({
                  title: "Success",
                  text: "Doubt deleted successfully",
                  icon: "success",
                  confirmButtonText: "Ok",
                });
                fetchMaterials();
              } else {
                Swal.fire({
                  title: "Try Again",
                  icon: "info",
                  confirmButtonText: "Ok",
                });
              }
            });
        } catch (error) {
          console.error("Error deleting material:", error);
        }
        //(`Edit clicked for item with ID: ${id}`);
      }
      //(`Edit clicked for item with ID: ${id}`);
    });
  };

  //(newMaterial)

  const handleSubmit = async (newDoubt) => {
    console.log(Students);
    newDoubt = {
      ...newDoubt,
      classId: Students.Class_id,
      sectionId: Students.section_id,
    };

    try {
      const formData = new FormData();
      for (const key in newDoubt) {
        formData.append(key, newDoubt[key]);
      }

      await fetch(`${SERVER}/StudentDoubt/student-doubts`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      fetchMaterials();
    } catch (error) {
      console.error("Error creating material:", error);
    }
  };
  const handleFileInputChange = (event) => {
    const { name, files } = event.target;
    const file = files[0];
    setNewMaterial((prevMaterial) => ({
      ...prevMaterial,
      [name]: file,
    }));
  };

  const checkFeedback = (e) => {
    const res = e.target.value;
    console.log(res);
    if (res === "Satisfied") {
      setShowRating(true);
    } else {
      // THIS FIELD HAS TO BE CODED TO INORDER TO OBTAIN RATING
      //THE IDEA OF THIS FIELD WAS TO VERIFY IF THE DOUBT HAS BEEN SATISFIED
      //IN FUTURE THERE SHOULD BE A CODE HERE WHICH DECIDES WHAT TO DO AFTER THE STUDENT IS NOT SATISFIED BY
      //THE CODE HAS TO BE WRITTEN WHICH
    }
  };

  const handleFeedback = async (e, doubt) => {
    if (e.target.value === "0") {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be marked as unsolved",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then(async (result) => {
        if (result.isConfirmed) {
          doubt.status = false;
          doubt.teacherId = doubt.teacherId._id;
          await updateData(doubt);
        }
      });
    } else {
      doubt.feedback = e.target.value;
      doubt.teacherId = doubt.teacherId._id;
      await updateData(doubt);
    }
  };
  return (
    <div>
      {type !== "parent" ? (
        <Addbutton
          title={"Student Doubt List"}
          buttonTitle={"Ask Doubt"}
          formId={"askDoubt"}
        />
      ) : (
        <h2
          className="fw-bold mb-0 text-primary"
          style={{ paddingBottom: "20px" }}
        >
          Your Student Doubts
        </h2>
      )}
      <InstilTable
        tableState={tableState}
        titles={["Sr. no", "Teacher", "View", "Status", "Feedback", "Action"]}
        rows={doubts.map((doubt, idx) => ({
          "Sr. no": idx + 1,
          Teacher: doubt.teacherId.name,
          View: (
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#viewDoubt"
              onClick={() => setView(doubt)}
            >
              <AiOutlineEye />
            </button>
          ),
          Status: doubt.status ? "solved" : "unsolved",
          Action: (
            <div>
              <button
                type="button"
                className="btn btn-outline-secondary deleterow"
                onClick={() => handleDoubtDelete(doubt._id)}
              >
                <AiFillDelete className="text-danger" />
              </button>
            </div>
          ),
          Feedback:
            doubt.status && !doubt.feedback ? (
              <select
                onChange={(e) => handleFeedback(e, doubt)}
                name="feedback"
                className="btn btn-info"
              >
                <option value="" defaultChecked>
                  feedback
                </option>
                <option value={0}>not-solved</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            ) : (
              [...Array(Number(doubt.feedback))].map((item, idx) => {
                return (
                  <i className="icofont-star text-warning fs-4" key={idx}></i>
                );
              })
            ),
        }))}
      />
      <AskDoubtModal
        title={"Ask Doubt"}
        formId={"askDoubt"}
        teachers={Staff}
        handleSubmit={handleSubmit}
      />
      {/* <ViewDoubt formId={"viewDoubt"} doubt={view} /> */}
      <ViewStudentDoubt formId={"viewDoubt"} doubt={view} type={"student"} />
    </div>
  );
}

export default StudentDoubt;
