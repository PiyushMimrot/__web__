import React, { useEffect, useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { RiFileExcel2Line } from "react-icons/ri";

function ViewBank({ materials, onClose }) {
  return (
    <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
      <div className="modal-content bg-transparent">
        <div className="modal-header">
          <h5 className="modal-title text-white  fw-bold" id="leaveaddLabel">
            Materials
          </h5>
          <button
            type="button"
            className="btn-close btn-light bg-white"
            onClick={onClose}
          />
        </div>
        <div className="modal-body">
          {materials?.length > 0 ? (
            <div className="d-flex gap-5">
              {materials?.map((item, index) => (
                <a
                  href={item?.url}
                  target="_blank"
                  className=" rounded rounded-lg"
                  style={{ height: 250 }}
                >
                  <div style={{ height: "75%", width: 200 }}>
                    <img
                      src={"assets/images/gallery/Logo.png"}
                      alt="..."
                      style={{ height: "100%", width: "100%" }}
                    />
                  </div>
                  <div
                    style={{ height: "25%" }}
                    className="bg-primary shadow-lg text-white p-2"
                  >
                    <div className="">
                      <div
                        style={{ fontSize: 12 }}
                        className="m-0 d-flex justify-content-end align-items-center"
                      >
                        <e>
                          <IoEyeOutline size={15} />
                        </e>
                        <e>2.5k</e>
                      </div>
                      <div className="d-flex flex-column ">
                        <p className="m-0" style={{ fontSize: 10 }}>
                          Title:
                        </p>
                        <h6
                          className="mb-0 text-capitalize"
                          style={{ fontSize: 15 }}
                        >
                          {item?.title}
                        </h6>
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div
              className="d-flex bg-white justify-content-center align-items-center rounded rounded-lg shadow-lg"
              style={{ height: 200 }}
            >
              <h5>No Materials to show!</h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function SupperAdminOption({ onClose, setStudentInFocus }) {
  return (
    <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
      <div className="modal-content bg-transparent">
        <div className="modal-header">
          <button
            type="button"
            className="btn-close bg-white"
            onClick={onClose}
          />
        </div>
        <div className="modal-body d-flex justify-content-center align-items-center gap-5">
          <button
            className="btn btn-primary text-white"
            onClick={() => setStudentInFocus({ for: "material" })}
          >
            <IoEyeOutline size={30} />
          </button>
          <button
            className="btn btn-success text-white"
            data-bs-toggle="modal"
            data-bs-target="#excelmaterialadd"
            onClick={onClose}
          >
            <RiFileExcel2Line size={30} />
          </button>
        </div>
      </div>
    </div>
  );
}
export default ViewBank;
