import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER } from "../../config";
import { InstilTable, TableState } from "../MainComponents/InstillTable";
import { AiOutlineEye, AiFillDelete } from "react-icons/ai";
import moment from "moment";
import Swal from "sweetalert2";

const AccountHistory = () => {
  const [classess, setclassess] = useState(null);
  const [sections, setsections] = useState(null);
  const [selectedClass, setselectedClass] = useState(null);
  const [selectedSection, setselectedSection] = useState(null);
  const [accountsData, setaccountsData] = useState([]);
  const [filterAccountsData, setfilterAccountsData] = useState([]);
  const [session, setsession] = useState(null);
  const [sessionMonths, setsessionMonths] = useState([]);
  const [singleDetail, setsingleDetail] = useState(null);
  const [tableState, setTableState] = useState(TableState.LOADING);

  function getMonthsBetweenDates(start_date, end_date) {
    // Parse the input dates
    const startDate = new Date(start_date);
    const endDate = new Date();
    let monthsArray = [];

    // Initialize an array to store the result

    // Loop through the months from start_date to end_date
    let currentDate = startDate;
    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1; // Months are 0-based, so add 1
      monthsArray.push(`${year}-${month.toString().padStart(2, "0")}`);

      // Move to the next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    // console.log(monthsArray);
    return monthsArray;
  }

  const fetchAccountHistory = async (classid) => {
    try {
      const { data } = await axios.get(SERVER + `/account_history/${classid}`, {
        withCredentials: true,
      });
      if (data.success) {
        let session_months = getMonthsBetweenDates(
          data.session.start_date,
          data.session.end_date
        );
        setsessionMonths(session_months);

        let update = [...data.data];
        update = update.map((item) => {
          console.log(item.months.length, session_months.length);
          const dates = item.months.map((d) =>
            moment(d, "YYYY-MM").format("MMM")
          );
          let isPaid =
            item.months.length === session_months.length ? "Paid" : "Pending";
          let remaining = session_months.length - item.months.length;

          return {
            ...item,
            months: dates.reverse(),
            isPaid,
            remaining,
          };
        });
        setaccountsData(update);
        setfilterAccountsData(update);
        setsession(data.session);

        setTableState(TableState.SUCCESS);
        fetchSections(classid);
        setselectedSection("");
      }
    } catch (error) {
      console.log(error);
      setTableState(TableState.ERROR);
    }
  };

  const fetchAllClasses = async () => {
    try {
      const { data } = await axios.get(`${SERVER}/classes/allClasses`, {
        withCredentials: true,
      });
      setclassess(data);
      if (data.length > 0) {
        setselectedClass(data[0]._id);
      }
    } catch (error) {
      return error.response.data;
    }
  };

  const fetchSections = async (classid) => {
    try {
      const { data } = await axios.get(
        `${SERVER}/section/getSectionClass/${classid}`,
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        setsections(data.data);
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const titles = [
    "ID",
    "Name",
    "Status",
    "Due Months",
    "Paid Month",
    "Details",
  ];

  const filterBySection = (e) => {
    if (e.target.value === "") {
      setfilterAccountsData(accountsData);
    } else {
      let update = accountsData.filter(
        (item) => item.sectionId === e.target.value
      );
      setfilterAccountsData(update);
    }
    setselectedSection(e.target.value);
  };

  useEffect(() => {
    fetchAllClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchAccountHistory(selectedClass);
    }
  }, [selectedClass]);

  return (
    <>
      <div className="border-0 mb-4 card ">
        <div className="card-header p-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
          <h3 className="fw-bold mb-0 text-primary noprint">Account History</h3>
        </div>

        <div className="row p-3">
          <div className="col-6">
            <label htmlFor="formFileMultipleone" className="form-label">
              Select Class
            </label>
            <select
              className="form-select "
              aria-label="Default select Section"
              name="section_id"
              onChange={(e) => setselectedClass(e.target.value)}
            >
              <option value="" defaultChecked>
                Select Class
              </option>
              {classess &&
                classess?.map((item, index) => {
                  return (
                    <option
                      key={index}
                      value={item._id}
                      selected={selectedClass === item._id}
                    >
                      {item.name}
                    </option>
                  );
                })}
            </select>
          </div>

          <div className="col-6">
            <label htmlFor="formFileMultipleone" className="form-label">
              Select Section
            </label>
            <select
              className="form-select "
              aria-label="Default select Section"
              name="section_id"
              onChange={filterBySection}
            >
              <option value="" defaultChecked>
                All sections
              </option>
              {sections &&
                sections?.map((item, index) => {
                  return (
                    <option
                      key={index}
                      value={item._id}
                      selected={selectedSection === item._id}
                    >
                      {item.name}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>
      </div>

      <InstilTable
        tableState={tableState}
        titles={titles}
        rows={filterAccountsData?.map((item) => ({
          [titles[0]]: item?.studentId,
          [titles[1]]: item?.name,
          [titles[2]]:
            item?.isPaid === "Paid" ? (
              <span class="badge bg-success">{item?.isPaid}</span>
            ) : (
              <span class="badge bg-danger">{item?.isPaid}</span>
            ),
          [titles[3]]: (
            <span
              className={
                item?.remaining <= 0
                  ? "text-success fw-bold"
                  : "text-primary fw-bold"
              }
            >
              {item?.remaining}
            </span>
          ),
          [titles[4]]: item?.months.join(", "),
          [titles[5]]: (
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target={"#viewAccountHistory"}
              onClick={() => setsingleDetail(item)}
            >
              <AiOutlineEye />
            </button>
          ),
        }))}
      />

      <ViewAccountHistoryDetail data={singleDetail} />
    </>
  );
};

const ViewAccountHistoryDetail = ({ data }) => {
  console.log(data);
  const [feeHistory, setfeeHistory] = useState(null);
  const [student, setStudent] = useState({});
  const [parent, setParent] = useState({});
  const [studentClass, setStudentClass] = useState({});
  console.log(studentClass);

  const fetchAllFees = async (studentId) => {
    const { data } = await axios.get(
      `${SERVER}/courseplatform/searchStudent/${studentId}`,
      { withCredentials: true }
    );
    // console.log(data);
    setStudent(data?.data);
    setParent(data?.studentParent);
    setStudentClass(data?.studentClass);
  };

  const fetchFees = async (studentid) => {
    const res = await axios.get(`${SERVER}/courseplatform/fees/${studentid}`, {
      withCredentials: true,
    });
    // console.log(res.data.data, "fees");
    if (res.data.data.length > 0) {
      setfeeHistory(res.data.data);
    } else {
      setfeeHistory(null);
    }
  };

  const deleteRecipt = (id) => {
    let modal = new bootstrap.Modal(
      document.getElementById("viewAccountHistory")
    );
    // modal.hide();

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
            .delete(SERVER + `/collection_history/${id}`, {
              withCredentials: true,
            })
            .then(() => {
              Swal.fire("Deleted!", "Exam has been deleted.", "success");
              fetchAllFees(data?._id);
            });
        } catch (error) {
          console.error("Error deleting Exam List:", error);
        }
      }
      modal.show();
    });
  };

  function convertToMonthName(dateString) {
    const [year, month] = dateString.split("-");
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthName = monthNames[parseInt(month, 10) - 1];
    return `${year} ${monthName}`;
  }

  useEffect(() => {
    if (data) {
      fetchAllFees(data?.studentId);
      fetchFees(data?._id);
    }
  }, [data?._id]);

  return (
    <div
      className="modal fade"
      id="viewAccountHistory"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Account History : <b>{data?.name}</b>
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="card">
              <div className="card-body ">
                <h5 className="card-title">Student Information</h5>
                <div>
                  <table>
                    <tbody>
                      <tr>
                        <th>Student Id</th>
                        <td>{student?.studentId}</td>
                      </tr>
                      <tr>
                        <th>Number</th>
                        <td>{student?.number}</td>
                      </tr>
                      <tr>
                        <th>Class</th>
                        <td>
                          {studentClass?.Class_id?.name}/
                          {studentClass?.section_id?.name}
                        </td>
                      </tr>
                      <tr>
                        <th>Father Name</th>
                        <td>{parent?.fathername}</td>
                      </tr>
                      <tr>
                        <th>Mother Name</th>
                        <td>{parent?.mothername}</td>
                      </tr>
                      <tr>
                        <th>Parent Ph </th>
                        <td>{parent?.phoneNumber}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <table class="table table-striped table-hover mt-2">
              <thead>
                <tr>
                  {/* <th scope="col">S.No</th> */}
                  <th scope="col">Date</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Mode</th>
                  <th scope="col">Months</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {feeHistory &&
                  feeHistory.map((item, index) => {
                    let dateArray = item.month.map((item2) => {
                      let x = convertToMonthName(item2);
                      return x;
                    });
                    return (
                      <tr>
                        {/* <th scope="row">{index + 1}</th> */}
                        <td>{moment(item.date).format("DD/MM/YYYY")}</td>
                        <td>{item.amount.toFixed(1)}</td>
                        <td>{item.payment_mode === 1 ? "cash" : "online"}</td>
                        <td>{dateArray.join(", ")}</td>
                        <td>
                          <button
                            TYPE="button"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            className="btn btn-outline-secondary deleterow"
                            onClick={() => deleteRecipt(item._id)}
                          >
                            <AiFillDelete className="text-danger" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-primary"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AccountHistory;
