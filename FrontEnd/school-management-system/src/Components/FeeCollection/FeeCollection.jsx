import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { SERVER } from "../../config";
import Swal from "sweetalert2";
import { IoCheckbox } from "react-icons/io5";
import moment from "moment";
import { BsReceipt } from "react-icons/bs";
import ViewRecipet from "./ViewRecipet";
import Logo from "../../utils/Adds/Logo.png";

export default function FeeCollection() {
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState({});
  const [addMore, setAddMore] = useState(false);
  const [showFees, setShowFees] = useState(false);
  const [paymentMode, setPaymentMode] = useState(1);
  const [activeSession, setActiveSession] = useState("");
  const [feesReciept, setFeesReciept] = useState({});
  const [school, setSchool] = useState({});
  const [selectCheckBox, setSelectCheckbox] = useState(false);

  const [specialCharges, setSpecialCharges] = useState([]);
  const [tutionFees, setTutionFees] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [xtraCharges, setXtraCharges] = useState({});

  const [months1, setMonth1] = useState(null);
  const [months2, setMonth2] = useState(null);
  const [months3, setMonth3] = useState(null);
  const [months4, setMonth4] = useState(null);

  const [fees, setFees] = useState(null);
  const [parent, setParent] = useState({});
  const [studentClass, setStudentClass] = useState({});
  const [isCheckClassFee, setisCheckClassFee] = useState(null);

  const [reciptDetails, setreciptDetails] = useState(null);
  const [multistudents, setmultistudents] = useState(null);

  const monthsArray = [];

  const printRef = useRef(null);
  const [totalMonths, setTotalMonths] = useState();
  const fetchisFeeCheck = async (classid) => {
    const { data } = await axios.get(
      `${SERVER}/xtraCharges/isCheck/${classid}`,
      { withCredentials: true }
    );
    if (data.success) {
      setisCheckClassFee(null);
    } else {
      setisCheckClassFee(data.message);
    }
  };

  function getMonthsBetweenDates(start_date, end_date) {
    // Parse the input dates
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

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

    return monthsArray;
  }

  let mainMonthArray = [];

  // Initialize the months array with 12 zeros.
  const initialMonths = Array(12).fill(0);
  const [months, setMonths] = useState(initialMonths);

  const selectMultipleHandler = (id) => {
    handleSearchStudent(id);
    setmultistudents(null);
  };

  const handleSearchStudent = async (query = null) => {
    try {
      let url = query ? `${studentId}?student_id=${query}` : studentId;
      const { data } = await axios.get(
        `${SERVER}/courseplatform/searchStudent/${url}`,
        { withCredentials: true }
      );

      if (data.success && data.unique) {
        setStudent(data.data);
        setParent(data.studentParent);
        setStudentClass(data.studentClass);
        setShowFees(true);
        fetchisFeeCheck(data.studentClass.Class_id._id);
      }
      if (data.success && !data.unique) {
        setmultistudents(data.data);
        let modal = new bootstrap.Modal(
          document.getElementById("showmultiplestudents")
        );
        modal.show();
      }
      if (!data.success) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Student not found!",
        });
        if (student?.name) {
          setStudent({});
          setFees(null);
          setShowFees(false);
        }
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };

  // Toggle the value in the months array when a checkbox is clicked.
  const handleCheckboxChange = (index) => {
    const updatedMonths = [...months];
    updatedMonths[index] = updatedMonths[index] === 1 ? 0 : 1;
    setMonths(updatedMonths);

    const selectedMonths = updatedMonths.some((month) => month === 1);
    setSelectCheckbox(selectedMonths);
  };

  const handleSubmit = async () => {
    const res = await axios.post(
      `${SERVER}/courseplatform/fees`,
      {
        studentId: student._id,
        months,
        paymentMode,
        activeSession,
        mainMonthArray: getMonthsBetweenDates(
          activeSession.start_date,
          activeSession.end_date
        ),
      },
      { withCredentials: true }
    );

    console.log(res.data, "feesSubmitted");
    setFeesReciept(res.data);

    const taxData = await fetch(`${SERVER}/tax`, { credentials: "include" });
    if (!taxData.ok) {
      throw new Error(`HTTP error! Status: ${taxData.status}`);
    }
    const tax = await taxData.json();
    setTaxes(tax);

    const tutionFeeData = await fetch(`${SERVER}/tutionfee`, {
      credentials: "include",
    });
    if (!tutionFeeData.ok) {
      throw new Error(`HTTP error! Status: ${tutionFeeData.status}`);
    }
    const tutionFee = await tutionFeeData.json();
    setTutionFees(tutionFee);

    const specialChargeData = await fetch(`${SERVER}/specialCharges`, {
      credentials: "include",
    });
    if (!specialChargeData.ok) {
      throw new Error(`HTTP error! Status: ${specialChargeData.status}`);
    }
    const specialCharge = await specialChargeData.json();
    setSpecialCharges(specialCharge);

    const feeCollectData = await fetch(`${SERVER}/feeCollectType/getstatus`, {
      credentials: "include",
    });
    if (!feeCollectData.ok) {
      throw new Error(`HTTP error! Status: ${feeCollectData.status}`);
    }
    const feeCollectType = await feeCollectData.json();

    if (feeCollectType) {
      const xtraChargeData = await fetch(`${SERVER}/xtraCharges/getfeeall`, {
        credentials: "include",
      });
      const xtraCharge = await xtraChargeData.json();
      setXtraCharges(xtraCharge);
      console.log(xtraCharge, "xtraCharge for all");
    } else {
      const studentAlignData = await fetch(
        `${SERVER}/students/getbystudentsession`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentid: student._id,
            session_id: res.data?.session_id,
          }),
        }
      );
      if (!studentAlignData.ok) {
        throw new Error(`HTTP error! Status: ${studentAlignData.status}`);
      }
      const studentAlign = await studentAlignData.json();
      // console.log(studentAlign, "studentAlign")

      const xtraChargeData = await fetch(`${SERVER}/xtraCharges/getfeeone`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          classid: studentAlign[0].Class_id,
        }),
      });
      if (!xtraChargeData.ok) {
        throw new Error(`HTTP error! Status: ${xtraChargeData.status}`);
      }

      const xtraCharge = await xtraChargeData.json();
      setXtraCharges(xtraCharge);
      console.log(xtraCharge, "xtraCharge for one");
    }

    if (res.status === 500) {
      alert("Please select a payment mode");
    } else {
      fetchFees();
      setPaymentMode(null);
      // setMonths(initialMonths)
      setSelectCheckbox(false);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      const res = await axios.get(`${SERVER}/sessions/active`, {
        withCredentials: true,
      });

      mainMonthArray = getMonthsBetweenDates(
        res.data.data.start_date,
        res.data.data.end_date
      );

      console.log(mainMonthArray);

      setMonth1(mainMonthArray.slice(0, 3));
      setMonth2(mainMonthArray.slice(3, 6));
      setMonth3(mainMonthArray.slice(6, 9));
      setMonth4(mainMonthArray.slice(9, 12));

      // console.log(mainMonthArray);
      // console.log(res);
      setActiveSession(res.data.data);
      console.log(res.data.data);

      const schoolInfoData = await fetch(
        `${SERVER}/school/getschool/${res.data.data.school_id}`,
        {
          credentials: "include",
        }
      );
      const schoolInfo = await schoolInfoData.json();

      setSchool(schoolInfo);
    };
    fetchSession();
  }, []);

  // console.log(activeSession);
  // console.log(months1, months2, months3, months4);

  const fetchFees = async () => {
    const res = await axios.get(
      `${SERVER}/courseplatform/fees/${student._id}`,
      { withCredentials: true }
    );
    // console.log(res.data.data, "fees");
    if (res.data.data.length > 0) {
      setFees(res.data.data);
    } else {
      setFees(null);
    }
  };

  function convertMonthNamesToArray(monthNamesArray) {
    const monthNames = getMonthsBetweenDates(
      activeSession.start_date,
      activeSession.end_date
    );

    let res = monthNames.map((month) =>
      monthNamesArray.includes(month) ? 0 : 1
    );
    // console.log(res);

    return res;
  }

  let backendMonths = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

  if (fees) {
    const selectedDates = [];
    fees.map((fee) => {
      fee.month?.map((ele) => selectedDates.push(ele));
    });
    backendMonths = convertMonthNamesToArray(selectedDates);

    // console.log(backendMonths, "backendMonths");
  }

  const printInvoiceFunction = () => {
    window.print(printRef.current.innerHTML);
  };

  useEffect(() => {
    if (Object.keys(student).length) {
      fetchFees();
    }
  }, [student]);

  function convertToMonthName(dateString) {
    if (!dateString) {
      return;
    }
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

    console.log("backendMonths",backendMonths)
    const monthName = monthNames[parseInt(month, 10) - 1];
    return `${year} ${monthName}`;
  }

  console.log(studentId);

  return (
    <>
      <div className="noprint">
        <div className="card px-3 pt-3 mb-4">
          <h2 className="fw-bold  text-primary">Fee Center</h2>
        </div>

        <div className="d-flex justify-content-between">
          <div className="d-flex gap-2 bg-white p-2">
            <input
              value={studentId}
              type="text"
              placeholder="Student Id/phone.No"
              className="form-control"
              onChange={(e) => setStudentId(e.target.value)}
            />
            <button
              className="btn btn-primary"
              onClick={() => handleSearchStudent()}
            >
              Search
            </button>
          </div>

          <div className="bg-white p-2">
            <select
              value={paymentMode}
              className="form-select"
              aria-label="Default select example"
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value={null} selected>
                Select Payment Mode
              </option>
              <option value={1}>Cash</option>
              <option value={2}>Online</option>
            </select>
          </div>
        </div>
        {student?.name && (
          <div className="row mt-4 px-2">
            <div className="col-lg-4 col-md-12">
              <div className="card">
                <div className="card-body ">
                  <h5 className="card-title text-center fw-bolder">
                    Student Information{" "}
                  </h5>
                  <div>
                    <table className="table">
                      <tbody>
                        <tr>
                          <th>Name : </th>
                          <td>{student.name}</td>
                        </tr>
                        <tr>
                          <th>Student ID : </th>
                          <td>{student.studentId}</td>
                        </tr>
                        <tr>
                          <th>Class :</th>
                          <td>
                            {studentClass.Class_id.name}/
                            {studentClass.section_id.name}
                          </td>
                        </tr>
                        <tr>
                          <th>Father Name : </th>
                          <td>{parent.fathername}</td>
                        </tr>
                        <tr>
                          <th>Mother Name : </th>
                          <td>{parent.mothername}</td>
                        </tr>
                        <tr>
                          <th>Parent Ph : </th>
                          <td>{parent.phoneNumber}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="col mt-lg-0 mt-3 card"
              style={{ maxHeight: "23rem", overflow: "auto" }}
            >
              <h5 className="card-title text-center fw-bolder p-2">
                Student Fee History
              </h5>
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    {/* <th scope="col">S.No</th> */}
                    <th scope="col">Date</th>
                    <th scope="col">Amount</th>
                    <th scope="col">Mode</th>
                    <th scope="col">Months</th>
                    <th scope="col">Reciept</th>
                  </tr>
                </thead>
                <tbody>
                  {fees &&
                    fees.map((item, index) => {
                      let dateArray = [];
                      item.month.forEach((item2) => {
                        let x = convertToMonthName(item2);
                        dateArray.push(x);
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
                              data-bs-toggle="modal"
                              data-bs-target="#ShowReciept"
                              className=" btn btn btn-outline-primary"
                              onClick={() => {
                                setreciptDetails(item?._id);
                                setTotalMonths(dateArray);
                              }}
                            >
                              <BsReceipt />{" "}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {showFees && (
          <>
            <table className="table bg-white mt-3">
              <thead>
                <tr>
                  <th scope="col">Month</th>
                  <th scope="col">Month</th>
                </tr>
              </thead>
              <tbody>
                {months1?.map((month, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        {backendMonths[index] === 1 ? (
                          <>
                            <input
                              className="form-check-input mt-0"
                              type="checkbox"
                              defaultValue
                              aria-label="Checkbox for following text input"
                              onChange={() => handleCheckboxChange(index)}
                              checked={months[index] === 1}
                            />
                            {convertToMonthName(month)}
                          </>
                        ) : (
                          <p>
                            <IoCheckbox
                              style={{
                                color: "green",
                              }}
                            />
                            {convertToMonthName(month)}{" "}
                          </p>
                        )}
                      </td>
                      <td>
                        {backendMonths[index + 3] === 1 ? (
                          <>
                            <input
                              className="form-check-input mt-0"
                              type="checkbox"
                              defaultValue
                              aria-label="Checkbox for following text input"
                              onChange={() => handleCheckboxChange(index + 3)} // Adjust the index for months2
                              checked={months[index + 3] === 1}
                            />
                            {convertToMonthName(months2[index])}
                          </>
                        ) : (
                          <p>
                            <IoCheckbox
                              style={{
                                color: "green",
                              }}
                            />
                            {convertToMonthName(months2[index])}{" "}
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {addMore &&
                  months3.map((month, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          {backendMonths[index + 6] === 1 ? (
                            <>
                              <input
                                className="form-check-input mt-0"
                                type="checkbox"
                                defaultValue
                                aria-label="Checkbox for following text input"
                                onChange={() => handleCheckboxChange(index + 6)} // Adjust the index for months3
                                checked={months[index + 6] === 1}
                              />
                              {convertToMonthName(month)}
                            </>
                          ) : (
                            <p>
                              <IoCheckbox
                                style={{
                                  color: "green",
                                }}
                              />
                              {convertToMonthName(month)}
                            </p>
                          )}
                        </td>
                        <td>
                          {backendMonths[index + 9] === 1 ? (
                            <>
                              <input
                                className="form-check-input mt-0"
                                type="checkbox"
                                defaultValue
                                aria-label="Checkbox for following text input"
                                onChange={() => handleCheckboxChange(index + 9)} // Adjust the index for months4
                                checked={months[index + 9] === 1}
                              />
                              {convertToMonthName(months4[index])}
                            </>
                          ) : (
                            <p>
                              <IoCheckbox
                                style={{
                                  color: "green",
                                }}
                              />
                              {convertToMonthName(months4[index])}
                            </p>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>

            {!addMore && (
              <button
                className="btn btn-warning"
                value={addMore}
                onClick={() => setAddMore(true)}
              >
                Show More Months
              </button>
            )}

            {addMore && (
              <button
                className="btn btn-warning mx-3"
                value={addMore}
                onClick={() => setAddMore(false)}
              >
                Hide Months
              </button>
            )}

            {isCheckClassFee ? (
              <div className="alert alert-danger mt-2" role="alert">
                {isCheckClassFee}
              </div>
            ) : (
              <div>
                <button
                  className="btn btn-primary my-4 fs-6"
                  // disabled={!(paymentMode && selectCheckBox)}
                  onClick={handleSubmit}
                  data-bs-toggle="modal"
                  data-bs-target="#InvoiceModalPrint"
                >
                  Submit
                </button>
              </div>
            )}
          </>
        )}

        {/* Fees submission modal */}
      </div>

      <div
        className="modal fade"
        id="InvoiceModalPrint"
        ref={printRef}
        tabindex="-1"
        aria-labelledby="InvoiceModalPrintLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <div className="d-flex w-100 border-bottom border-5 border-info ">
                <div className="d-flex align-items-center w-100">
                  <div className="w-25 d-flex align-items-center justify-content-center">
                    <img
                      style={{ height: 150, width: 150 }}
                      src={
                        school?.logo
                          ? `${SERVER}/school_logo/${school?.logo}`
                          : Logo
                      }
                      onError={(e) => {
                        e.currentTarget.src = Logo;
                      }}
                      alt="logo"
                      className="avatar xl rounded-circle img-thumbnail shadow-sm"
                    />
                  </div>
                  <div className="w-75 d-flex flex-column align-items-center py-3">
                    <h1 className="text-primary fw-bold">{school?.name}</h1>
                    <h5 className="text-primary fw-bold">{school?.address}</h5>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-center">
                <p className="h3 fw-bold">Fee Receipt</p>
              </div>
              <div className="mb-3 pb-3 border-bottom">
                Invoice
                <strong>
                  {" "}
                  {feesReciept && feesReciept?.transaction?.transaction_id}{" "}
                </strong>
              </div>
              <div className="mb-3 pb-3 border-bottom">
                Months
                <strong> {feesReciept?.transaction?.month?.join(", ")}</strong>
              </div>

              <div className="row mb-4">
                <div className="col-sm-6">
                  <h6 className="mb-3">From:</h6>
                  <div>
                    <strong>{school?.name}</strong>
                  </div>
                  <div>{school?.address}</div>
                  <div>Email: {school?.email}</div>
                  <div>Phone: {school?.phone}</div>
                </div>

                <div className="col-sm-6">
                  <h6 className="mb-3">To:</h6>
                  <div>
                    <strong>{student?.name}</strong>
                  </div>
                  <div>Phone: {student?.number}</div>
                  <div>Student ID: {student?.studentId}</div>
                  <div>DOB: {student?.dob?.split(["T"])[0]}</div>
                  <div>Gender: {student?.gender}</div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-6">
                  <div className="table-responsive-sm">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Details</th>
                          <th className="text-end">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Tuition Fees</td>
                          <td className="text-end">
                            ₹ {xtraCharges?.value} x{" "}
                            {feesReciept?.transaction?.month?.length}
                          </td>
                        </tr>

                        <tr>
                          <td>Extra Charge</td>
                          <td className="text-end">
                            {tutionFees.map((ele, index) => (
                              <p key={index}>
                                {ele?.charge_name}: ₹ {ele?.amount} x{" "}
                                {feesReciept?.transaction?.month?.length}
                              </p>
                            ))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="row">
                    <div className="col-lg-4 col-sm-5"></div>

                    <div className="col-lg-4 col-sm-5 ms-auto">
                      <table className="table table-clear">
                        <tbody>
                          <tr>
                            <td>
                              <strong>Subtotal</strong>
                            </td>
                            <td className="text-end">
                              ₹ {feesReciept?.subTotal}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="table-responsive-sm">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Details</th>
                          <th className="text-end">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Special Charges</td>
                          <td className="text-end">
                            {specialCharges.map((ele, index) => (
                              <p key={index}>
                                {ele?.name}: ₹ {ele?.value} x{" "}
                                {feesReciept?.transaction?.month?.length}
                              </p>
                            ))}
                          </td>
                        </tr>
                        <tr>
                          <td>Tax</td>
                          <td className="text-end">
                            {taxes.map((ele, index) => (
                              <p key={index}>
                                {ele?.tax_name}: {ele?.value}% x{" "}
                                {feesReciept?.transaction?.month?.length}
                              </p>
                            ))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="row">
                    <div className="col-lg-4 col-sm-5"></div>

                    <div className="col-lg-4 col-sm-5 ms-auto">
                      <table className="table table-clear">
                        <tbody>
                          <tr>
                            <td>
                              <strong>Total</strong>
                            </td>
                            <td className="text-end">
                              ₹ {feesReciept?.transaction?.amount}
                            </td>
                          </tr>
                          {/* <tr>
                            <td>
                              <strong>(ER) - (DE)</strong>
                            </td>
                            <td className="text-end">$7935</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Total</strong>
                            </td>
                            <td className="text-end">
                              <strong>$7935</strong>
                            </td>
                          </tr> */}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row ">
                <div className="col-lg-12 d-none">
                  <h6>Terms &amp; Condition</h6>
                  <p className="text-muted">
                    Contrary to popular belief, Lorem Ipsum is not simply random
                    text. It has roots in a piece of classical Latin literature
                    from 45 BC, making it over
                  </p>
                </div>
                <div className="col-lg-12 text-end">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-lg my-1"
                    onClick={printInvoiceFunction}
                  >
                    <i className="fa fa-print"></i> Print
                  </button>
                  <button type="button" className="btn btn-primary btn-lg my-1">
                    <i className="fa fa-paper-plane-o"></i> Send Invoice
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer noprint">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <ViewRecipet
        modalid="ShowReciept"
        transcation_id={reciptDetails}
        totalMonths={totalMonths}
      />

      <MultiStudentsModal
        formId="showmultiplestudents"
        data={multistudents}
        submitHandler={selectMultipleHandler}
      />
    </>
  );
}

const MultiStudentsModal = ({ formId, data, submitHandler }) => {
  const selectedStudentHandler = (id) => {
    submitHandler(id);
  };
  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="addholidayLabel">
              {" "}
              Multiple Students
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <table className="table table-striped table-hover mt-2">
              <thead>
                <tr>
                  <th scope="col">S.No</th>
                  <th scope="col">Name</th>
                  <th scope="col">Student Id</th>
                  <th scope="col">Option</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((item, index) => (
                    <tr key={item._id}>
                      <th scope="row">{index + 1}</th>
                      <td>{item.name}</td>
                      <td>{item.studentId}</td>
                      <td>
                        <button
                          className="btn btn-primary"
                          data-bs-dismiss="modal"
                          onClick={() => selectedStudentHandler(item._id)}
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="modal-footer">
            <button className="btn btn-warning" data-bs-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
