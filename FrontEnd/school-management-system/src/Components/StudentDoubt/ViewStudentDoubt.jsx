import { SERVER } from "../../config";
import { MdOutlineDateRange } from "react-icons/md";
import moment from "moment";
import { PiStudentBold } from "react-icons/pi";
import { MdOutlineAccessTime } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ViewStudentDoubt({ formId, doubt, type }) {
  const [myData, setMydata] = useState();
  const handleDownload = async (material) => {
    await fetch(`${SERVER}/StudentDoubt/student-doubts/download/${material}`, {
      responseType: "blob",
      credentials: "include",
    })
      .then((response) => response.url)
      .then((url) => {
        const a = document.createElement("a");
        a.href = url;
        a.download = material.doc_path;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  };
  useEffect(() => {
    (async () => {
      await axios
        .get(`${SERVER}/studentAlign/studentById/${doubt?.student[0]?._id}`, {
          withCredentials: true,
        })
        .then((res) => {
          setMydata(res?.data[0]);
        });
    })();
  }, [doubt]);
  if (Object.keys(doubt).length) {
    return (
      <div
        class="modal fade"
        id={formId}
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                {type === "student" ? "My Doubt" : `Doubt`}
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body px-5">
              <div className="row mb-2">
                <div className="col-6">
                  <MdOutlineDateRange size={22} />
                  <span className="ms-2">
                    Date :{moment(doubt.date).format("DD MMM YYYY")}
                  </span>
                </div>
                <div className="col-6">
                  <MdOutlineAccessTime size={22} />
                  <span className="ms-2">
                    Time :{moment(doubt.date).format("LT")}
                  </span>
                </div>
              </div>
              <div className="row mb-2">
                <div className="col-6">
                  <SiGoogleclassroom size={22} />
                  <span className="ms-2">
                    {type === "student"
                      ? `For: ${doubt?.teacherId?.name}`
                      : `From: ${doubt?.student[0]?.name}`}
                  </span>
                </div>
                <div className="col-6">
                  {type !== "student" ? (
                    <>
                      <SiGoogleclassroom size={22} />
                      <span className="ms-2">{`Class: ${myData?.Class_id?.name}/${myData?.section_id?.name}`}</span>
                    </>
                  ) : (
                    <>
                      <SiGoogleclassroom size={22} />
                      <span className="ms-2">
                        Status: {doubt?.status ? "Solved" : "Active"}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="row p-2">
                Doubt:
                <p>{doubt?.doubt}</p>
              </div>
              <div className="row p-2">
                <div className="col-6">
                  Attachments :{" "}
                  {doubt?.attachDocument ? (
                    <a
                      className="btn btn-primary"
                      href={`${SERVER}/doubts/${doubt.attachDocument}`}
                      target="_blank"
                    >
                      View
                    </a>
                  ) : (
                    "NA"
                  )}
                </div>
                <div className="col-6">
                  Solution :{" "}
                  {doubt?.teacherDocument ? (
                    <a
                      className="btn btn-primary"
                      href={`${SERVER}/doubts/${doubt.teacherDocument}`}
                      target="_blank"
                    >
                      View
                    </a>
                  ) : (
                    "NA"
                  )}
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary">
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
      // <div className="modal fade" id={formId} tabindex="-1" aria-hidden="true">
      //   <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
      //     <div className="card">
      //       <div className="card-body">
      //         <div className="d-flex align-items-center justify-content-between mt-5">
      //           <div className="lesson_name">
      //             <div className="project-block bg-warning">
      //               <i className="icofont-read-book-alt fs-1 text"></i>
      //             </div>

      //             <span className="small text-muted project_name fw-bold">
      //               <h3 className="mb-0 fw-bold  fs-6  mb-2">Please help ! </h3>
      //             </span>
      //           </div>
      //         </div>
      //         <div className="modal-content bg-primary text-white p-4">
      //           <div className="row g-2 pt-4">
      //             <div className="col-6">
      //               <div className="d-flex align-items-center ">
      //                 <i
      //                   className="icofont-paper-clip fs-3 "
      //                   style={{ color: "blue" }}
      //                   onClick={() => {
      //                     doubt.attachDocument
      //                       ? handleDownload(doubt.attachDocument)
      //                       : "";
      //                   }}
      //                 ></i>
      //                 <span className="ms-2">
      //                   {doubt.attachDocument ? "Attach" : "No Attachments"}
      //                 </span>
      //                 {/* <button className="">Download</button> */}
      //               </div>
      //             </div>
      //             <div className="col-6 d-flex flex-column gap-3">
      //               <div className="d-flex align-items-center">
      //                 <MdOutlineDateRange size={22} />
      //                 <span className="ms-2">
      //                   Date :{moment(doubt.date).format("DD MMM YYYY")}
      //                 </span>
      //               </div>
      //               <div className="d-flex align-items-center">
      //                 <MdOutlineAccessTime size={22} />
      //                 <span className="ms-2">
      //                   Time :{moment(doubt.date).format("LT")}
      //                 </span>
      //               </div>
      //             </div>
      //             <div className="col-6">
      //               <div className="d-flex align-items-center">
      //                 <PiStudentBold size={20} />
      //                 <span className="ms-2 fw-bolder fs-5">
      //                   {type === "student"
      //                     ? "My Doubt"
      //                     : doubt?.student[0]?.name}
      //                 </span>
      //               </div>
      //             </div>
      //             <div className="col-6">
      //               <div className="d-flex align-items-center mt-2">
      //                 <SiGoogleclassroom size={22} />
      //                 <span className="ms-2">Class 1/ A (static)</span>
      //               </div>
      //             </div>
      //           </div>
      //           <div className="mt-5 bg-white p-2 rounded rounded-lg">
      //             <h4 className="fs-6 text-danger ">My Question- </h4>
      //             <span className="text">
      //               <p>{doubt?.doubt}</p>
      //             </span>
      //             <div className="d-flex gap-3">
      //               {doubt?.attachDocument && (
      //                 <a
      //                   className="btn btn-primary"
      //                   href={`${SERVER}/doubts/${doubt.attachDocument}`}
      //                   target="_blank"
      //                 >
      //                   Attachments
      //                 </a>
      //               )}
      //               {doubt?.teacherDocument && (
      //                 <a
      //                   className="btn btn-primary"
      //                   href={`${SERVER}/doubts/${doubt.teacherDocument}`}
      //                   target="_blank"
      //                 >
      //                   Solution
      //                 </a>
      //               )}
      //             </div>
      //           </div>
      //         </div>
      //       </div>
      //       <div className="modal-footer">
      //         <button
      //           type="button"
      //           className="btn btn-secondary"
      //           data-bs-dismiss="modal"
      //         >
      //           Done
      //         </button>
      //       </div>
      //     </div>
      //   </div>
      // </div>
    );
  } else {
    return;
  }
}
