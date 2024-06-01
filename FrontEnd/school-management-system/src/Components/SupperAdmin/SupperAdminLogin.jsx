import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../utils/imgs/loginpage.png";
import { setLoginTokenCookie } from "../../Context/cookies";
import { addTypeToken } from "../../Context/localStorage";
import { motion } from "framer-motion";
import React from "react";
import { SERVER } from "../../config";
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

export default function SupperAdminLogin() {
  const nav = useNavigate();
  const [phoneNumber, setphoneNumber] = useState("");
  const [pin, setpin] = useState("");

  const submitHandlerLogin = async () => {
    try {
      const response = await fetch(`${SERVER}/login/supperadmin`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          number: phoneNumber,
          pin,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        addTypeToken(data.type);
        setLoginTokenCookie();
        nav("/allschools");
      } else {
        Swal.fire({
          title: "Invalid Number or pin!",
          text: "Please try again.",
          icon: "error",
          confirmButtonText: "Okay",
        });
      }
    } catch (error) {
      console.error("An error occurred during authentication", error);
    }
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
            Supper Login
          </h1>
        </div>
        <div>
          <div className="mb-2">
            <label className="form-label">Phone number</label>
            <input
              type="number"
              className="form-control form-control-lg"
              placeholder="+91"
              maxLength={10}
              // minLength={10}
              value={phoneNumber}
              onChange={(e) => {
                let num = String(e.target.value);
                if (num.length <= 10) {
                  setphoneNumber(e.target.value);
                }
              }}
            />
          </div>
        </div>

        <div className="col-12">
          <div className="mb-2">
            <label className="form-label">Enter Pin</label>
            <input
              type="password"
              onChange={(e) => setpin(e.target.value)}
              className="form-control form-control-lg"
              placeholder="*****"
              maxLength={5}
              pattern="\b\d{5}\b"
            />
          </div>
        </div>

        <div className="col-12 text-center mt-4">
          <a
            onClick={submitHandlerLogin}
            className="btn btn-lg btn-block btn-light lift text-uppercase"
            alt="SIGNUP"
          >
            {"LOGIN"}
          </a>
        </div>
      </motion.div>
    </div>
  );
}
