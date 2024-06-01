import axios from "axios";
import { useEffect, useState } from "react";
import { SERVER } from "../../../../config";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";

import AddXchargesform from "./AddXchargesform";
import Addbutton from "../../../../utils/AddButton/Addbutton";
import Card from "../../../../utils/Card/Card";
import Swal from "sweetalert2";
import { InstilTable } from "../../../MainComponents/InstillTable";
import moment from "moment";

export default function Extracharges() {
  const [xChargeInfo, setXchargeInfo] = useState([]);
  const [edit, setEdit] = useState();
  const [feeCollectType, setFeeCollectType] = useState(false);
  const [feeCollectStatus, setFeeCollectStatus] = useState(false);
  const [classes, setClasses] = useState([]);
  const [editStatus, setEditStatus] = useState("");

  const tableHeader = {
    id: "ID",
    class_name: "Class",
    value: "Amount",
    date: "Date",
    action: "Action",
  };

  const fetchXCharge = () => {
    fetch(SERVER + "/xtraCharges", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setXchargeInfo(data));
  };

  const currentTypeStatus = async () => {
    const statusData = await fetch(`${SERVER}/feeCollectType`, {
      credentials: "include",
    });
    if (!statusData.ok) {
      throw new Error(`HTTP error! Status: ${statusData.status}`);
    }
    const { status } = await statusData.json();
    setFeeCollectStatus(status);
  };

  useEffect(() => {
    currentTypeStatus();
    fetchXCharge();
    getFeeCollectType();
    getClasses();
  }, []);

  const getClasses = () => {
    fetch(SERVER + "/classes/allClasses", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setClasses(data);
      });
  };

  const getFeeCollectType = () => {
    fetch(SERVER + "/feeCollectType", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setFeeCollectType(data[0]);
        setFeeCollectStatus(data[0].status);
      });
  };

  const postFeeCollectType = (newStatus) => {
    fetch(`${SERVER}/feeCollectType/${newStatus._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newStatus),
      credentials: "include",
    });
    getFeeCollectType();
  };

  const addXCharges = async (newCharges) => {
    // console.log({ ...newCharges, status: feeCollectStatus });
    try {
      await axios.post(
        SERVER + "/xtraCharges",
        { ...newCharges, status: feeCollectStatus },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Error adding charges:", error);
    }

    fetchXCharge();
    Swal.fire({
      title: "Success",
      text: "Class fee Added Successfully",
      icon: "success",
      timer: 3000,
    });
  };

  const editXCharge = async (item) => {
    for (let key in item) {
      if (item[key] !== "") {
        edit[key] = item[key];
      }
    }

    let updateData = { ...edit };

    try {
      await axios.put(SERVER + `/xtraCharges/${edit._id}`, updateData, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error updating Extra Charge:", error);
    }
    setEdit({});
    Swal.fire({
      title: "Success",
      text: "Class fee Edited Successfully",
      icon: "success",
      timer: 3000,
    });
    fetchXCharge();
  };

  const deleteXCharge = (id) => {
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
            .delete(SERVER + `/xtraCharges/${id}`, { withCredentials: true })
            .then(() => fetchXCharge());
        } catch (error) {
          console.error("Error deleting Extra Charge:", error);
        }

        Swal.fire("Deleted!", "Class fee has been deleted.", "success");
      }
    });
  };

  const handleChange = async (e) => {
    console.log(e.target.checked, "checked");

    if (e.target.checked && xChargeInfo.length) {
      Swal.fire({
        title: "Are you sure?",
        text: "All class fees will be deleted !",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          //   console.log("delete all");
          try {
            axios
              .delete(SERVER + `/xtraCharges/deleteAll/all`, {
                withCredentials: true,
              })
              .then(() => fetchXCharge());
          } catch (error) {
            console.error("Error deleting Extra Charge:", error);
          }

          Swal.fire("Deleted!", "Class fee has been deleted.", "success");
        }
      });
    }

    try {
      setFeeCollectStatus(e.target.checked);
      const feeTypeData = await fetch(`${SERVER}/feeCollectType`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: e.target.checked }),
      });
      if (!feeTypeData.ok) {
        throw new Error(`HTTP error! Status: ${feeTypeData.status}`);
      }
      const feeType = await feeTypeData.json();
      //   console.log(feeType, "feeType");
    } catch (error) {
      console.log(error);
    }

    // console.log(feeCollectType);
    if (feeCollectType) {
      feeCollectType.status = e.target.checked;
      postFeeCollectType(feeCollectType);
    }
  };

  return (
    <Card>
      <div>
        <Addbutton title="Class Fees" buttonTitle="" formId="addXCharges" />
        {/* <div className="d-flex">
          <p>Is class fee same ?</p>
          <div className="form-check form-switch d-flex flex-row-reverse">
            <input
              className="form-check-input p-2"
              type="checkbox"
              id="flexSwitchCheckChecked"
              onChange={handleChange}
              checked={feeCollectStatus}
            />
          </div>
        </div> */}
        {/* <InstilTable
          titles={["ID", "Class", "Amount", "Date", "Action"]}
          rows={xChargeInfo.map((item, idx) => [
            idx + 1,
            item.class_name ? item.class_name.name : "All",
            item.value,
            item.date.split("T")[0],
            <div key={idx}
              className="btn-group"
              role="group"
              aria-label="Basic outlined example"
            >
              <button
                type="button"
                className="btn btn-outline-secondary"
                data-bs-toggle="modal"
                data-bs-target={"#editXCharge"}
                onClick={() => {
                  setEdit(item);
                  setEditStatus(item.status)
                }}
              >
                <AiFillEdit />
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary deleterow"
                onClick={() => {
                  deleteXCharge(item._id);
                }}
              >
                <AiFillDelete className="text-danger" />
              </button>
            </div>,
          ])}
        /> */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Class</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {xChargeInfo.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{item.class_name ? item.class_name.name : "All"}</td>
                <td>{item.value}</td>
                {/* <td>{item.date.split("T")[0]}</td> */}
                <td>{moment(item.date).format("DD/MM/YYYY")}</td>
                <td>
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Basic outlined example"
                  >
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      data-bs-toggle="modal"
                      data-bs-target={"#editXCharge"}
                      onClick={() => {
                        setEdit(item);
                        setEditStatus(item.status);
                      }}
                    >
                      <AiFillEdit />
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary deleterow"
                      onClick={() => {
                        deleteXCharge(item._id);
                      }}
                    >
                      <AiFillDelete className="text-danger" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* <Table2 tableHeader={tableHeader} tableData={xChargeInfo} editTarget='editXCharge' editFunc={setEdit} deleteFunc={deleteXCharge} noOfCol={5} /> */}
        <AddXchargesform
          formId="addXCharges"
          handleXCharge={addXCharges}
          title="Add New Class Fees"
          feeCollectSts={feeCollectStatus}
          classes={classes || []}
        />
        <AddXchargesform
          formId="editXCharge"
          handleXCharge={editXCharge}
          title="Edit Class Fees"
          feeCollectSts={editStatus}
          classes={classes || []}
        />
      </div>
    </Card>
  );
}
