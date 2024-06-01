import React, { useEffect, useState } from "react";
import { SERVER } from "../../config";
import Addbutton from "../../utils/AddButton/Addbutton";
import { InstilTable, TableState } from "../MainComponents/InstillTable";
import { AiOutlineEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { getTypeToken } from "../../Context/localStorage";
import moment from "moment";
import axios from "axios";
import AddComplaint from "./AddComplaint";
import Swal from "sweetalert2";
import { FaFileDownload } from "react-icons/fa";

const Complaint = () => {
  const type = getTypeToken();
  const [allcomplains, setallcomplains] = useState([]);
  const [filterComplains, setfilterComplains] = useState([]);
  const [annoymouscomplains, setannoymouscomplains] = useState(false);

  const [staffType, setStaffType] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [complainType, setcomplainType] = useState("ComplaintsRecieved");
  const [isSolvedComp, setisSolvedComp] = useState("All");

  const [tableState, setTableState] = useState(TableState.LOADING);

  const nav = useNavigate();

  const getComplaints = async () => {
    try {
      setTableState(TableState.LOADING);
      const { data } = await axios.get(`${SERVER}/complain/complaints`, {
        withCredentials: true,
      });
      if (data.success) {
        setallcomplains(data.data);
        setTableState(TableState.SUCCESS);

        let updatecomplains = data.data.filter(
          (item) => item.isAnonymous === false
        );
        setfilterComplains(updatecomplains);
      }
    } catch (error) {
      setTableState(TableState.ERROR);
      console.error("Error:", error);
    }
  };

  const LodgedComplaints = async () => {
    try {
      setTableState(TableState.LOADING);
      const { data } = await axios.get(`${SERVER}/complain/lodgedcomplaints`, {
        withCredentials: true,
      });
      if (data.success) {
        setallcomplains(data.data);
        setTableState(TableState.SUCCESS);

        let updatecomplains = data.data.filter(
          (item) => item.isAnonymous === false
        );
        setfilterComplains(updatecomplains);
      }
    } catch (error) {
      setTableState(TableState.ERROR);
      console.error("Error:", error);
    }
  };

  const handleShowAnony = (e) => {
    if (e.target.checked) {
      let complains = allcomplains.filter((item) => item.isAnonymous === true);
      setfilterComplains(complains);
    } else {
      let complains = allcomplains.filter((item) => item.isAnonymous === false);
      setfilterComplains(complains);
    }
    setannoymouscomplains(e.target.checked);
  };

  const getStaffType = async () => {
    try {
      await fetch(SERVER + "/staffmanage/getStaffType", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setStaffType(data.data));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getAdmin = async () => {
    try {
      await fetch(SERVER + `/schoolAdmin`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setAdmin(data.admins[0]));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddComplaint = async (newComplain) => {
    const formData = new FormData();
    try {
      if (newComplain.staffType_id !== "student") {
        let toId = admin["_id"];
        let category = "admin";
        newComplain.complainTo = { toId, category };
      }
      //   console.log(newComplain);

      for (const key in newComplain) {
        if (key === "complainTo") {
          formData.append("complainTo", JSON.stringify(newComplain.complainTo));
        } else if (key === "complainOn") {
          formData.append("complainOn", JSON.stringify(newComplain.complainOn));
        } else {
          formData.append(key, newComplain[key]);
        }
      }
      await fetch(`${SERVER}/complain/add/complaint`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            if (type === "student") {
              getComplaints();
            } else {
              setcomplainType("LodgedComplains");
              LodgedComplaints();
            }
            Swal.fire({
              title: "Success",
              text: "Complain Added Successfully",
              icon: "success",
              timer: 3000,
            });
          }
        });
    } catch (error) {
      console.error("Error creating material:", error);
    }
  };

  const ComplainTypeFunction = (e) => {
    let comType = e.target.value;
    setcomplainType(comType);
    console.log(comType);
    if (comType === "LodgedComplains") {
      LodgedComplaints();
    } else if (comType === "ComplaintsRecieved") {
      getComplaints();
    }
  };

  const ComplainSolvedTypeFunction = (e) => {
    let ctype = e.target.value;
    let update = [];
    if (ctype === "All") {
      update = allcomplains;
    } else if (ctype === "true") {
      update = allcomplains.filter((item) => item.complainStatus);
    } else if (ctype === "false") {
      update = allcomplains.filter((item) => !item.complainStatus);
    }
    setfilterComplains(update);
  };

  useEffect(() => {
    getComplaints();
    getStaffType();
    getAdmin();
  }, []);

  console.log(allcomplains);

  return (
    <>
      <div className="card">
        {type !== "admin" ? (
          <div className="px-3">
            <Addbutton
              title={"Complains"}
              buttonTitle={"Add Complaint"}
              formId={"addComplaint"}
            />
          </div>
        ) : (
          <h3 className="text-primary fw-bold p-3">Complains</h3>
        )}
      </div>

      <div className="d-flex bg-white mt-3 p-2 justify-content-between aligin-items-center">
        {(type === "teacher" || type === "parent") && (
          <div className=" d-inline-flex m-1">
            <select
              className="form-select"
              aria-label="Default select Student"
              onChange={ComplainTypeFunction}
            >
              <option value="" disabled={true}>
                Select Type
              </option>
              {
                <>
                  <option
                    value={"LodgedComplains"}
                    selected={complainType === "LodgedComplains"}
                  >
                    Lodged Complains
                  </option>
                  <option
                    value={"ComplaintsRecieved"}
                    selected={complainType === "ComplaintsRecieved"}
                  >
                    Complaints Recieved
                  </option>
                  {/* <option
                    value={"Warnings"}
                    selected={complainType === "Warnings"}
                  >
                    Warnings
                  </option> */}
                </>
              }
            </select>
          </div>
        )}

        <div className=" d-inline-flex m-1">
          <select
            className="form-select"
            aria-label="Default select Student"
            onChange={ComplainSolvedTypeFunction}
          >
            <option value="" disabled={true}>
              Select Status
            </option>
            {
              <>
                <option value={"All"} selected={isSolvedComp === "All"}>
                  All Status
                </option>
                <option value={true} selected={isSolvedComp === true}>
                  Solved
                </option>
                <option value={false} selected={isSolvedComp === false}>
                  Un-Solved
                </option>
              </>
            }
          </select>
        </div>

        <div className="form-check form-switch theme-switch mt-2">
          <label className="form-label">
            <strong>Anonymous Complaints</strong>
          </label>
          <input
            className="form-check-input"
            type="checkbox"
            id="theme-switch"
            onChange={handleShowAnony}
          />
        </div>
      </div>

      <div className="pt-0">
        <InstilTable
          tableState={tableState}
          titles={[
            "Sr No",
            "Title",
            "Date",
            "Status",
            "Read",
            "Complain On",
            "View",
          ]}
          rows={filterComplains.map((item, idx) => ({
            "Sr No": <p className="fw-bold text-secondary">{idx + 1}</p>,
            Title: item.complainTitle,
            Date: moment(item.dateCreated).format("D MMM"),
            View: (
              <button
                type="button"
                className="btn btn-outline-primary"
                data-bs-toggle="modal"
                onClick={() => nav(`/complaints/${item._id}`)}
              >
                View
              </button>
            ),
            Status: item.complainStatus ? (
              <span className="badge bg-success">Solved</span>
            ) : (
              <span className="badge bg-danger">Unsolved</span>
            ),
            Read: item.isReaded ? (
              <span style={{ fontSize: "large" }}>
                <AiOutlineEye />
              </span>
            ) : (
              <span style={{ fontSize: "large" }}>
                <AiFillEyeInvisible />
              </span>
            ),
            "Complain On":
              item.complainOn.length > 0 && item.complainOn[0]["category"],
          }))}
        />
      </div>

      <AddComplaint
        formId={"addComplaint"}
        title={"Add Complaint"}
        staffType={staffType}
        handleAddComplaint={handleAddComplaint}
        admin={admin}
        // parents={parents}
      />
    </>
  );
};

export default Complaint;
