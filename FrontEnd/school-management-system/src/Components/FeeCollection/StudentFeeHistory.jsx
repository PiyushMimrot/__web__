import React, { useEffect, useState } from "react";
import ViewRecipet from "./ViewRecipet";
import { BsReceipt } from "react-icons/bs";
import { SERVER } from "../../config";
import axios from "axios";
import moment from "moment";
import { IoCheckbox } from "react-icons/io5";

const StudentFeeHistory = () => {
  const [feeHistory, setfeeHistory] = useState(null);
  const [reciptDetails, setreciptDetails] = useState(null);
  const [addfee, setAddfee] = useState(false)
  const [student_id, setStudent_id] = useState("")
  // console.log("stdeudenrererif",student_id);


  const [addMore, setAddMore] = useState(false);
  const [showFees, setShowFees] = useState(true);
  const [paymentMode, setPaymentMode] = useState(2);
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
  const [totalMonths, setTotalMonths] = useState();

  const monthsArray = [];

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


  // const handleCheckboxChange = (index) => {
  //   const updatedMonths = [...months];
  //   updatedMonths[index] = updatedMonths[index] === 1 ? 0 : 1;
  //   setMonths(updatedMonths);

  //   const selectedMonths = updatedMonths.some((month) => month === 1);
  //   setSelectCheckbox(selectedMonths);
  // };


  const handleSubmit = async () => {

    const res = await axios.post(
      `${SERVER}/courseplatform/fees`,
      {
        // studentId: student_id,
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
            studentid: student_id,
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
    if(res.status === 200){
      fetchFees();
      alert("fees fetched");
    }

    if (res.status === 500) {
      alert("Please select a payment mode");
    } else {
      // fetchFees();
      setPaymentMode(null);
      // setMonths(initialMonths)
      setSelectCheckbox(false);
    }
  };
  const handleCheckboxChange = (index) => {
    const updatedMonths = [...months];
    updatedMonths[index] = updatedMonths[index] === 1 ? 0 : 1;
    setMonths(updatedMonths);

    const selectedMonths = updatedMonths.some((month) => month === 1);
    setSelectCheckbox(selectedMonths);
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


      setActiveSession(res.data.data);


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

  function convertMonthNamesToArray(monthNamesArray) {
    const monthNames = getMonthsBetweenDates(
      activeSession.start_date,
      activeSession.end_date
    );

    let res = monthNames.map((month) =>
      monthNamesArray.includes(month) ? 0 : 1
    );


    return res;
  }

  let backendMonths = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];






  if (fees) {
    const selectedDates = [];
    fees.map((fee) => {
      fee.month?.map((ele) => selectedDates.push(ele));
    });
    backendMonths = convertMonthNamesToArray(selectedDates);

  }


  const fetchFees = async () => {
    const res = await axios.get(
      `${SERVER}/account_history/student/myfeehistory`,
      {
        withCredentials: true,
      }
    );
    if (res.data.data.length > 0) {
      // console.log("res.data",res?.data?.data?.map((item)=>item?.studentId));

      setfeeHistory(res.data.data);
      setFees(res.data.data);
      setStudent_id(res.data.studentId)
    } else {
      setfeeHistory(null);
    }
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

    // console.log("months",months)
    // console.log("backendMonths",backendMonths)


    const monthName = monthNames[parseInt(month, 10) - 1];
    return `${year} ${monthName}`;
  }

  

  const handleClick = () => {
    setAddfee(!addfee);
    console.log(addfee)
  };


  return (
    <>
      <div>
        <div className="card p-3">
          <div className="d-flex justify-content-between">
            <h3 className="fw-bold text-primary ">Fee History</h3>
            <button
              className="btn btn-primary me-2 ms-5 "
              onClick={handleClick}
            
            >
            Add Fee
          </button>
          <button
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#showfeestructure"
          >

            Show Fee Structure
          </button>

        </div>
      </div>





     

      { addfee && showFees && (
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
                disabled={!(paymentMode && selectCheckBox)}
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
















      <div className="card p-3 mt-3">
        <table className="table table-striped table-hover mt-2">
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
            {feeHistory ? (
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
                        data-bs-toggle="modal"
                        data-bs-target="#ShowReciept"
                        className=" btn btn btn-outline-primary"
                        onClick={() => setreciptDetails(item?._id)}
                      >
                        <BsReceipt />{" "}
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <td colSpan={4} className="pt-3">
                <center>No Records Found</center>
              </td>
            )}
          </tbody>
        </table>
      </div>
    </div >

      <ViewRecipet modalid="ShowReciept" transcation_id={reciptDetails} />

      <FeeStructureModal formId="showfeestructure" />
    </>
  );
};

const FeeStructureModal = ({ formId }) => {
  const [taxes, settaxes] = useState([]);
  const [tutuion, settutuion] = useState([]);
  const [xtracharges, setxtracharges] = useState(null);
  const [specialcharges, setspecialcharges] = useState([]);

  const fetchTaxes = async () => {
    const { data } = await axios.get(`${SERVER}/tax`, {
      withCredentials: true,
    });
    settaxes(data);
  };
  const fetchTutionfee = async () => {
    const { data } = await axios.get(`${SERVER}/tutionfee`, {
      withCredentials: true,
    });
    settutuion(data);
  };
  const fetchClasscharge = async () => {
    const { data } = await axios.get(`${SERVER}/xtraCharges`, {
      withCredentials: true,
    });
    setxtracharges(data);
  };
  const fetchSpecialharges = async () => {
    const { data } = await axios.get(`${SERVER}/specialCharges`, {
      withCredentials: true,
    });
    setspecialcharges(data);
  };

  useEffect(() => {
    fetchTaxes();
    fetchTutionfee();
    fetchClasscharge();
    fetchSpecialharges();
  }, []);
  return (
    <div
      className="modal fade"
      id={formId}
      tabindex="-1"
      aria-labelledby="InvoiceModalPrintLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title h4">Fee Structure</h5>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col">
                <h5 className="fw-bold text-primary">Tution</h5>
                <table className="table table-striped table-hover mt-2">
                  <thead>
                    <tr>
                      <th scope="col">S.No</th>
                      <th scope="col">Charge Name</th>
                      <th scope="col">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tutuion.map((item, index) => (
                      <tr key={item._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.charge_name}</td>
                        <td>{item.amount} ₹</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="col">
                <h5 className="fw-bold text-primary">Taxes</h5>
                <table className="table table-striped table-hover mt-2">
                  <thead>
                    <tr>
                      <th scope="col">S.No</th>
                      <th scope="col">Tax Name</th>
                      <th scope="col">Value(%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taxes.map((item, index) => (
                      <tr key={item._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.tax_name}</td>
                        <td>{item.value}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <hr />
            <div className="row mt-3">
              <div className="col">
                <h5 className="fw-bold text-primary">Class</h5>
                <table className="table table-striped mt-2">
                  <thead>
                    <tr>
                      <th scope="col"> Class</th>
                      <th scope="col">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {xtracharges && (
                      <tr>
                        <td className="fw-bold">
                          {xtracharges?.class_name?.name}
                        </td>
                        <td>{xtracharges?.value} ₹</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="col">
                <h5 className="fw-bold text-primary">Special Charges</h5>
                <table className="table table-striped table-hover mt-2">
                  <thead>
                    <tr>
                      <th scope="col">S.No</th>
                      <th scope="col">Charge Name</th>
                      <th scope="col">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specialcharges.map((item, index) => (
                      <tr key={item._id}>
                        <th scope="row">{index + 1}</th>
                        <td>{item.name}</td>
                        <td>{item.value} ₹</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="modal-footer">
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
  );
};
export default StudentFeeHistory;
