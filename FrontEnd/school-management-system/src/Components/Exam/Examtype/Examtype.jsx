import { useEffect, useState } from "react";
import { SERVER } from "../../../config";
import axios from "axios";
import Addbutton from "../../../utils/AddButton/Addbutton";
import Table2 from "../../MainComponents/Table2";
import Examtypeform from "./ExamtypeForm";
import Swal from "sweetalert2";

export default function Examtype() {
  const [examtypeData, setExamtypeData] = useState([]);
  const [edit, setEdit] = useState();

  const tableHeader = { id: "ID", exam_name: "Exam Name", action: "Action" };

  const fetchExamtype = () => {
    fetch(SERVER + "/examtype", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setExamtypeData(data));
  };

  useEffect(() => {
    fetchExamtype();
  }, []);

  const handleAddExamtype = async (data) => {
    let newExamtype = { exam_name: data };
    let regExp = /^(?!\s)[\w\s-]*$/;
    // console.log(regExp.test(data));
    if (regExp.test(data)) {
      try {
        await axios.post(SERVER + "/examtype", newExamtype, {
          withCredentials: true,
        });
      } catch (error) {
        console.error("Error adding session:", error);
      }

      Swal.fire({
        title: "Success",
        text: "Exam Type Added Successfully",
        icon: "success",
        timer: 3000,
      });
      fetchExamtype();
    } else {
      Swal.fire({
        text: "Enter Exam Type",
        icon: "info",
        timer: 3000,
      });
    }
  };

  const editExamtype = async (item) => {
    let updateData = { ...edit, exam_name: item };

    try {
      await axios.put(SERVER + `/examtype/${edit._id}`, updateData, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error updating Exam type:", error);
    }

    Swal.fire({
      title: "Success",
      text: "Exam Type Edited Successfully",
      icon: "success",
      timer: 3000,
    });
    fetchExamtype();
  };

  const deleteExamtype = async (id) => {
    // console.log(id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      try {
        axios.delete(SERVER + `/examtype/${id}`, { withCredentials: true });
      } catch (error) {
        console.error("Error deleting Exam type:", error);
      }

      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Exam Type has been deleted.", "success");
        fetchExamtype();
      }
    });
  };
  return (
    <div>
      <div className="card">
        <Addbutton
          title="Exam Type"
          buttonTitle="Add New exam type"
          formId="addExamType"
        />
      </div>

      <div className="card mt-3">
        <Table2
          tableHeader={tableHeader}
          tableData={examtypeData}
          noOfCol={3}
          deleteFunc={deleteExamtype}
          editFunc={setEdit}
          editTarget="editExamtype"
        />
      </div>
      <Examtypeform
        handleExamtype={handleAddExamtype}
        formId="addExamType"
        title="Add New Exam Type"
        examTypeD={{}}
      />
      <Examtypeform
        handleExamtype={editExamtype}
        formId="editExamtype"
        title="Edit Exam type"
        EditData={edit}
      />
    </div>
  );
}
