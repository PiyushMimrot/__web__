import axios from "axios";
import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { SERVER } from "../../config";
import { RiFileExcel2Line } from "react-icons/ri";
import { RiFileDownloadLine } from "react-icons/ri";
import Swal from "sweetalert2";

function MultipleStaffAdd({ getStaffs }) {
  const fileInputRef = useRef(null);
  const [excelData, setExcelData] = useState();
  const [success, setSuccess] = useState(false);
  const [typeError, setTypeError] = useState({
    status: "good",
    msg: "Select a File!",
  });
  const handleClear = () => {
    fileInputRef.current.value = null;
    setTypeError({
      status: "good",
      msg: "Select a File!",
    });
    setSuccess(false);
  };

  const handleFileUpload = (e) => {
    const fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError({ status: "good", msg: "Click on Upload" });
        setSuccess(true);

        const reader = new FileReader();
        reader.readAsBinaryString(e.target.files[0]);
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json(sheet);
          setExcelData(parsedData);
        };
      } else {
        setTypeError({ status: "bad", msg: "Please select only excel file! " });
        setSuccess(false);
      }
    } else {
      console.log("Please Select File");
      setSuccess(false);
    }
  };
  const submitFileUpload = async () => {
    const dataPromise = excelData.map(async (item) => {
      if (item?.name && item?.phone && item?.staff_type) {
        const abc = await axios
          .get(`${SERVER}/staffmanage/getStaffType`, { withCredentials: true })
          .then((response) =>
            response?.data?.data?.find(
              (i) =>
                i?.name?.toLowerCase() === String(item.staff_type).toLowerCase()
            )
          )
          .then((data) => {
            item.staff_type = data?._id;
            item.school_id = data?.school_id;
          })
          .catch((err) => {
            Swal.fire({ title: "There might be some issue in excel!" });
          });
      } else {
        console.log("Name, Phone and Type are mandatory");
      }
    });
    Promise.all(dataPromise).then(
      async () =>
        await axios
          .post(
            `${SERVER}/multiple/addStaffs`,
            { excelData },
            {
              withCredentials: true,
            }
          )
          .then((res) => {
            getStaffs();
            handleClear();
            Swal.fire({
              title: "Success",
              text: "Staff Sheet Added Successfully",
              icon: "success",
              timer: 3000,
            });
          })
    );
  };
  return (
    <div className="mt-3">
      <button
        className="btn btn-success text-light btn-lg shadow-lg"
        data-bs-toggle="modal"
        data-bs-target="#my-modal"
      >
        <RiFileExcel2Line size={20} /> <e> Add Bulk</e>
      </button>
      {/* <Addbutton title={""} buttonTitle={"Add Multiple"} formId={"my-modal"} /> */}
      <div
        className="modal fade"
        id="my-modal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Upload an Excel Sheet
              </h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleClear}
              ></button>
            </div>

            <div className="modal-body">
              <input
                type="file"
                accept=".xlsx, .xls"
                className="form-control"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              {typeError.status === "good" ? (
                <div className="alert alert-primary mt-2" role="alert">
                  {typeError.msg}
                </div>
              ) : (
                <div className="alert alert-danger mt-2" role="alert">
                  {typeError.msg}
                </div>
              )}
              <p className="text-danger font-monospace">
                *Please ensure that the Excel includes mandatory columns:
                <p className="text-danger">name, phone, staff_type</p>
              </p>

              <div>
                <a
                  className="btn btn-danger text-light btn-lg shadow-lg"
                  href="../../../public/sampleDocs/staff.xlsx"
                  download="addmultiplestaff_sample.xlsx"
                >
                  <RiFileDownloadLine size={20} /> <e> Sample</e>
                </a>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={submitFileUpload}
                disabled={!success}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MultipleStaffAdd;
