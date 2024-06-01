import React, { useState, useEffect } from "react";
import AddAdmin from "./AddAdmin";
import {
  InstilTable,
  TableState,
} from "../../Components/MainComponents/InstillTable";
import axios from "axios";
import { SERVER } from "../../config";
import { AiOutlineEye, AiFillEdit, AiFillDelete } from "react-icons/ai";
import Swal from "sweetalert2";
const AllSchools = () => {
  const [allSchools, setallSchools] = useState([]);
  const [tableState, settableState] = useState(TableState.LOADING);
  const [selectedSchool, setselectedSchool] = useState(null);
  const [reReq, setReReq] = useState(false);
  const fetchAllSchools = async () => {
    try {
      const { data } = await axios.get(`${SERVER}/supperAdmin/schools/all`, {
        withCredentials: true,
      });
      if (data.success) {
        setallSchools(data.data);
        settableState(TableState.SUCCESS);
      }
    } catch (error) {
      console.log(error);
      settableState(TableState.ERROR);
    }
  };
  useEffect(() => {
    fetchAllSchools();
  }, [reReq]);
  const handleDelete = async (schoolId) => {
    await axios
      .get(`${SERVER}/supperAdmin/del_school/${schoolId}`, {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        if (res) {
          Swal.fire({
            title: "Success",
            text: "School deleted Successfully",
            icon: "success",
            timer: 3000,
          });
          setReReq(!reReq);
        } else {
          Swal.fire({
            title: "Try Again",
            icon: "warning",
            timer: 3000,
          });
        }
      });
  };
  return (
    <>
      <div className="card p-3">
        <AddAdmin reReq={reReq} setreReq={setReReq} />
      </div>
      <div>
        <InstilTable
          tableState={tableState}
          titles={[
            "S.No",
            "Logo",
            "Name",
            "Code",
            "Email",
            "Phone",
            "Payments",
            "Actions",
          ]}
          rows={allSchools?.map((item, idx) => ({
            "S.No": idx + 1,
            Logo: (
              <img
                draggable="false"
                src={`${SERVER}/school_logo/${item?.logo}`}
                // src="https://png.pngtree.com/png-clipart/20211017/original/pngtree-school-logo-png-image_6851480.png"
                alt="logo"
                style={{ width: "45px", height: "45px" }}
              />
            ),
            Name: item?.name,
            Code: item?.schoolCode,
            Email: item?.email,
            Phone: item?.phone,
            Payments: (
              <button
                className="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#showschoolpayments"
                onClick={() => setselectedSchool(item)}
              >
                Payments
              </button>
            ),
            Actions: item?.isDeleted ? (
              "Deleted"
            ) : (
              <button
                type="button"
                className="btn btn-outline-secondary deleterow"
                onClick={() => handleDelete(item?._id)}
              >
                <AiFillDelete className="text-danger" />
              </button>
            ),
          }))}
        />
        <ShowPayments data={selectedSchool} />
      </div>
    </>
  );
};

const ShowPayments = ({ data }) => {
  return (
    <div
      className="modal fade"
      id="showschoolpayments"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title  fw-bold">{data?.name} Payments</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div>
              <center>No Payments</center>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllSchools;
