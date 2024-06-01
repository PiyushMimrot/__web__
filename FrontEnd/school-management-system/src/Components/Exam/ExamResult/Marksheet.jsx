import React, { useEffect } from "react";



export default function Marksheet({ formId, details,Parent, item, onClose }) {


// console.log("Item-----------------",details)


  return (
    <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
      <div className="modal-content bg-light">
        <div className="modal-header">
          <button
            type="button"
            className="btn-close bg-white"
            onClick={onClose}
          />
        </div>
        <div className="modal-body">
          <div className="row">
            <div className="d-flex justify-content-center">
              <div className="mt-1">
                <img
                  src="/assets/images/gallery/Logo.png"
                  className=""
                  style={{ height: 100 }}
                />
              </div>
              <div className="w-110">
                <h1
                  className="ms-5 fw-bold m-0"
                  style={{ color: "black", fontSize: 30 }}
                >
                  {details?.school?.name}
                </h1>
                <p className="text-center fs-5 m-0" style={{ color: "black" }}>
                  {details?.school?.address}
                </p>
                <h6 className="text-center  fs-5 m-0" style={{ color: "black" }}>
                  Marksheet &nbsp;Of&nbsp; Exam&nbsp; Name
                </h6>
                <h6
                  className="text-center fw-bold mt-2"
                  style={{ color: "black" }}
                >
                  Session&nbsp; : 2023-24
                </h6>
              </div>
            </div>
          </div>
          <div className=" bg-dark" style={{ padding: "1.5px" }}></div>

          <div className="row ">
            <div className="d-flex justify-content-between">
              <div className="ms-4 m-5 fs-5">
                <div className="d-flex">
                  <h5 className="fw-bold p-1">Student's Name :</h5>
                  <p className="mt-1">&emsp;{item?.name}</p>
                </div>
                <div className="d-flex">
                  <h5 className="fw-bold p-1">Mother's Name :</h5>
                  <p className="mt-1">&emsp;{Parent?.mothername}</p>
                </div>
                <div className="d-flex">
                  <h5 className="fw-bold p-1">Father's Name :</h5>
                  <p className="mt-1">&emsp;{Parent?.fathername}</p>
                </div>
                <div className="d-flex">
                  <h5 className="fw-bold p-1">Registration Number :</h5>
                  <p className="mt-1">&emsp;{item?.studentId}</p>
                </div>
              </div>
              <div className="me-5 m-5">
                <img src="./download.jpeg"></img>
              </div>
            </div>
          </div>
          <div className=" fs-5">
            <table className="table table-bordered border-dark">
              <thead className=" fs-5" style={{ borderWidth: "3px" }}>
                <tr style={{ borderWidth: "3px" }}>
                  <th className="fs-6" rowspan={1}>
                    <b>SUBJECTS</b>
                  </th>
                  <th colSpan={2} className="" style={{ borderWidth: "3px" }}>
                    <tr className=" fs-5 d-flex justify-content-center ">
                      <th className=" fs-6">TOTAL</th>
                    </tr>

                    <tr className="d-flex justify-content-around fs-5">
                      <th className="fs-6 fw-bold">PRACTICAL</th>
                      <th className="fs-6">THEORY</th>
                    </tr>
                  </th>
                  <th className="d-flex " rowspan={1} >
                    <p className="">
                      <b className="fs-6" >MARKS SCORED</b>
                    </p>
                  </th>
                  <th rowspan={1}>
                    <p>
                      <b className="fs-6">GRADE</b>
                    </p>
                  </th>
                </tr>
              </thead>
              <tbody  >
                {item?.subjects?.map((i, index) => (
                  <tr key={index}
                    style={{
                      border: '3px solid black'
                    }}
                  >
                    <td className="fw-bold" style={{ border: '3px solid black' }}
                    >
                      {i?.name}({i?.exam_total})
                    </td>
                    <td style={{ border: '3px solid black' }}>  &emsp;  &emsp;0</td>
                    <td  >  &emsp;  &emsp;{i?.marks}</td>
                    <td style={{ border: '3px solid black' }}>
                      &emsp; {Number(i?.marks)}
                    </td>

                    {(i.marks >= 97 && i.marks <= 100) ? <td>{"A+"}</td> : null}
                    {(i.marks >= 93 && i.marks <= 96) ? <td> {"A"}</td> : null}
                    {(i.marks >= 90 && i.marks <= 92) ? <td>{ "A-"}</td> : null}
                    {(i.marks >= 87 && i.marks <= 89) ? <td>{ "B+"}</td> : null}
                    {(i.marks >= 83 && i.marks <= 86) ? <td>{ "B"}</td> : null}
                    {(i.marks >= 80 && i.marks <= 82) ? <td>{ "B-"}</td> : null}
                    {(i.marks >= 77 && i.marks <= 79) ?<td> { "C+"}</td> : null}
                    {(i.marks >= 73 && i.marks <= 76) ? <td>{ "C" }</td> : null}
                    {(i.marks >= 70 && i.marks <= 72) ? <td>{ "C-" } </td>: null}
                    {(i.marks >= 67 && i.marks <= 69) ?<td> { "D+"}</td> : null}
                    {(i.marks >= 60 && i.marks <= 66) ? <td>{ "D"}</td> : null}
                    {(i.marks < 60) ?<td> { "F"}</td> : null}

                    {/* <td>{(i.marks >= 97 && i.marks <= 100) ? "A+" : null}</td>
                    <td>{(i.marks >= 93 && i.marks <= 96) ? "A" : null}</td>
                    <td>{(i.marks >= 90 && i.marks <= 92) ? "A-" : null}</td>
                    <td>{(i.marks >= 87 && i.marks <= 89) ? "B+" : null}</td>
                    <td>{(i.marks >= 83 && i.marks <= 86) ? "B" : null}</td>
                    <td>{(i.marks >= 80 && i.marks <= 82) ? "B-" : null}</td>
                    <td>{(i.marks >= 77 && i.marks <= 79) ? "C+" : null}</td>
                    <td>{(i.marks >= 73 && i.marks <= 76) ? "C" : null}</td>
                    <td>{(i.marks >= 70 && i.marks <= 72) ? "C-" : null}</td>
                    <td>{(i.marks >= 67 && i.marks <= 69) ? "D+" : null}</td>
                    <td>{(i.marks >= 60 && i.marks <= 66) ? "D" : null}</td>
                    <td>{(i.marks < 60) ? "F" : null}</td> */}




                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row ">
            <div
              className="col-3 py-2  d-flex my-3 "
              style={{ border: "2px solid black", marginLeft: "90px" }}
            >
              <div className="">
                <h5>A+ = 97-100</h5>
                <h5>A = 93-96</h5>
                <h5>A- = 90-92</h5>
                <h5>B+ = 87-89</h5>
                <h5>B = 83-86</h5>
                <h5>B- = 80-82</h5>
              </div>
            </div>
            <div
              className="col-3 py-2  d-flex my-3 "
              style={{ border: "2px solid black", borderCollapse: "collapse" }}
            >
              <div className="">
                <h5>C+ = 77-79</h5>
                <h5>C = 73-76</h5>
                <h5>C- = 70-72</h5>
                <h5>D+ = 67-69</h5>
                <h5>D = 60-66</h5>
                <h5>F = Below 60</h5>
              </div>
            </div>
            <div
              className="col-3 py-2  d-flex my-3  "
              style={{ border: "2px solid black", borderCollapse: "collapse" }}
            >
              <div className="">
                <h5>E= Excellent</h5>
                <h5>S = Satisfactory</h5>
                <h5>NI = Needs Improvement</h5>
                <h5>U = UnSatisfactory</h5>
                <h5>P = Pass</h5>
                <h5>F = Fail</h5>
              </div>
            </div>
          </div>


          <div className="row  m-0 p-0">
            <div className="col-8">
              <div className="col-6 border">
                <div className="d-flex ">
                  <p className="fw-bold fs-5">Status :</p>
                  <p className="fs-5">&emsp;Pass</p>
                </div>
              </div>
            </div>
            <div className="col-4">
              <p className="col p-2">
                <div className="d-flex  align-items-evenly">
                  <h5 className="fw-bold">Date :</h5>
                  <p>&emsp;</p>
                </div>
              </p>
            </div>
            <div className="col-8 border">
              <div className="d-flex ">
                <h5 className="fw-bold">Special Remark :</h5>
                <p className="fs-5">&emsp;NA</p>
              </div>
            </div>
            <div className="col-4">
              <div>
                <h5 className="fw-bold">Signature :</h5>
              </div>
            </div>
            <div className="col-8 p-2 border">
              <div className="d-flex ">
                <h5 className="fw-bold ms-1"> Issuer :</h5>
                <p className="fs-5">{ }</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
