import React, { useRef, useState, useEffect } from "react";
import { StudentInfo } from "../student_apis.js";
import { SERVER } from "../../../config.js";
import moment from "moment";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaAddressCard } from "react-icons/fa/index.js";
import Logo from "../../../utils/Adds/Logo.png"
export const ShowDetails = (props: {
  onClose: () => void;

  currentStudent?: StudentInfo;
  sectionId?: string;
}) => {
  const navigation = useNavigate();
  const studentRef = useRef<StudentInfo>({});
  const [showMore, setShowMore] = useState(false);
  const [photo, setPhoto] = useState<File>();
  const [aadhar, setAadhar] = useState<File>();

  const [school, setSchool] = useState("")
  const printRef = useRef(null);

  const printInvoiceFunction = () => {
    window.print(printRef.current.innerHTML);
  };
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
  return (
    <div className="modal-dialog modal-dialog-centered modal-md mb-0 modal-dialog-scrollable" ref={printRef}>
      <div className="modal-content">
        <div className="modal-header bg-primary">
          <h5 className="modal-title  text-light fw-bold" id="leaveaddLabel">
            Student View
          </h5>
          <button type="button" className="btn-close" onClick={props.onClose} />
        </div>
        <div className="modal-body ">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // props.onSubmit(studentRef.current);
            }}
          >
            <div className="card teacher-card m-0">
              <div className="card-body  teacher-fulldeatil">
                <div className="profile-teacher  text-center  me-2 ">
                  <img
                    src={`${SERVER}/photo/${props?.currentStudent?.photo}`}
                    onError={(e) => {
                      // @ts-ignore
                      e.target.src = "/assets/images/gallery/no-image.png";
                    }}
                    className="avatar xl rounded-circle img-thumbnail shadow-sm"
                  />

                  <div className="about-info d-flex align-items-center mt-2 justify-content-center flex-column">
                    <h6 className="mb-0 fw-bold d-block fs-4">
                      {props.currentStudent?.name}
                    </h6>
                    <span className="text-muted  mt-0 fs-5">
                      Student Id : {props?.currentStudent?.studentId}
                    </span>
                    <span className="py-0 fw-bold medium-90 mb-0 mt-0 text-muted fs-5">
                      {props?.currentStudent?.cls
                        ? `${props?.currentStudent?.cls} - ${props?.currentStudent?.sec}`
                        : "Class Not Assigned"}
                    </span>
                  </div>
                </div>
                <div className=" border-dark ps-xl-5 md-3 ps-sm-4 ps-1 w-100">


                  <div className="row g-3 pt-3">
                    <div className="col-xl-5">
                      <div className="d-flex align-items-center">
                        <i className="icofont-ui-touch-phone fs-4" />
                        <span className="ms-2 fs-6">
                          {props?.currentStudent?.number}
                        </span>
                      </div>
                    </div>
                    <div className="col-xl-5">
                      <div className="d-flex align-items-center">
                        <i className="icofont-email fs-5" />
                        <span className="ms-2 fs-6">
                          {props?.currentStudent?.dob
                            ? moment(props?.currentStudent?.dob).format(
                              "DD/MM/YYYY"
                            )
                            : ""}
                        </span>
                      </div>
                    </div>
                    <div className="col-xl-5">
                      <div className="d-flex align-items-center">
                        <i className="icofont-address-book fs-5" />
                        <span className="ms-2 fs-6">
                          {props?.currentStudent?.gender}
                        </span>
                      </div>
                    </div>
                    <div className="col-xl-5">
                      <div className="d-flex align-items-center">
                        <i className="icofont-address-book fs-5" />
                        <span className="ms-2 fs-6">
                          {props?.currentStudent?.religion}
                        </span>
                      </div>
                    </div>

                    <div className="col-xl-5">
                      <div className="d-flex align-items-center">
                      <FaAddressCard   className = "fs-5"/>
                        <span className="ms-2 fs-6">
                          {props?.currentStudent?.aadhar_number}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end align-items-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-lg py-1"
                      onClick={printInvoiceFunction}
                    >
                      <i className="fa fa-print"></i> Print
                    </button>

                    {/* <Link to={"/student/" +props?.currentStudent?.id }>
                    <button
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      // onClick={() =>
                      //   navigation("/student/" + props?.currentStudent?.id, {
                      //     state: {
                      //       studentId: props?.currentStudent?.id,
                      //       sectionId: props?.currentStudent?.sectionId,
                      //     },
                      //   })
                      // }
                    >
                      More
                    </button>
                    
                    </Link> */}

                    <Link to={"/student/" + props?.currentStudent?.id} state={{ userData: props.currentStudent }} >
                          <button className="btn btn-primary " data-bs-dismiss="modal"
                            aria-label="Close"
                          >More
                          </button>
                        </Link>


                    
                  </div>
                </div>
              </div>
            </div>
            <div className=" d-flex bg-primary  align-items-center p-1 rounded">
              <img style={{ height: "70px", }}

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
              <p className="text-light fw-bold ms-2 fs-5 mt-2">
                {school?.name}</p>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};
