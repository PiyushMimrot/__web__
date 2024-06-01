import { useState, useEffect } from "react";
import { SERVER } from "../../../config";
import Addbutton from "../../../utils/AddButton/Addbutton.jsx";

import ClassesTable from "./ClassesTable";
import AddClassform from "./AddClassform";
import EditClasssform from "./EditClassform";
import Swal from "sweetalert2";
import { getTypeToken } from "../../../Context/localStorage.ts";

export default function Classes() {
  const [classInfo, setClassinfo] = useState([]);
  const [status, setStatus] = useState("");
  const [editClassData, setEditclassData] = useState("");
  // const [editClass,setEditclass] = useState('');
  const type = getTypeToken();

  useEffect(() => {
    if (type === "admin" || type === "Accountant") {
      fetch(SERVER + "/classes/allClasses", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          setClassinfo(data);
        });
    } else {
      fetch(SERVER + "/classes", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          setClassinfo(data);
        });
    }

    setTimeout(() => {
      setStatus("");
    }, 7000);
  }, [status]);

  const addClassdata = (newClassInfo) => {
    if (classInfo.some((item) => item.name === newClassInfo.name)) {
      Swal.fire({
        text: `Class ${newClassInfo.name} is already added`,
        icon: "info",
        timer: 3000,
      });
    } else {
      if (newClassInfo.name && newClassInfo.sections.length > 0) {
        fetch(SERVER + "/classes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newClassInfo),
          credentials: "include",
        })
          .then((response) => response.json())
          .then((data) => {
            Swal.fire({
              title: "Success",
              text: "Class Added Successfully",
              icon: "success",
              timer: 3000,
            });
            setStatus("success");
          })
          .catch((error) => {
            setStatus(error);
          });
      } else {
        if (!newClassInfo.name) {
          Swal.fire({
            text: "Enter Class Name",
            icon: "info",
            timer: 3000,
          });
        } else {
          Swal.fire({
            text: "Enter atleast 1 Section",
            icon: "info",
            timer: 3000,
          });
        }
      }
    }
  };

  const deleteClassData = (data) => {
    Swal.fire({
      title: `Are you sure to delete Class ${data.name}?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(SERVER + `/classes/${data._id}`, {
          method: "DELETE",
          credentials: "include",
        })
          .then((response) => response.json())
          .then((data) =>
            data.success
              ? setStatus(data.message)
              : Swal.fire({
                  text: data.message,
                  icon: "info",
                  timer: 3000,
                })
          )
          .catch((error) => {
            setStatus(error);
          });

        Swal.fire(
          "Deleted!",
          `Class ${data.name} has been deleted.`,
          "success"
        );
      }
    });
  };

  const getEditClass = (item) => {
    // console.log(id,'edit')
    setEditclassData(item);
  };

  const editClassName = (data) => {
    console.log(data);
    fetch(SERVER + `/classes/${editClassData._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setStatus("updated"));

    Swal.fire({
      title: "Success",
      text: "Class Edited Successfully",
      icon: "success",
      timer: 3000,
    });
  };

  // console.log(classInfo);

  return (
    <div>
      <div>
        {type === "admin" || type === "Accountant" ? (
          <div className="card px-3 mb-4">
            <Addbutton
              title="All Classes In Our School"
              buttonTitle="Add New Class"
              formId="addClass"
            />
          </div>
        ) : (
          <h2 className="fw-bold mb-0 text-primary">My Classes</h2>
        )}
        <div className="custom-bg">
          <ClassesTable
            classInfo={classInfo}
            deleteClass={deleteClassData}
            getEditClassId={getEditClass}
          />
        </div>
        <AddClassform formId="addClass" addClassdata={addClassdata} />
        <EditClasssform
          editId="editClass"
          editClass={editClassData}
          editClassName={editClassName}
          getEditClass={getEditClass}
        />
      </div>
    </div>
  );
}
