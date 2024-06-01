import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SERVER } from "../../config";
import logo from "../../utils/imgs/loginpage.png";
import { addTypeToken } from "../../Context/localStorage";
import { setLoginTokenCookie } from "../../Context/cookies";
import { motion } from "framer-motion";
import React from "react";

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
              alert("Invalid phone number");
              console.error("Authentication failed");
            } else {
              if (data.allUsers) {
                setAllCollections(data.allUsers);
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
            // else {
            //   alert("Hello");
            //   console.log(data.allUsers);
            // }
          });
      } else {
        alert("Enter a 10 digit number");
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
          if (data.type === "Accountant") {
            nav("/collectionhistory")
          }
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
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            addTypeToken(data.type);
            setLoginTokenCookie();
            if (data.type === "Accountant") {
              nav("/collectionhistory")
            }
            else nav("/home");
          } else {
            alert(data.error);
          }
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
      // handleOTP(id);
      setOtpsend(true);
    }
    console.log(currentId);
  };

  return (
    <div
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
      <motion.div
        initial={{ transform: "translateY(100vh)", opacity: 0 }}
        animate={{ transform: "translateY(0vh)", opacity: 1 }}
        transition={{ duration: 3, type: "spring", stiffness: 100 }}
        style={{
          display: "flex",
          flexDirection: "column",
          width: 450,
          backgroundColor: "#484c7f",
          padding: "60px",
          color: "white",
          marginBottom: "20px",
          marginLeft: "50px",
          borderRadius: "10px",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
        }}
      >
        <div style={{ width: "100%" }}>
          <h1
            style={{
              fontWeight: "700",
              textAlign: "center",
              paddingBottom: 60,
            }}
          >
            Login
          </h1>
        </div>
        <div>
          <div className="mb-2">
            <label className="form-label">Phone number</label>
            <input
              ref={ref}
              type="number"
              className="form-control form-control-lg"
              placeholder="+91"
              maxLength={10}
              // minLength={10}
            />
          </div>
        </div>
        {/* --------------- */}
        {showCards && (
          <>
            <h6>Login As?</h6>
            <div className="d-flex justify-content-center gap-5 ">
              {allCollections?.map((item) => (
                <div
                  onClick={() => handleCardUser(item)}
                  className="bg-white rounded d-flex flex-column justify-content-center align-items-center shadow-lg"
                  style={{
                    height: 60,
                    width: 100,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: "bold" }}>
                    {item.name}
                  </span>
                  <span style={{ fontSize: 8 }}>{item?.type}</span>
                  <p className="text-primary" style={{ fontSize: 6 }}>
                    {item?.school?.name}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}

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
              {otpsend ? "Submit" : "Send OTP"}
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}
