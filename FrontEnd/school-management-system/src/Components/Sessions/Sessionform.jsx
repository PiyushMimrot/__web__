import { useEffect, useState } from "react";
import { SERVER } from "../../config";

export default function Sessionform({
  formId,
  handleSession,
  sessionData,
  setSessionData,
}) {
  const [session_name, setSessionName] = useState("");
  const [active, setSessionActive] = useState(false);
  const [sessionStart, setSessionStart] = useState("");
  const [sessionEnd, setSessionEnd] = useState("");
  const [maxDate, setMaxDate] = useState("");

  useEffect(() => {
    const fetchInfo = async () => {
      const data = await fetch(`${SERVER}/sessions/maxdate`, {
        credentials: "include",
      });
      if (!data.ok) {
        throw new Error(`HTTP error! Status: ${data.status}`);
      }
      const max = await data.json();
      setMaxDate(max?.end_date);
    };
    fetchInfo();
  }, []);

  console.log(maxDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    let updateData;
    if (formId === "editSession") {
      updateData = {
        session_name: sessionData.session_name,
        active: sessionData.active,
        start_date: sessionData.start_date,
        end_date: sessionData.end_date,
      };
    } else {
      updateData = {
        session_name,
        active,
        start_date: sessionStart,
        end_date: sessionEnd,
      };
    }
    // if (!session_name.length) {
    //   updateData.session_name = sessionData.session_name;
    // }
    // console.log(updateData)

    // for (let key in updateData) {
    //   if (!updateData[key]) {
    //     updateData[key] = sessionData[key];
    //   }
    // }

    handleSession({ ...updateData });
    setSessionName("");
    setSessionStart("");
    setSessionEnd("");
    setSessionActive(false);
    // setSessionName("");
    // setSessionActive(false);
  };
  // //({session_name,active})
  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <form className="modal-content" onSubmit={handleSubmit}>
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="addholidayLabel">
              {" "}
              {formId === "editSession"
                ? ` Edit Session (${sessionData?.session_name})`
                : "Add a new Session"}
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
                Session Name
              </label>
              <input
                type="text"
                className="form-control"
                id="exampleFormControlInput1"
                placeholder={
                  Object.keys(sessionData)?.length
                    ? sessionData.session_name
                    : session_name
                }
                name="session_name"
                value={
                  formId === "editSession"
                    ? sessionData?.session_name
                    : session_name
                }
                onChange={(e) =>
                  formId === "editSession"
                    ? setSessionData({
                        ...sessionData,
                        session_name: e.target.value,
                      })
                    : setSessionName(e.target.value)
                }
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Session Start Date
              </label>
              <input
                type="date"
                className="form-control"
                id="exampleFormControlInput1"
                name="sessionStartDate"
                value={
                  formId === "editSession"
                    ? sessionData?.start_date
                    : sessionStart
                }
                onChange={(e) =>
                  formId === "editSession"
                    ? setSessionData({
                        ...sessionData,
                        start_date: e.target.value,
                      })
                    : setSessionStart(e.target.value)
                }
                min={formId === "addSession" ? maxDate : ""}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exampleFormControlInput1" className="form-label">
                Session End Date
              </label>
              <input
                type="date"
                className="form-control"
                id="exampleFormControlInput1"
                name="sessionEndDate"
                value={
                  formId === "editSession" ? sessionData?.end_date : sessionEnd
                }
                onChange={(e) =>
                  formId === "editSession"
                    ? setSessionData({
                        ...sessionData,
                        end_date: e.target.value,
                      })
                    : setSessionEnd(e.target.value)
                }
                min={formId === "addSession" ? maxDate : ""}
              />
            </div>

            {/* <div className=" form-switch alert alert-info row">
              <label
                className="form-check-label col"
                htmlFor="flexSwitchCheckChecked"
              >
                Is the session active?
              </label>
              <input
                className="form-check-input btn-lg "
                type="checkbox"
                id="flexSwitchCheckChecked"
                checked={
                  formId === "editSession" ? sessionData?.active : active
                }
                onChange={(e) =>
                  formId === "editSession"
                    ? setSessionData({
                        ...sessionData,
                        active: e.target.checked,
                      })
                    : setSessionActive(e.target.checked)
                }
              />
            </div> */}
          </div>
          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary"
              data-bs-dismiss="modal"
            >
              {formId === "editSession" ? "Edit" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
