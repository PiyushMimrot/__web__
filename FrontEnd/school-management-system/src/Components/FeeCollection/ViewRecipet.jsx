import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { SERVER } from "../../config";
import Logo from "../../utils/Adds/Logo.png";

const ViewRecipet = ({ transcation_id, modalid, totalMonths }) => {
  const printRef = useRef(null);

  const [school, setSchool] = useState({});
  const [student, setStudent] = useState({});
  const [feesReciept, setFeesReciept] = useState({});
  const [xtraCharges, setXtraCharges] = useState({});
  const [tutionFees, setTutionFees] = useState([]);
  const [specialCharges, setSpecialCharges] = useState([]);
  const [taxes, setTaxes] = useState([]);

  const fetchDetails = async (id) => {
    try {
      const { data } = await axios.get(
        `${SERVER}/account_history/transaction/${id}`,
        { withCredentials: true }
      );
      setSchool(data?.data?.school);
      setStudent(data?.data?.student);

      setFeesReciept({
        id: data.data._id,
        transaction_id: data.data.transaction_id,
        amount: data.data.amount,
        date: data.data.date,
        subTotal: data.data.SubTotal,
      });

      setXtraCharges(data?.data?.ClassFee);
      setTutionFees(data?.data?.TutionFees);
      setSpecialCharges(data?.data?.SpecialCharges);
      setTaxes(data?.data?.Taxes);
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const printInvoiceFunction = () => {
    window.print(printRef.current.innerHTML);
  };

  useEffect(() => {
    if (transcation_id) {
      fetchDetails(transcation_id);
    }
  }, [transcation_id]);
  return (
    <div
      className="modal fade"
      id={modalid}
      ref={printRef}
      tabindex="-1"
      aria-labelledby="InvoiceModalPrintLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className="modal-header">
            {/* <h5 className="modal-title h4 " id="InvoiceModalPrintXlLabel">
              Fee Receipt
            </h5> */}
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
                    className="avatar xl rounded-circle img-thumbnail shadow-sm  "
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
              <strong> {feesReciept?.transaction_id} </strong>
            </div>
            <div className="mb-3 pb-3 border-bottom">
              For Months:
              <strong> {totalMonths?.join(", ")} </strong>
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
                          ₹ {xtraCharges?.value} x {totalMonths?.length}
                        </td>
                      </tr>

                      <tr>
                        <td>Extra Charge</td>
                        <td className="text-end">
                          {tutionFees.map((ele, index) => (
                            <p key={index}>
                              {ele?.charge_name}: ₹ {ele?.amount} x{" "}
                              {totalMonths?.length}
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
                            <strong>Sub:</strong>
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
                          {specialCharges?.map((ele, index) => (
                            <p key={index}>
                              {ele?.name}: ₹ {ele?.value} x{" "}
                              {totalMonths?.length}
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
                              {totalMonths?.length}
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
                          <td className="text-end">₹ {feesReciept?.amount}</td>
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

export default ViewRecipet;
