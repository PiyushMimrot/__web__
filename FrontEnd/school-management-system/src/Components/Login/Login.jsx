import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER } from "../../config";
import logo from "../../utils/imgs/loginpage.png";
import { addTypeToken } from "../../Context/localStorage";
import { setLoginTokenCookie } from "../../Context/cookies";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

function InstilImage() {
  return (
    <motion.div
      initial={{ transform: "translateY(-100vh)", opacity: 0 }}
      animate={{ transform: "translateY(0vh)", opacity: 1 }}
      transition={{ duration: 3, type: "spring", stiffness: 100 }}
      className="row g-0 align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <img
        draggable={false}
        src={logo}
        style={{ width: "450px" }}
        alt="login-img"
      />
    </motion.div>
  );
}

export default function Login() {
  const nav = useNavigate();
  const ref = useRef(null);
  const otpRef = useRef(null);
  const pinRef = useRef(null);
  const userPinRef = useRef(null);
  const [otpsend, setOtpsend] = useState(false);
  const [pinCheck, setPinCheck] = useState(false);
  const [allCollections, setAllCollections] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const [currentType, setCurrentType] = useState("");
  const [showCards, setShowCards] = useState(false);
  const [userphone, setuserphone] = useState("");
  const submitPhoneNumber = async () => {
    try {
      if (ref.current.value.length === 10) {
        const response = await fetch(`${SERVER}/login/send-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber: ref.current.value }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data?.allUsers?.length === 0) {
              Swal.fire({
                title: "Invalid Number!",
                text: "The number you entered is incorrect. Please try again.",
                icon: "error",
                confirmButtonText: "Okay",
              });
              console.error("Authentication failed");
            } else {
              if (data.allUsers) {
                setAllCollections(data.allUsers);
                let modal = new bootstrap.Modal(
                  document.getElementById("showmultiplestudents")
                );
                modal.show();
                setShowCards(true);
              } else {
                if (data.verified) {
                  setPinCheck(true);
                  setCurrentId(data.singleUser._id);
                  setCurrentType(data.singleUser.type);
                } else {
                  setOtpsend(true);
                  setCurrentId(data.singleUser._id);
                  setCurrentType(data.singleUser.type);
                }
              }
            }
          });
      } else {
        Swal.fire({
          title: "Enter 10 digit number!",
          icon: "warning",
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      console.error("An error occurred during authentication", error);
    }
  };

  console.log({ currentId, currentType });
  const otpSubmit = async () => {
    try {
      const response = await fetch(`${SERVER}/login/verify-otp`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentId,
          type: currentType,
          otpCode: otpRef.current.value,
          pin: pinRef.current.value,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          addTypeToken(data.type);
          setLoginTokenCookie();
          if (data.type == "Accountant") nav("/collectionhistory");
          else nav("/home");
        } else {
          alert(data.error);
        }
      } else {
        alert("Invalid OTP");
        console.error("Authentication failed");
      }
    } catch (error) {
      console.error("An error occurred during authentication", error);
    }
  };

  const userPinCheck = async () => {
    try {
      const response = await fetch(`${SERVER}/login/verify-pin`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: currentId,
          type: currentType,
          pin: userPinRef.current.value,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          addTypeToken(data.type);
          setLoginTokenCookie();
          if (data.type === "Accountant") {
            nav("/collectionhistory");
          } else nav("/home");
        } else {
          alert(data.error);
        }
      } else {
        alert("Invalid OTP");
        console.error("Authentication failed");
      }
    } catch (error) {
      console.error("An error occurred during authentication", error);
    }
  };

  const handleOTP = async (id) => {
    // OTP HANDLING API SHOULD BE DONE HERE
    setOtpsend(true);
  };

  const handleCardUser = (item) => {
    setShowCards(false);
    setCurrentId(item._id);
    setCurrentType(item.type);
    if (item.verified) {
      setPinCheck(true);
    } else {
      setOtpsend(true);
    }
    console.log(currentId);
  };

  return (
    <div
      className="dah"
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        userSelect: "none",
      }}
    >
      <InstilImage />

      <div className="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg auth-h100">
        <div
          className="w-100 p-3 p-md-5 card border-0 bg-dark text-light"
          style={{ maxWidth: "32rem" }}
        >
          <form className="row g-1 p-3 p-md-4">
            <div className="col-12 text-center mb-1 mb-lg-5">
              <h1 style={{ fontWeight: "700" }}>Login</h1>
              <span>Instil</span>
            </div>
            <div className="col-12">
              <div className="mb-2">
                <label className="form-label">Phone Number</label>
                <input
                  readOnly={showCards || pinCheck}
                  ref={ref}
                  value={userphone}
                  type="number"
                  className="form-control form-control-lg"
                  placeholder="+91"
                  maxLength={10}
                  onChange={(e) => {
                    let num = String(e.target.value);
                    if (num.length <= 10) {
                      setuserphone(e.target.value);
                    }
                  }}
                  pattern="\b\d{10}\b"
                />
              </div>
            </div>

            {otpsend && (
              <>
                <div className="col-12">
                  <div className="mb-2">
                    <label className="form-label">OTP</label>
                    <input
                      ref={otpRef}
                      type="email"
                      className="form-control form-control-lg"
                      placeholder="otp"
                    />
                  </div>
                </div>
                <div className="col-12">
                  <div className="mb-2">
                    <label className="form-label">Set Pin</label>
                    <input
                      ref={pinRef}
                      type="string"
                      className="form-control form-control-lg"
                      placeholder="*****"
                      maxLength={5}
                    />
                  </div>
                </div>
              </>
            )}
            {pinCheck && (
              <div className="col-12">
                <div className="mb-2">
                  <label className="form-label">Enter Pin</label>
                  <input
                    ref={userPinRef}
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="*****"
                    maxLength={5}
                    pattern="\b\d{5}\b"
                  />
                </div>
              </div>
            )}
            <div className="col-12 text-center mt-4">
              {pinCheck ? (
                <a
                  onClick={() => userPinCheck()}
                  className="btn btn-lg btn-block btn-light lift text-uppercase"
                  alt="SIGNUP"
                >
                  {"LOGIN"}
                </a>
              ) : (
                <a
                  onClick={() => (otpsend ? otpSubmit() : submitPhoneNumber())}
                  className="btn btn-lg btn-block btn-light lift text-uppercase"
                  alt="SIGNUP"
                >
                  {otpsend ? "Submit" : "login"}
                </a>
              )}
            </div>
          </form>
        </div>
      </div>
      <MultiStudentsModal
        formId="showmultiplestudents"
        data={allCollections}
        submitHandler={handleCardUser}
      />
    </div>
  );
}

const MultiStudentsModal = ({ formId, data, submitHandler }) => {
  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable ">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="addholidayLabel">
              Choose an Account
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="d-flex " style={{ height: "170px", gap: "25px" }}>
              {data.map((item, index) => (
                <div className="d-flex shadow-lg p-2" key={item?.id}>
                  <Card item={item} submitHandler={submitHandler} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Card({ item, submitHandler }) {
  const selectedStudentHandler = (id) => {
    console.log("Hellosjdfksjdflksjfjskdjfldfklfjsldfh");
    submitHandler(id);
  };
  return (
    <div
      className="text-center"
      data-bs-dismiss="modal"
      aria-label="Close"
      onClick={() => selectedStudentHandler(item)}
      style={{ height: "50px", width: "100px" }}
    >
      {item?.type === "parent" && (
        <img
          style={{ height: "100px", width: "auto" }}
          src={"assets/images/lg/avatarparent.png"}
          className="card-img-top  shadow-lg rounded rounded-circle"
          alt="..."
        />
      )}
      {item?.type === "admin" && (
        <img
          style={{ height: "100px", width: "auto" }}
          src={"assets/images/lg/avatar5.jpg"}
          className="card-img-top shadow-lg rounded rounded-circle"
          alt="..."
        />
      )}
      {item?.type === "student" && (
        <img
          style={{ height: "100px", width: "auto" }}
          src={"assets/images/lg/avatar2.jpg"}
          className="card-img-top shadow-lg rounded rounded-circle"
          alt="..."
        />
      )}
      {item?.type === "teacher" && (
        <img
          style={{ height: "100px", width: "auto" }}
          src={"assets/images/lg/avatar3.jpg"}
          className="card-img-top shadow-lg rounded rounded-circle"
          alt="..."
        />
      )}

      <div className="">
        <h5 className="card-title  m-0" style={{ fontSize: "15px" }}>
          {item?.name}
        </h5>
        <p className="card-text m-0" style={{ fontSize: "10px" }}>
          {item.type}
        </p>
        <p className="card-text m-0 " style={{ fontSize: "10px" }}>
          {item?.school?.schoolCode}
        </p>
      </div>
    </div>
  );
}
