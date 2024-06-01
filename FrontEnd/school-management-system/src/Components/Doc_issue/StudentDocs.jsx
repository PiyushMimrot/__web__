import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { SERVER } from "../../config";
import Swal from "sweetalert2";
import { IoCheckbox } from "react-icons/io5";
import moment from "moment";
import { BsReceipt } from "react-icons/bs";
import ViewRecipet from "../FeeCollection/ViewRecipet";
import Logo from "../../utils/Adds/Logo.png";
// import getDoc from "./DocIssue";

export default function StudentDocs() {
  const [userType, setUserType] = useState("student");
  const [staffName, setStaffName] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [Item, setItem] = useState("");

  const [template_id, setTemplate_id] = useState("");
  // const [id, setId] = useState("");
  const [templates, setTemplates] = useState([]);
  const [documentName, setDocumentName] = useState("");
  const [docs, setDocs] = useState([]);
  const [studentId, setStudentId] = useState("");

  const [student, setStudent] = useState({});
  // const [addMore, setAddMore] = useState(false);
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

  const [fees, setFees] = useState(null);
  const [parent, setParent] = useState({});
  const [studentClass, setStudentClass] = useState({});
  const [isCheckClassFee, setisCheckClassFee] = useState(null);

  const [reciptDetails, setreciptDetails] = useState(null);
  const [multistudents, setmultistudents] = useState(null);

  const monthsArray = [];

  const printRef = useRef(null);
  const [totalMonths, setTotalMonths] = useState();

  useEffect(() => {
    getDocs();
  }, []);

  useEffect(() => {
    getTemplate();
  }, []);

  const getTemplate = async () => {
    try {
      const response = await fetch(`${SERVER}/template`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      const data = await response.json();
      setTemplates(data.templates);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getDocs = async () => {
    try {
      const response = await fetch(`${SERVER}/templateDocs/getDocuments`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
      });
      const data = await response.json();
      console.log("docs", data.result);
      setDocs(data.result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      studentName: student.name,
      isDelete: isDelete,
      userType: userType,
      template_id: template_id,
      user_id: student?._id,
    };

    try {
      const response = await fetch(`${SERVER}/templateDocs/createDocument`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(formData);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

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

  // let mainMonthArray = [];

  // Initialize the months array with 12 zeros.
  const initialMonths = Array(12).fill(0);
  const [months, setMonths] = useState(initialMonths);

  const selectMultipleHandler = (id) => {
    handleSearchStudent(id);
    setmultistudents(null);
  };
  //   student search for multistudent modal
  const handleSearchStudent = async (query = null) => {
    try {
      let url = query ? `${studentId}?student_id=${query}` : studentId;
      const { data } = await axios.get(
        `${SERVER}/courseplatform/searchStudent/${url}`,
        { withCredentials: true }
      );
      if (data.success && data.unique) {
        setStudent(data.data);
        // setId(student?.user_id)
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

  // const handleCheckboxChange = (index) => {
  //     const updatedMonths = [...months];
  //     updatedMonths[index] = updatedMonths[index] === 1 ? 0 : 1;
  //     setMonths(updatedMonths);

  //     const selectedMonths = updatedMonths.some((month) => month === 1);
  //     setSelectCheckbox(selectedMonths);
  // };

  useEffect(() => {
    const fetchSession = async () => {
      const res = await axios.get(`${SERVER}/sessions/active`, {
        withCredentials: true,
      });
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

    const monthName = monthNames[parseInt(month, 10) - 1];
    return `${year} ${monthName}`;
  }

  console.log(studentId);

  return (
    <>
      <div className="noprint">
        <div className="card px-3 pt-3 mb-4">
          <h2 className="fw-bold  text-primary">Document Center</h2>
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
                Document History
              </h5>
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Date</th>
                    <th scope="col">View</th>
                  </tr>
                </thead>
                <tbody>
                  {userType == "student" &&
                    student.name &&
                    docs?.map((item) => (
                      <>
                        <tr>
                          <td key={item._id}>{student?.name}</td>
                          <td key={item._id}>
                            {moment(item.createdAt).format("DD/MM/YY")}
                          </td>
                          <td>
                            <button
                              data-bs-toggle="modal"
                              data-bs-target="#viewmodal"
                              className=" btn btn btn-outline-primary"
                              onClick={() => {
                                setItem(item);
                              }}
                            >
                              <BsReceipt />{" "}
                            </button>
                          </td>
                        </tr>
                      </>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {showFees && (
          <>
            <div className="col-12 bg-white mt-3">
              <label htmlFor="for" className="fw-bold fs-7">
                {" "}
                Select Document Name:
              </label>
              <select
                value={documentName}
                onChange={(e) => {
                  setDocumentName(e.target.value);
                  setTemplate_id(e.target.value);
                }}
                className="form-control"
                id="for"
                name="for"
                required
              >
                {templates &&
                  templates?.map((item, index) => (
                    <option key={index} value={item._id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* {templates.map((item, index) =>
                                    <tr key={index}>
                                        <td key={index}>{item.name}</td>
                                        <td>
                                            <button className="btn btn-primary m-1 fs-8" onClick={setTemplate_id(item._id)}>Issue</button>
                                        </td>
                                    </tr>
                                )} */}

            {/* {!addMore && (
                            <button
                                className="btn btn-warning"
                                value={addMore}
                            // onClick={() => setAddMore(true)}
                            >
                                Show More Months
                            </button>
                        )} */}

            <div>
              <button
                className="btn btn-primary my-4 fs-6"
                disabled={!student}
                onClick={handleSubmit}
                data-bs-toggle="modal"
                data-bs-target="#showmodal"
              >
                Submit
              </button>
            </div>
          </>
        )}

        {/* View  modal */}
      </div>

      <div
        className="modal fade"
        id="viewmodal"
        ref={printRef}
        tabIndex="-1"
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
              <div className=" bg-dark" style={{ padding: "1px" }}></div>

              <div style={{ fontSize: "30px" }}>
                <div className="d-flex justify-content-center">
                  <p className="h1 fw-bold mt-3">
                    {" "}
                    {Item?.document?.template_id?.name}
                  </p>
                </div>

                <div className=" m-3">
                  <div>To,</div>
                  <div>{student?.name}</div>
                  <div>{"S/O " + parent.fathername}</div>
                  {/* <div>Delhi</div> */}
                </div>
                <div className=" m-3 d-flex">
                  <div className="fw-bold">Subject :</div>
                  <div className="fw-bold">
                    &emsp; {Item?.document?.template_id?.subject}
                  </div>
                </div>
                <div className="m-3 d-flex">
                  {/* <div> :</div> */}
                  <div className="col">
                    {" "}
                    {templates
                      ?.find((item) => item?._id === template_id)
                      ?.desc.map((descItem) => {
                        if (descItem?.includes("STUDENT")) {
                          return descItem.replace("STUDENT", student.name);
                        } else {
                          return descItem;
                        }
                      
                       } )
                    }
                  </div>
                </div>

                <div className="m-3 d-flex">
                  {/* <div>For : </div> */}
                  {/* <div>{editData.for}</div> */}
                </div>
                <div className=" m-3 w-100">
                  <div></div>
                </div>
              </div>

              <div className="col-lg-12 text-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg my-1"
                  onClick={printInvoiceFunction}
                >
                  <i className="fa fa-print"></i> Print
                </button>
                {/* <button type="button" className="btn btn-primary btn-lg my-1">
                                    <i className="fa fa-paper-plane-o"></i> Send Invoice
                                </button> */}
              </div>
              <div className=" bg-dark" style={{ padding: "1px" }}></div>

              <div className="m-2">
                <div className="h4 text-center">
                  {school.name},{school.address}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <ViewRecipet
                // modalid="ShowReciept"
                id = "viewmodal"
                transcation_id={reciptDetails}
                totalMonths={totalMonths}
            /> */}

      <MultiStudentsModal
        formId="showmultiplestudents"
        data={multistudents}
        submitHandler={selectMultipleHandler}
      />

      <div
        className="modal fade"
        id="showmodal"
        ref={printRef}
        tabIndex="-1"
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
              <div className=" bg-dark" style={{ padding: "1px" }}></div>

              <div style={{ fontSize: "30px" }}>
                <div className="d-flex justify-content-center">
                  <p className="h1 fw-bold mt-3">
                    {" "}
                    {templates?.find((item) => item?._id === template_id)?.name}
                  </p>
                </div>

                <div className=" m-3">
                  <div>To,</div>
                  {/* <div>{staffs.find((item) => item._id === staffName)?.name}</div> */}
                  <div>{student?.name}</div>
                  <div>{"S/O " + parent.fathername}</div>
                </div>
                <div className=" m-3 d-flex">
                  <div className="fw-bold">Subject :</div>
                  <div className="fw-bold">
                    {
                      templates?.find((item) => item?._id === template_id)
                        ?.subject
                    }
                  </div>
                </div>
                <div className="m-3 d-flex">
                  {/* <div> :</div> */}
                  <div className="d-flex flex-nowrap">
                    {templates
                      ?.find((item) => item?._id === template_id)
                      ?.desc.map((descItem) => {
                        if (descItem?.includes("STUDENT")) {
                          return descItem.replace("STUDENT", student.name);
                        } else {
                          return descItem;
                        }
                      
                       } )
                    }
                  </div>
                </div>

                <div className="m-3 d-flex">
                  {/* <div>Date : </div> */}
                  <div></div>
                  {/* {console.log(templates.)} */}
                  {/* {(templates?.find((item) => item?._id === template_id)?.createdAt())} */}
                </div>
              </div>
              <div className="col-lg-12 text-end">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-lg my-1"
                  onClick={printInvoiceFunction}
                >
                  <i className="fa fa-print"></i> Print
                </button>
                {/* <button type="button" className="btn btn-primary btn-lg my-1">
                                    <i className="fa fa-paper-plane-o"></i> Send Invoice
                                </button> */}
              </div>

              <div className=" bg-dark" style={{ padding: "1px" }}></div>

              <div className="m-2">
                <div className="h4 text-center">
                  {school.name},{school.address}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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

//                                                     .............................   print ..............................
