import { SERVER } from "../../config";
import { useState, useEffect } from "react";
import axios from "axios";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import moment from "moment";
import Addbutton from "../../utils/AddButton/Addbutton";
import Sessionform from "./Sessionform";
import Swal from "sweetalert2";
import { InstilTable } from "../MainComponents/InstillTable";

export default function Session() {
  const [sessionData, setSessionData] = useState([]);
  const [activeSession, setActiveSession] = useState({});
  const [edit, setEdit] = useState();
  // //(sessionData)

  useEffect(() => {
    getSession();
    getActiveSession();
  }, []);

  const getSession = async () => {
    fetch(SERVER + "/sessions", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setSessionData(data));
  };
  const getActiveSession = async () => {
    await axios
      .get(`${SERVER}/sessions/active`, { withCredentials: true })
      .then((res) => setActiveSession(res.data.data));
  };
  const checkSessionExist = (sessionD) => {
    // console.log(sessionD)
    let check = sessionData.filter((item) => {
      if (
        new Date(item.start_date).getFullYear() ===
        new Date(sessionD.start_date).getFullYear()
      ) {
        return item;
      }
    });
    return check.length ? false : true;
  };

  const handleAddSession = async (newSessionData) => {
    if (checkSessionExist(newSessionData)) {
      try {
        await axios.post(SERVER + "/sessions", newSessionData, {
          withCredentials: true,
        });
      } catch (error) {
        console.error("Error adding session:", error);
      }

      getSession();
      Swal.fire({
        title: "Success",
        text: "Session Added Successfully",
        icon: "success",
        timer: 3000,
      });
    } else {
      Swal.fire({
        text: "Session Already Exist",
        icon: "info",
        timer: 3000,
      });
    }
  };
  const handleEditSession = async (updateData) => {
    // updateData={...edit,...updateData};
    console.log(updateData);
    try {
      await axios.put(SERVER + `/sessions/${edit._id}`, updateData, {
        withCredentials: true,
      });
      getSession();
      getActiveSession();
    } catch (error) {
      console.error("Error updating session:", error);
    }
    Swal.fire({
      title: "Success",
      text: "Session Edited Successfully",
      icon: "success",
      timer: 3000,
    });
  };

  const handleDeleteSession = (id, sessionName) => {
    Swal.fire({
      title: `Are you sure you want to delete this session (${sessionName})?`,
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
            .delete(SERVER + `/sessions/${id}`, { withCredentials: true })
            .then(() => {
              getSession();
            });
        } catch (error) {
          console.error("Error deleting session:", error);
        }

        Swal.fire("Deleted!", "Session has been deleted.", "success");
      }
    });
  };

  const handleClick = async (id) => {
    if (
      moment().isBetween(
        moment(activeSession?.start_date),
        moment(activeSession?.end_date)
      )
    ) {
      Swal.fire("Can not change status while in the session");
    } else {
      await axios
        .get(`${SERVER}/sessions/update/` + id, { withCredentials: true })
        .then((res) => {
          if (res.data.success) {
            Swal.fire("Successfully changed the active state!");
            getSession();
          } else {
            Swal.fire("Try again later!");
          }
        });
    }
  };

  return (
    <div>
      <div className="card px-3 mb-4 pt-2">
        <Addbutton
          title="Sessions"
          buttonTitle="Add New Session"
          formId="addSession"
        />
      </div>
      <div className="table-responsive custom-bg rounded-3">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">SESSION</th>
              <th scope="col">STATUS</th>
              <th scope="col">DATE</th>
              <th scope="col">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {sessionData?.map((item, idx) => {
              return (
                <tr key={idx}>
                  <th scope="row">{idx + 1}</th>
                  <td>{item.session_name} </td>
                  <td>
                    <div className=" form-switch row d-flex justify-content-center align-items-center">
                      <input
                        onClick={() => handleClick(item._id)}
                        disabled={item?.active ? true : false}
                        className="form-check-input btn-lg "
                        type="checkbox"
                        id="flexSwitchCheckChecked"
                        checked={item?.active ? true : false}
                      />
                    </div>
                  </td>
                  {/* <td>{(item.date).toString().split('T')[0]}</td> */}
                  <td>
                    {item.start_date} - {item.end_date}
                  </td>
                  <th
                    className="btn-group"
                    role="group"
                    aria-label="Basic outlined example"
                  >
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#editSession"
                      onClick={() => setEdit(item)}
                    >
                      <AiFillEdit />
                    </button>
                    <button
                      type="button"
                      style={{ display: item?.active ? "none" : "" }}
                      className="btn btn-outline-secondary deleterow"
                      onClick={() =>
                        handleDeleteSession(item._id, item?.session_name)
                      }
                    >
                      <AiFillDelete className="text-danger" />
                    </button>
                  </th>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Sessionform
        formId="addSession"
        handleSession={handleAddSession}
        sessionData={{}}
        setSessionData={{}}
      />
      <Sessionform
        formId="editSession"
        handleSession={handleEditSession}
        sessionData={edit || {}}
        setSessionData={setEdit || {}}
      />
    </div>
  );
}
