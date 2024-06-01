import React, { useEffect, useState } from "react";
import { SERVER } from "../../config";
import Addbutton from "../../utils/AddButton/Addbutton";
import { InstilTable, TableState } from "../MainComponents/InstillTable";
import { AiOutlineEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { getTypeToken } from "../../Context/localStorage";
import moment from "moment";
import axios from "axios";
import AddQuery from "./AddQuery";
import Swal from "sweetalert2";
import { FaFileDownload } from "react-icons/fa";
import { GrDocumentExcel } from "react-icons/gr";

const Query = () => {
  const type = getTypeToken();
  const [allquery, setallquery] = useState([]);
  const [staffType, setStaffType] = useState([]);

  const [tableState, setTableState] = useState(TableState.LOADING);

  const nav = useNavigate();

  const getQuries = async () => {
    try {
      setTableState(TableState.LOADING);
      const { data } = await axios.get(`${SERVER}/complain/queries`, {
        withCredentials: true,
      });
      if (data.success) {
        setallquery(data.data);
        setTableState(TableState.SUCCESS);
      }
    } catch (error) {
      setTableState(TableState.ERROR);
      console.error("Error:", error);
    }
  };

  const getStaffType = async () => {
    try {
      await fetch(SERVER + "/staffmanage/getStaffType", {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setStaffType(data.data));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddQuery = async (newComplain) => {
    const formData = new FormData();
    console.log(newComplain);

    try {
      for (const key in newComplain) {
        if (key === "complainTo") {
          formData.append("complainTo", JSON.stringify(newComplain.complainTo));
        } else {
          formData.append(key, newComplain[key]);
        }
      }
      //   console.log(formData);
      //   formData.forEach((value, key) => {
      //     console.log(key, value);
      //   });
      await fetch(`${SERVER}/complain/add/query`, {
        method: "POST",
        body: formData,
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.success) {
            getQuries();
            Swal.fire({
              title: "Success",
              text: "Query Added Successfully",
              icon: "success",
              timer: 3000,
            });
          }
        });

      // getComplaint();
    } catch (error) {
      console.error("Error creating material:", error);
    }
  };

  useEffect(() => {
    getQuries();
    getStaffType();
  }, []);

  return (
    <>
      <div className="card">
        {type !== "admin" ? (
          <div className="px-3">
            <Addbutton
              title={"Queries"}
              buttonTitle={"Ask Query"}
              formId={"addQuery"}
            />
          </div>
        ) : (
          <h3 className="text-primary fw-bold p-3">Query</h3>
        )}
      </div>

      <div className="pt-0">
        <InstilTable
          tableState={tableState}
          titles={[
            "Sr No",
            "Title",
            "Date",
            "Status",
            "Read",
            "Document",
            "View",
          ]}
          rows={allquery.map((item, idx) => ({
            "Sr No": <p className="fw-bold text-secondary">{idx + 1}</p>,
            Date: moment(item.dateCreated).format("D MMM"),
            Title: item.complainTitle,
            View: (
              <button
                type="button"
                className="btn btn-outline-primary"
                data-bs-toggle="modal"
                onClick={() => nav(`/complaints/${item._id}`)}
              >
                View
              </button>
            ),
            Status: item.complainStatus ? (
              <span className="badge bg-success">Solved</span>
            ) : (
              <span className="badge bg-danger">Unsolved</span>
            ),
            Read: item.isReaded ? (
              <span style={{ fontSize: "large" }}>
                <AiOutlineEye />
              </span>
            ) : (
              <span style={{ fontSize: "large" }}>
                <AiFillEyeInvisible />
              </span>
            ),
            Document: item?.complainDoc ? (
              <a
                href={`${SERVER}/complaints/${item.complainDoc}`}
                target="_blank"
                // download={`${SERVER}/complaints/${item.complainDoc}`}
                // download={item.complainDoc}
                className="btn btn-success"
                style={{ fontSize: "large" }}
              >
                <FaFileDownload />
              </a>
            ) : (
              <button className="btn btn-secondary" disabled>
                <GrDocumentExcel size={18} color="white" />
              </button>
            ),
          }))}
        />
      </div>

      <AddQuery
        formId={"addQuery"}
        title={"Add Query"}
        staffType={staffType.length === 0 ? null : staffType}
        handleAddQuery={handleAddQuery}
      />
    </>
  );
};

export default Query;
