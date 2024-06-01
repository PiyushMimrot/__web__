import { SERVER } from "../../../../config";
import { useEffect, useState } from "react";

export default function AdminD() {
  const [userData, setuserData] = useState({});
  const [userSchool, setUserSchool] = useState({});
  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = () => {
    fetch(SERVER + "/userDetail", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        setuserData(data.user);
        // setUserType(data.type)
        setUserSchool(data.school);
      });
  };
  return (
    <div className="card teacher-card  mb-3">
      <div className="card-body  d-flex teacher-fulldeatil">
        <div className="profile-teacher pe-xl-4 pe-md-2 pe-sm-4 pe-0 text-center w220 mx-sm-0 mx-auto">
          <a href="#">
            <img
              src="assets/images/lg/avatar3.jpg"
              alt=""
              className="avatar xl rounded-circle img-thumbnail shadow-sm"
            />
          </a>
          <div className="about-info d-flex align-items-center mt-3 justify-content-center flex-column">
            <h6 className="mb-0 fw-bold d-block fs-6">
              {userSchool.name || ""}
            </h6>
            <span className="text-muted small">{userSchool.address || ""}</span>
          </div>
        </div>
        <div className="teacher-info border-start ps-xl-4 ps-md-3 ps-sm-4 ps-4 w-100">
          <h6 className="mb-0 mt-2  fw-bold d-block fs-6">
            Admin Name : {userData.name}
          </h6>
          <span className="py-1 fw-bold small-11 mb-0 mt-1 text-muted">
            Principal
          </span>
          <p className="mt-2 small">
            The purpose of lorem ipsum is to create a natural looking block of
            text (sentence, paragraph, page, etc.) that doesn't distract from
            the layout. A practice not without controversy
          </p>
          <div className="row g-2 pt-2">
            <div className="col-xl-5">
              <div className="d-flex align-items-center">
                {/* <i className="icofont-ui-touch-phone"></i> */}
                <span className="ms-2 small">{userData.phoneNumber} </span>
              </div>
            </div>
            <div className="col-xl-5">
              <div className="d-flex align-items-center">
                {/* <i className="icofont-email"></i> */}
                <span className="ms-2 small">{userData.email}</span>
              </div>
            </div>
            <div className="col-xl-5">
              <div className="d-flex align-items-center">
                {/* <i className="icofont-birthday-cake"></i> */}
                <span className="ms-2 small">EST : 19/03/1980</span>
              </div>
            </div>
            <div className="col-xl-5">
              <div className="d-flex align-items-center">
                {/* <i className="icofont-address-book"></i> */}
                <span className="ms-2 small">
                  2734 West Fork Street,EASTON 02334.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
