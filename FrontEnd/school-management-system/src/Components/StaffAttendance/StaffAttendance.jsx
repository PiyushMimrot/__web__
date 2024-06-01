import { useEffect, useState } from "react";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { SERVER } from "../../config";
import { FaCheckCircle } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import moment from "moment";

const StaffAttendance = () => {
  const [currentData, setcurrentData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [menu, setMenu] = useState([]);
  const [currentType, setCurrentType] = useState("");
  const [userId, setUserId] = useState("");
  const [allStaffs, setAllStaffs] = useState([]);

  useEffect(() => {
    const fetchInfo = async () => {
      const getType = await fetch(`${SERVER}/profile/type`, {
        credentials: "include",
      });
      if (!getType.ok) {
        throw new Error(`HTTP error! Status: ${getType.status}`);
      }
      const { currentId, type } = await getType.json();
      // console.log(currentId, type);
      setCurrentType(type);
      setUserId(currentId);

      const getToday = await fetch(`${SERVER}/staffattendance/gettoday`, {
        credentials: "include",
      });
      if (!getToday.ok) {
        throw new Error(`HTTP error! Status: ${getToday.status}`);
      }
      const today = await getToday.json();
      if (today)
        // console.log(today, "today")
        setcurrentData(today);
      setMenu(today);

      if (type === "teacher") {
        const data = today.find((ele) => {
          return ele.staffId._id === currentId;
        });
        if (data) {
          setcurrentData([data]);
        }
      }

      const allStaff = await fetch(`${SERVER}/staffmanage/activestaffs`, {
        credentials: "include",
      });
      if (!allStaff.ok) {
        throw new Error(`HTTP error! Status: ${allStaff.status}`);
      }
      const staffs = await allStaff.json();
      setAllStaffs(staffs);
    };

    fetchInfo();
  }, []);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
  };

  const submitDate = async () => {
    setcurrentData([]);
    setMenu([]);
    const getData = await fetch(`${SERVER}/staffattendance/getbydate`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date: selectedDate }),
    });
    if (!getData.ok) {
      throw new Error(`HTTP error! Status: ${getData.status}`);
    }
    const data = await getData.json();
    setcurrentData(data);
    setMenu(data);
    setSelectedDate("");

    if (currentType === "teacher") {
      const result = data.find((ele) => {
        return ele.staffId._id === userId;
      });
      if (result) {
        setcurrentData([result]);
      }
    }
  };

  const handleApprove = async (id) => {
    const approve = await fetch(`${SERVER}/staffattendance/approve/${id}`, {
      method: "POST",
      credentials: "include",
    });
    if (!approve.ok) {
      throw new Error(`HTTP error! Status: ${approve.status}`);
    }
    await approve.json();

    const updatedData = currentData.map((ele) => {
      if (ele._id === id) {
        ele.status = 1;
      }
      return ele;
    });
    setcurrentData(updatedData);
  };

  const handleDisapprove = async (id) => {
    const disapprove = await fetch(
      `${SERVER}/staffattendance/disapprove/${id}`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    if (!disapprove.ok) {
      throw new Error(`HTTP error! Status: ${disapprove.status}`);
    }
    await disapprove.json();

    const updatedData = currentData.map((ele) => {
      if (ele._id === id) {
        ele.status = 0;
      }
      return ele;
    });
    setcurrentData(updatedData);
  };

  const handleSelectChange = async (event) => {
    // const selectedStaffObject = menu.find(
    //   (ele) => ele.staffId.name === event.target.value
    // );
    // setcurrentData([selectedStaffObject]);

    const staffId = event.target.value;
    const getAllAttOfStaffid = await fetch(
      `${SERVER}/staffattendance/get/${staffId}`,
      {
        credentials: "include",
      }
    );
    if (!getAllAttOfStaffid.ok) {
      throw new Error(`HTTP error! Status: ${getAllAttOfStaffid.status}`);
    }
    const allAtt = await getAllAttOfStaffid.json();
    console.log(allAtt, "allAtt");
    setcurrentData(allAtt);
  };

  return (
    <div>
      <div className="card mb-4 px-3 py-3">
        <h2 className="fw-bold mb-0 text-primary">
          {currentType === "admin" ? "Staff Attendance" : "My Attendance"}
        </h2>
        <div className="row mb-3 mt-5">
          <div className="col-2 d-flex align-items-center justify-content-center">
            <label htmlFor="exampleInput">Select Custom Date:</label>
          </div>
          <div className="col-3">
            <input
              type="date"
              className="form-control"
              id="exampleInput"
              onChange={handleDateChange}
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="col">
            <button
              disabled={!selectedDate}
              className="btn btn-primary"
              onClick={submitDate}
            >
              Check
            </button>
          </div>
          {currentType === "admin" && (
            <div style={{ width: "200px" }}>
              <select
                className="form-select"
                name="staffs"
                id="staffs"
                onChange={handleSelectChange}
                // value={menu?.staffId?.name || ""}
              >
                <option>Select Staffs</option>
                {allStaffs.map((ele) => (
                  <option key={ele.name} value={ele._id}>
                    {ele?.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="row clearfix g-3">
        <div className="col-sm-12">
          <div className="card mb-3">
            <div className="card-body">
              <table
                id="myProjectTable"
                className="table table-hover align-middle mb-0"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    <th>S. No.</th>
                    {/* {console.log(currentData[0]?.staffId.name, "test")} */}
                    {currentData[0]?.staffId?.name ? (
                      <th>Name</th>
                    ) : (
                      <th>Date</th>
                    )}
                    <th>Status</th>
                    {currentType === "admin" && <th>Action</th>}
                  </tr>
                </thead>
                <tbody>
                  {currentData.length > 0 &&
                    currentData.map((ele, ind) => (
                      <tr key={ind}>
                        <td>{ind + 1}</td>
                        {ele?.staffId?.name ? (
                          <td>{ele?.staffId?.name}</td>
                        ) : (
                          <td>
                            {ele?.date && moment(ele.date).format("DD/MM/YYYY")}
                          </td>
                        )}
                        <td>
                          {ele?.status === 0 && (
                            <span className="text-danger">Not approved</span>
                          )}
                          {ele?.status === 1 && (
                            <span className="text-success">Approved</span>
                          )}
                        </td>
                        {currentType === "admin" && (
                          <td>
                            <div
                              className="btn-group"
                              role="group"
                              aria-label="Basic outlined example"
                            >
                              {ele?.status === 0 && (
                                <button
                                  type="button"
                                  className="btn btn-success px-4"
                                  onClick={() => handleApprove(ele?._id)}
                                >
                                  <FaCheckCircle />
                                </button>
                              )}
                              {ele?.status === 1 && (
                                <button
                                  type="button"
                                  className="btn btn-danger px-3"
                                  onClick={() => handleDisapprove(ele?._id)}
                                >
                                  <ImCross />
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffAttendance;
