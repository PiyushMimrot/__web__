import { useNavigate } from "react-router-dom";
import { SERVER } from "../../config";
import { useEffect, useState } from "react";
import { removeTypeToken } from "../../Context/localStorage";
import { removeLoginCookie } from "../../Context/cookies";
import { Link } from "react-router-dom";
import Logo from "../../utils/Adds/Logo.png";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { PiMaskHappy } from "react-icons/pi";
import { FaBookReader, FaRegAddressBook } from "react-icons/fa";
import { GoBell } from "react-icons/go";
import React from "react";
import moment from "moment";

type NavbarData = Partial<{
  schoolId: string;
  currentId: string;
  currentType: string;
  checkAttendance: boolean;
  schoolLogo: string;
  schoolInfo: { name: string };
  userData: any;
  userType: any;
  count: number;
}>;

const a = [
  {
    from: "Ramesh",
    desc: "Posted a new assignment!",
    type: "assignment",
  },
  {
    from: "Head Master",
    desc: "Practice Exam will be starting from 10/02/2024 ",
    type: "exam",
  },
  {
    from: "Head Master",
    desc: "There will be an Hoiday on 04/02/2024",
    type: "holiday",
  },
];

export default function Navbar() {
  const nav = useNavigate();
  const type = localStorage.getItem("type");
  const [data, setData] = useState<NavbarData>({
    schoolId: "",
    currentId: "",
    currentType: "",
    checkAttendance: false,
    schoolLogo: "",
    schoolInfo: { name: "" },
    count: 0,
  });
  // console.log({ data });
  useEffect(() => {
    (async () => {
      let result: NavbarData = {};
      const res = await fetch(SERVER + "/userDetail", {
        credentials: "include",
      });
      const data = await res.json();
      // console.log(data);

      result.userData = data.user;
      result.userType = data.type;
      result.schoolInfo = data.school;
      if (data.school.logo) {
        result.schoolLogo = `${SERVER}/school_logo/${data.school.logo}`;
      }

      const currentUser = await fetch(`${SERVER}/profile/type`, {
        credentials: "include",
      });
      if (!currentUser.ok) {
        throw new Error(`HTTP error! Status: ${currentUser.status}`);
      }
      const { schoolId, currentId, type } = await currentUser.json();
      result.currentType = type;
      result.schoolId = schoolId;
      result.currentId = currentId;

      if (result.userType === "admin" || result.userType === "teacher") {
        const getToday = await fetch(`${SERVER}/staffattendance/gettoday`, {
          credentials: "include",
        });
        if (!getToday.ok) {
          throw new Error(`HTTP error! Status: ${getToday.status}`);
        }
        const today = await getToday.json();

        let pending = today.filter((item: any) => item.status === 0);
        result.count = pending.length;

        today.map((ele: any) => {
          if (ele.staffId._id === currentId) {
            result.checkAttendance = true;
          }
        });
      }
      // console.log(result);
      setData(result);
    })();
  }, []);

  const handleSignout = async () => {
    try {
      const response = await fetch(`${SERVER}/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        removeTypeToken();
        removeLoginCookie();
        nav("/");
      } else {
        console.error("Sign-out failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const markAttendance = async () => {
    try {
      const mark = await fetch(`${SERVER}/staffattendance/add`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          staffId: data.currentId,
          schoolId: data.schoolId,
          date: moment().format(),
        }),
      });
      if (!mark.ok) {
        throw new Error(`HTTP error! Status: ${mark.status}`);
      }
      const d = await mark.json();
      // d && console.log("attendence marked");
      setData({ ...data, checkAttendance: true });
    } catch (error) {
      console.log(error);
    }
  };
  console.log(data);

  return (
    <nav
      style={{
        backgroundColor: "white",
        boxShadow: "0px 2px 0px #00000018",
        zIndex: 100,
        // maxWidth: "calc(100vw - 300px)",
        display: "flex",
        alignItems: "center",
        // justifyContent: "center",
        padding: "10px",
        marginTop: "7px",
        marginLeft: "5px",
        marginBottom: "10px",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <FiArrowLeft
          onClick={() => {
            nav(-1);
          }}
          size={25}
          style={{ cursor: "pointer" }}
        />
      </motion.div>
      <div
        onClick={() => {
          if (type !== "supperadmin") {
            nav("/home");
          }
        }}
        style={{
          marginLeft: "20px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
        <img
          draggable="false"
          src={data.schoolLogo ? data.schoolLogo : Logo}
          onError={(e) => {
            e.currentTarget.src = Logo;
          }}
          alt="logo"
          style={{ width: "45px", marginRight: "15px" }}
        />
        <div
          style={{
            whiteSpace: "nowrap",
            fontSize: 20,
            overflow: "hidden",
            marginRight: "15px",
            textOverflow: "ellipsis",
          }}
        >
          {data.schoolInfo?.name}
        </div>
      </div>
      <div className="h-right d-flex align-items-center">
        {data.currentType === "teacher" && (
          <button
            disabled={data.checkAttendance}
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#markAttendance"
          >
            Mark Attendance
          </button>
        )}
        {data.currentType === "admin" && (
          <button
            className="btn btn-info text-light shadow position-relative"
            onClick={() => nav("/staffattendance")}
          >
            Staff Attendance
            {data.count !== 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {data.count}
              </span>
            )}
            {/* <span className="visually-hidden">unread messages</span> */}
          </button>
        )}
        {/* Notification */}
        <div
          style={{ marginLeft: "20px" }}
          className="dropdown user-profile ml-2 ml-sm-3 d-flex align-items-center zindex-popover"
        >
          <a
            className="nav-link dropdown-toggle pulse p-0"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            data-bs-display="static"
          >
            <GoBell />
          </a>
          <div className="dropdown-menu rounded-lg shadow border-0 dropdown-animation dropdown-menu-end p-0 m-0">
            <div className="card border-0 w280">
              <div className="card-body pb-0 rounded-lg">
                {a?.map((item) => (
                  <div className="d-flex align-items-center row">
                    <div className="col-2">
                      {item.type === "holiday" ? (
                        <PiMaskHappy size={30} />
                      ) : item.type === "exam" ? (
                        <FaBookReader size={30} />
                      ) : (
                        <FaRegAddressBook size={30} />
                      )}
                    </div>
                    <div className="col-8">
                      <p style={{ fontSize: 10, margin: 0 }}>{item.from}</p>
                      <p style={{ fontSize: 12 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Profile */}
        <div
          style={{ marginLeft: "20px" }}
          className="dropdown user-profile ml-2 ml-sm-3 d-flex align-items-center zindex-popover"
        >
          <div className="u-info me-2">
            <p className="mb-0 text-end line-height-sm ">
              <span className="font-weight-bold">{data.userData?.name}</span>
            </p>
            <small className="text-capitalize">
              {data.currentType} Profile
            </small>
          </div>
          <a
            className="nav-link dropdown-toggle pulse p-0"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            data-bs-display="static"
          >
            <img
              className="avatar lg rounded-circle img-thumbnail"
              src={
                data.userType === "teacher"
                  ? `${SERVER}/staffphoto/${data.userData?.photo}`
                  : `${SERVER}/photo/${data.userData?.photo}`
              }
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg";
              }}
              alt="profile"
            />
          </a>
          <div className="dropdown-menu rounded-lg shadow border-0 dropdown-animation dropdown-menu-end p-0 m-0">
            <div className="card border-0 w280">
              <div className="card-body pb-0">
                <div className="d-flex py-1">
                  <img
                    className="avatar lg rounded-circle img-thumbnail"
                    src={
                      data.userType === "teacher"
                        ? `${SERVER}/staffphoto/${data.userData?.photo}`
                        : `${SERVER}/photo/${data.userData?.photo}`
                    }
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg";
                    }}
                    alt="profile"
                  />
                  <div className="flex-fill ms-3">
                    <p className="mb-0">
                      <span className="font-weight-bold">
                        {data.userData?.name}
                      </span>
                    </p>
                    <small>
                      {data.userData?.email ? data.userData.email : ""}
                    </small>
                  </div>
                </div>
                <div>
                  <hr className="dropdown-divider border-dark" />
                </div>
              </div>
              <div className="list-group m-2 ">
                {/* <a
                      href="task.html"
                      className="list-group-item list-group-item-action border-0 "
                    >
                      <i className="icofont-tasks fs-5 me-3" />
                      My Task
                    </a> */}
                {data.userType === "admin" && (
                  <a
                    href="/staff"
                    className="list-group-item list-group-item-action border-0 "
                  >
                    <i className="icofont-ui-user-group fs-6 me-3" />
                    Staff Members
                  </a>
                )}
                <a
                  href="#"
                  className="list-group-item list-group-item-action border-0 "
                  onClick={handleSignout}
                >
                  <i className="icofont-logout fs-6 me-3" />
                  Signout
                </a>
                <div>
                  <hr className="dropdown-divider border-dark" />
                </div>
                <Link
                  to={"/profile"}
                  className="list-group-item list-group-item-action border-0 "
                >
                  <i className="icofont-contact-add fs-5 me-3" />
                  My Personal Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="markAttendance"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="leaveaddLabel">
                Mark Attendance
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
                This will send a request for your attendance for date{" "}
                {new Date().toISOString().split("T")[0]} (today).
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={markAttendance}
              >
                Submit Attendance
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

//  {/* menu toggler */}
//         {/* <button
//           className="navbar-toggler p-0 border-0 menu-toggle order-3"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#mainHeader"
//         >
//           <span className="fa fa-bars" />
//         </button> */}
//         {/* main menu Search*/}
//         <div className="order-0 col-lg-4 col-md-4 col-sm-12 col-12 mb-3 mb-md-0 ">
//           <div className="input-group flex-nowrap input-group-lg">
//             {/* <button
//                 type="button"
//                 className="input-group-text"
//                 id="addon-wrapping"
//               >
//                 <i className="fa fa-search" />
//               </button>
//               <input
//                 type="search"
//                 className="form-control"
//                 placeholder="Search"
//                 aria-label="search"
//                 aria-describedby="addon-wrapping"
//               />
//               <button
//                 type="button"
//                 className="input-group-text add-member-top"
//                 id="addon-wrappingone"
//                 data-bs-toggle="modal"
//                 data-bs-target="#addUser"
//               >
//                 <i className="fa fa-plus" />
//               </button> */}
//           </div>
//         </div>

//         {/* <div className="dropdown notifications zindex-popover">
//           <a
//             className="nav-link dropdown-toggle pulse"
//             href="#"
//             role="button"
//             data-bs-toggle="dropdown"
//           >
//             <i className="icofont-alarm fs-5" />
//             <span className="pulse-ring" />
//           </a>
//           <div
//             id="NotificationsDiv"
//             className="dropdown-menu rounded-lg shadow border-0 dropdown-animation dropdown-menu-sm-end p-0 m-0"
//           ></div>
//         </div> */}
