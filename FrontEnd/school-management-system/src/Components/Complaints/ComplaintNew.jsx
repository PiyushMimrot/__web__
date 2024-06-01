import { useEffect, useState } from "react";
import { SERVER } from "../../config";
import Addbutton from "../../utils/AddButton/Addbutton";
import { InstilTable, TableState } from "../MainComponents/InstillTable";
import { AiOutlineEye, AiFillEyeInvisible } from "react-icons/ai";
import AddComplaint from "./AddComplaint";
import { useNavigate } from "react-router-dom";
import { getTypeToken } from "../../Context/localStorage";
import moment from "moment";
import AddQuery from "./AddQuery";

export default function ComplaintNew() {
  const [staffType, setStaffType] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [filterComplains, setfilterComplains] = useState([]);
  const [allComplains, setAllComplains] = useState([]);
  const [allquery, setallquery] = useState([]);
  // const [viewC, setViewC] = useState({});
  const [parents, setParents] = useState([]);
  const type = getTypeToken();
  const [getComplains, setGetComplains] = useState([]);
  const [hideAnony, setHideAnony] = useState(1);
  const [tableState, setTableState] = useState(TableState.LOADING);
  const nav = useNavigate();

  useEffect(() => {
    (async () => {
      setTableState(TableState.LOADING);
      await getStaffType();
      await getAdmin();
      // if (type !== "admin") {
      await getComplaint();
      // }
      await getParents();
      // await complainsReceived();
      setTableState(TableState.SUCCESS);
    })();
  }, []);

  const getAdmin = async () => {
    fetch(SERVER + `/schoolAdmin`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setAdmin(data[0]));
  };

  const getParents = async () => {
    fetch(SERVER + `/studentparent/fetchParent`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setParents(data));
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

  const getComplaint = async () => {
    try {
      await fetch(SERVER + "/complain/myComplains", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          let { complaints, id } = data;
          // complaints = complaints.filter(
          //   (item) => item.complainFor[0].forId === id
          // );
          console.log(complaints);
          let update = complaints.filter((item) => item.queryStatus === true);
          setallquery(update);
          update = complaints.filter((item) => item.queryStatus === false);
          setAllComplains(update);
          setfilterComplains(update);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddComplaint = async (newComplain) => {
    const formData = new FormData();
    console.log(newComplain);

    if (newComplain["staffType_id"] !== "student") {
      let toId = admin["_id"];
      let category = "admin";
      formData.append("complainTo", JSON.stringify({ toId, category }));
    }

    try {
      for (const key in newComplain) {
        if (key === "complainOn") {
          formData.append("complainOn", JSON.stringify(newComplain[key]));
        } else if (key === "complainTo") {
          formData.append("complainTo", JSON.stringify(newComplain.complainTo));
        } else {
          formData.append(key, newComplain[key]);
        }
      }

      // console.log(formData);
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      await fetch(`${SERVER}/complain`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      getComplaint();
      // setStaffType([]);
    } catch (error) {
      console.error("Error creating material:", error);
    }
  };

  const handleShowAnony = (e) => {
    if (e.target.checked) {
      let complains = allComplains.filter((item) => item.isAnonymous === true);
      setfilterComplains(complains);
    } else {
      // console.log(allComplains);
      let complains = allComplains.filter((item) => item.isAnonymous === false);
      setfilterComplains([...complains]);
    }
  };

  const complainsReceived = async () => {
    try {
      await fetch(SERVER + "/complain/getComplains", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          setAllComplains(data);
          setGetComplains(data);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleGetComplaints = async (e) => {
    if (e.target.value === "ComplaintsRecieved") {
      setfilterComplains(getComplains);
    }
    if (e.target.value === "LodgedComplains") {
      setfilterComplains(allComplains);
    }
  };

  console.log(allComplains);
  console.log("------------");
  return (
    <div className="body py-lg-3 py-md-2">
      <div className="row align-items-center">
        <div className="border-0 mb-4">
          <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
            <div className="dropdown d-inline-flex m-1">
              <select
                className="btn btn-outline-primary dropdown-toggle"
                aria-label="Default select Student"
                onChange={handleGetComplaints}
                name="complainOn"
                role="button"
              >
                <option defaultValue>Select Type</option>
                {
                  <>
                    <option value={"LodgedComplains"}>Lodged Complains</option>
                    <option value={"ComplaintsRecieved"}>
                      Complaints Recieved
                    </option>
                    <option value={"Warnings"}>Warnings</option>
                  </>
                }
              </select>
            </div>
          </div>
        </div>
      </div>

      <ul
        class="nav nav-tabs justify-content-center fs-5 fw-bold"
        role="tablist"
      >
        <li class="nav-item" role="presentation">
          <a
            class="nav-link active text-primary"
            data-bs-toggle="tab"
            href="#fill-tabpanel-0"
            role="tab"
          >
            Complains
          </a>
        </li>
        <li class="nav-item" role="presentation">
          <a
            class="nav-link text-primary"
            data-bs-toggle="tab"
            href="#fill-tabpanel-1"
            role="tab"
          >
            {" "}
            Query{" "}
          </a>
        </li>
      </ul>
      <div class="tab-content" id="tab-content">
        <div
          class="tab-pane active"
          id="fill-tabpanel-0"
          role="tabpanel"
          aria-labelledby="fill-tab-0"
        >
          <div className="row clearfix g-3">
            <div className="">
              <div className="card mb-3">
                {type !== "admin" ? (
                  <div className="px-3">
                    <Addbutton
                      title={"Complaint"}
                      buttonTitle={"Add Complaint"}
                      formId={"addComplaint"}
                    />
                  </div>
                ) : (
                  <h3 className="text-primary fw-bold p-2">Complaints</h3>
                )}

                <div className="card-body pt-0">
                  <div className="form-check form-switch theme-switch">
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

                  <InstilTable
                    tableState={tableState}
                    titles={[
                      "Sr No",
                      "Date",
                      "View",
                      "Status",
                      "Read",
                      "Complain On",
                    ]}
                    rows={filterComplains.map((item, idx) => ({
                      "Sr No": (
                        <p className="fw-bold text-secondary">{idx + 1}</p>
                      ),
                      Date: moment(item.dateCreated).format("D MMM"),
                      View: (
                        <button
                          type="button"
                          className="btn btn-outline-info"
                          data-bs-toggle="modal"
                          onClick={() => nav(`/complaints/${item._id}`)}
                        >
                          View
                        </button>
                      ),
                      Status: item.complainStatus ? (
                        <span className="badge bg-success">Solved</span>
                      ) : (
                        "Unsolved"
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
                        item.complainOn.length > 0
                          ? item.complainOn[0]["category"]
                          : "Query",
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ----------------------------------query-------------------------- */}
        <div
          class="tab-pane"
          id="fill-tabpanel-1"
          role="tabpanel"
          aria-labelledby="fill-tab-1"
        >
          <div className="row clearfix g-3">
            <div className="">
              <div className="card mb-3">
                {type !== "admin" ? (
                  <div className="px-3">
                    <Addbutton
                      title={"Queries"}
                      buttonTitle={"Ask Query"}
                      formId={"addQuery"}
                    />
                  </div>
                ) : (
                  <h3 className="text-primary fw-bold p-2">Query</h3>
                )}
                <div className="card-body pt-0">
                  <InstilTable
                    tableState={tableState}
                    titles={["Sr No", "Date", "View", "Status", "Read"]}
                    rows={allquery.map((item, idx) => ({
                      "Sr No": (
                        <p className="fw-bold text-secondary">{idx + 1}</p>
                      ),
                      Date: moment(item.dateCreated).format("D MMM"),
                      View: (
                        <button
                          type="button"
                          className="btn btn-outline-info"
                          data-bs-toggle="modal"
                          onClick={() => nav(`/complaints/${item._id}`)}
                        >
                          View
                        </button>
                      ),
                      Status: item.complainStatus ? (
                        <span className="badge bg-success">Solved</span>
                      ) : (
                        "Unsolved"
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
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddComplaint
        formId={"addComplaint"}
        title={"Add Complaint"}
        staffType={staffType}
        handleAddComplaint={handleAddComplaint}
        admin={admin}
        parents={parents}
      />
      <AddQuery
        formId={"addQuery"}
        title={"Add Query"}
        staffType={staffType.length === 0 ? null : staffType}
        handleAddComplaint={handleAddComplaint}
        admin={admin}
        parents={parents}
      />
    </div>
  );
}
