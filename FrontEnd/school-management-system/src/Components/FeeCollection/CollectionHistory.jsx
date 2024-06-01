import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { SERVER } from "../../config";
import { InstilTable, TableState } from "../MainComponents/InstillTable";
import { getTypeToken } from "../../Context/localStorage";
import moment from "moment";
import { AiFillEdit, AiFillDelete, AiOutlineEye } from "react-icons/ai";
import DatePicker from "react-datepicker";
import Swal from "sweetalert2";
import ViewRecipet from "./ViewRecipet";

const TYPE = getTypeToken();
console.log("TYPE",TYPE)

const CollectionHistory = () => {
  const [allHistory, setallHistory] = useState([]);
  const [tableState, setTableState] = useState(TableState.LOADING);
  const [activeState, setactiveState] = useState(0);
  const [customeDateStart, setcustomeDateStart] = useState(null);
  const [customeDateEnd, setcustomeDateEnd] = useState(null);
  const [reciptDetails, setreciptDetails] = useState(null);

  const fetchHistory = async (startDate, endDate, limit) => {
    const response = await axios.post(
      `${SERVER}/collection_history/`,
      { startDate, endDate, limit },
      {
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      setallHistory(response.data.data);
      setTableState(TableState.SUCCESS);
    } else {
      setTableState(TableState.ERROR);
    }
  };

  const titles = [
    "Std.ID",
    "Name",
    "tranID",
    "Date",
    "Amount",
    "Action",
    // (TYPE === "admin" || TYPE === "teacher") && "Action",
  ];

  const todayFetch = () => {
    // const startDate = moment().startOf("day");
    // const endDate = moment().endOf("day");
    // fetchHistory(startDate.format(), endDate.format());
    const currentDate = moment.utc();
    const startDate = currentDate.clone().startOf("day");
    const endDate = currentDate.clone().endOf("day");
    fetchHistory(startDate.toISOString(), endDate.toISOString(), null);
    setactiveState(1);
  };

  const weekFetch = () => {
    const startDate = moment().subtract(7, "days").startOf("day");
    const endDate = moment().endOf("day");
    fetchHistory(startDate.format(), endDate.format(), null);
    setactiveState(2);
  };

  const monthFetch = () => {
    const startDate = moment().subtract(1, "months").startOf("day");
    const endDate = moment().endOf("day");
    fetchHistory(startDate.format(), endDate.format(), null);
    setactiveState(3);
  };

  const customFetch = () => {
    // console.log(e);
    // console.log(moment(e).format("DD/MM/YYYY"));
    const startDate = moment(customeDateStart).startOf("day");
    const endDate = moment(customeDateEnd).endOf("day");
    fetchHistory(startDate.format(), endDate.format(), null);
    setactiveState(4);
  };

  const deleteRecipt = (id) => {
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
              fetchHistory(null, null, 20);
            });
        } catch (error) {
          console.error("Error deleting Exam List:", error);
        }
      }
    });
  };

  useEffect(() => {
    setTableState(TableState.LOADING);
    fetchHistory(null, null, 20);
  }, []);

  return (
    <div>
      <div className="border-0 mb-4 card ">
        <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
          <h3 className="fw-bold mb-0 text-primary noprint">
            Collection History
          </h3>
          <div className="col-auto d-flex w-sm-100">
            <div
              className="btn-group noprint"
              role="group"
              aria-label="Basic outlined example"
            >
              <button
                type="button"
                className={
                  activeState === 1
                    ? "btn btn-primary"
                    : "btn btn-outline-primary"
                }
                name="today"
                onClick={todayFetch}
              >
                Today
              </button>
              <button
                type="button"
                className={
                  activeState === 2
                    ? "btn btn-primary"
                    : "btn btn-outline-primary"
                }
                name="lastWeek"
                onClick={weekFetch}
              >
                Last Week
              </button>
              <button
                type="button"
                className={
                  activeState === 3
                    ? "btn btn-primary"
                    : "btn btn-outline-primary"
                }
                name="lastMonth"
                onClick={monthFetch}
              >
                Last Month
              </button>

              <button
                type="button"
                className={
                  activeState === 4
                    ? "btn btn-primary"
                    : "btn btn-outline-primary"
                }
                name="Custom"
                data-bs-toggle="modal"
                data-bs-target="#customeDate"
              >
                Custome Select
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="noprint">
        <InstilTable
          tableState={tableState}
          titles={titles}
          rows={allHistory.map((item, idx) => ({
            [titles[0]]: item.studentId?.studentId,
            [titles[1]]: item.studentId?.name,
            [titles[2]]: item?.transaction_id,
            [titles[3]]: moment(item.date).format("DD MMM YY"),
            [titles[4]]: item.amount.toFixed(2),
            [titles[5]]: (
              <>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#InvoiceModalPrint"
                  className=" btn btn btn-outline-primary "
                  onClick={() => setreciptDetails(item?._id)}
                >
                  <AiOutlineEye />
                </button>
                {(TYPE === "admin" || TYPE === "teacher") && (
                  <div
                    className="btn-group"
                    role="group"
                    aria-label="Basic outlined example"
                  >
                    <button
                      TYPE="button"
                      className="btn btn-outline-secondary deleterow"
                      onClick={() => deleteRecipt(item._id)}
                    >
                      <AiFillDelete className="text-danger" />
                    </button>
                  </div>
                )}
              </>
            ),
            // [titles[6]]:
          }))}
        />
      </div>

      <div
        className="modal fade"
        tabIndex="-1"
        aria-hidden="true"
        id="customeDate"
      >
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="addholidayLabel">
                Select Custom Date
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                // onClick={() => setMark({})}
              ></button>
            </div>
            <div className="modal-body table-responsive">
              <div className="row" style={{ minHeight: "20rem" }}>
                <div className="col">
                  To :
                  <DatePicker
                    selected={customeDateStart}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setcustomeDateStart(e)}
                    maxDate={new Date()}
                    className="btn btn-outline-primary"
                    placeholderText="Select From Date"
                  />
                </div>
                <div className="col">-</div>
                <div className="col">
                  From :
                  <DatePicker
                    selected={customeDateEnd}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setcustomeDateEnd(e)}
                    maxDate={new Date()}
                    className="btn btn-outline-primary"
                    placeholderText="Select From Date"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={customFetch}
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

      <ViewRecipet modalid="InvoiceModalPrint" transcation_id={reciptDetails} />
    </div>
  );
};

const ViewRecieptModel = ({ reciptDetails }) => {
  const [feesReciept, setFeesReciept] = useState({});
  const [fees, setFees] = useState(null);
  const [school, setSchool] = useState({});
  const [student, setStudent] = useState({});

  const [specialCharges, setSpecialCharges] = useState([]);
  const [tutionFees, setTutionFees] = useState([]);
  const [taxes, setTaxes] = useState([]);
  const [xtraCharges, setXtraCharges] = useState({});

  const printRef = useRef(null);

  const handleFetch = async (student_id, school, Details) => {
    setStudent(Details.studentId);
    const schoolInfoData = await fetch(`${SERVER}/school/getschool/${school}`, {
      credentials: "include",
    });
    const schoolInfo = await schoolInfoData.json();
    setSchool(schoolInfo);

    const res = await axios.get(`${SERVER}/courseplatform/fees/${student_id}`, {
      withCredentials: true,
    });
    // console.log(res.data.data, "fees");
    if (res.data.data.length > 0) {
      setFees(res.data.data);
    } else {
      setFees(null);
    }

    const taxData = await fetch(`${SERVER}/tax`, { credentials: "include" });
    if (!taxData.ok) {
      throw new Error(`HTTP error! Status: ${taxData.status}`);
    }
    const tax = await taxData.json();
    setTaxes(tax);

    const tutionFeeData = await fetch(
      `${SERVER}/tutionfee?date=${Details.date}`,
      {
        credentials: "include",
      }
    );
    if (!tutionFeeData.ok) {
      throw new Error(`HTTP error! Status: ${tutionFeeData.status}`);
    }
    const tutionFee = await tutionFeeData.json();
    setTutionFees(tutionFee);

    const specialChargeData = await fetch(
      `${SERVER}/specialCharges?date=${Details.date}`,
      {
        credentials: "include",
      }
    );
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

      let special_charge = specialCharge.reduce(
        (result, item) => result + item.value,
        0
      );
      special_charge = special_charge * Details.month.length;
      console.log("spec", special_charge);
      let totalTax = tax.reduce((result, item) => item.value + result, 0);
      console.log(totalTax, "total tax");

      let subTotalAmount = (Details.amount / (100 + totalTax)) * 100;
      // Details.amount - special_charge - totalTax;

      setFeesReciept({
        transaction: Details,
        subTotal: (subTotalAmount - special_charge).toFixed(2),
      });
      let modal = new bootstrap.Modal(
        document.getElementById("InvoiceModalPrint")
      );
      modal.show();
    }
  };

  const printInvoiceFunction = () => {
    window.print(printRef.current.innerHTML);
  };

  // console.log(reciptDetails);
  useEffect(() => {
    if (reciptDetails?.studentId) {
      handleFetch(
        reciptDetails.studentId._id,
        reciptDetails.school_id,
        reciptDetails
      );
    }
  }, [reciptDetails?._id]);

  console.log(feesReciept);
  return (
    <div
      className="modal fade"
      id="InvoiceModalPrint2"
      ref={printRef}
      tabindex="-1"
      aria-labelledby="InvoiceModalPrintLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title h4" id="InvoiceModalPrintXlLabel">
              Fee Reciept
            </h5>
            <div className="d-flex ">
              <img
                src={`${SERVER}/school_logo/${school?.logo}`}
                alt=""
                className="avatar xl rounded-circle img-thumbnail shadow-sm"
              />
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
          </div>
          <div className="modal-body">
            <div className="mb-3 pb-3 border-bottom">
              Invoice
              <strong>
                {" "}
                {feesReciept && feesReciept?.transaction?.transaction_id}{" "}
              </strong>
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
                        <td className="text-end">₹ {xtraCharges?.value}</td>
                      </tr>

                      <tr>
                        <td>Extra Charge</td>
                        <td className="text-end">
                          {tutionFees.map((ele, index) => (
                            <p key={index}>
                              {ele?.charge_name}: ₹ {ele?.amount}
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
                              {ele?.name}: ₹ {ele?.value}
                            </p>
                          ))}
                        </td>
                      </tr>
                      <tr>
                        <td>Tax</td>
                        <td className="text-end">
                          {taxes.map((ele, index) => (
                            <p key={index}>
                              {ele?.tax_name}: {ele?.value}%
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
              <div className="col-lg-12 text-end noprint">
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
  );
};

export default CollectionHistory;
