import { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import { SERVER } from "../../../../config";
import DigitalLibraryModal from "../../modal/DigitalLibraryModal";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import { FaEye } from "react-icons/fa";
import { AiOutlineEye, AiFillEdit, AiFillDelete } from "react-icons/ai";
import Swal from "sweetalert2";
import { InstilTable, TableState } from "../../../MainComponents/InstillTable";
const MyDigitalLibrary = () => {
  const [myId, setMyId] = useState("");
  const [recentData, setRecentData] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  //   const [classId, setClassId] = useState("");
  const [classData, setClassData] = useState([]);
  const [myMaterialData, setMyMaterialData] = useState([]);
  const [getAllLibrary, setGetAllLibrary] = useState([]);
  const [reReq, setReReq] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [editArticle, setEditArticle] = useState();

  useEffect(() => {
    (async () => {
      await axios
        .get(`${SERVER}/digitallibrary/getlibraryByViews`, {
          withCredentials: true,
        })
        .then((response) => setViewData(response.data.posts));
    })();
    (async () => {
      await axios
        .get(`${SERVER}/digitallibrary/getlibraryByRecent`, {
          withCredentials: true,
        })
        .then((response) => setRecentData(response.data.posts));
    })();

    (async () => {
      await axios
        .get(`${SERVER}/digitallibrary/getlibraryByTeacher/`, {
          withCredentials: true,
        })
        .then((response) => setMyMaterialData(response.data.library));
    })();
    (async () => {
      await axios
        .get(`${SERVER}/digitallibrary/getall`, {
          withCredentials: true,
        })
        .then((response) => {
          setGetAllLibrary(response.data.posts);
          setMyId(response.data.myId);
        });
    })();
  }, [reReq]);

  //   useEffect(() => {
  //     if (classId !== "") {
  //       (async () => {
  //         await axios
  //           .get(`${SERVER}/digitallibrary/getlibraryByClass/${classId}`, {
  //             withCredentials: true,
  //           })
  //           .then((response) => setClassData(response.data.library));
  //       })();
  //     }
  //   }, [classId, reReq]);

  const handleArticleEdit = async () => {
    await axios
      .put(`${SERVER}/digitallibrary/update/${editArticle?._id}`, editArticle, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          setReReq(!reReq);
          Swal.fire({
            title: "Successfully Updated!",
            icon: "success",
            timer: 3000,
          });
        } else {
          Swal.fire({
            title: "Try Again!",
            icon: "warning",
            timer: 3000,
          });
        }
      })
      .catch((err) => {
        Swal.fire({
          title: "Try Again!",
          icon: "warning",
          timer: 3000,
        });
      });
  };
  const handleDeleteArticle = async (item) => {
    Swal.fire({
      title: `Are you sure you want to delete?`,
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios
          .delete(`${SERVER}/digitallibrary/delete/${item?._id}`, {
            withCredentials: true,
          })
          .then((res) => {
            if (res.data.success) {
              Swal.fire({
                title: "Success",
                text: "Successfully Deleted item",
                icon: "success",
                timer: 3000,
              });
              setReReq(!reReq);
            }
          })
          .catch((err) => {
            Swal.fire({
              title: "Try Again!",
              icon: "warning",
              timer: 3000,
            });
          });
      }
    });
  };

  return (
    <>
      <div className="d-flex justify-content-between bg-white mb-4 px-3 py-2">
        <h2 className="fw-bold text-primary">My Libraries</h2>
        <button
          type="button"
          className="btn btn-dark btn-set-task w-sm-100"
          data-bs-toggle="modal"
          data-bs-target="#tickadd"
        >
          <i className="icofont-plus-circle me-2 fs-6"></i>Add New Material
        </button>
      </div>
      <div>
        <InstilTable
          tableState={TableState}
          titles={["No.", "Topic", "Views", "Date", "View", "Actions"]}
          rows={myMaterialData?.map((item, idx) => ({
            "No.": idx + 1,
            Topic: item?.title,
            Views: item?.views,
            Date: item?.createdAt?.slice(0, 10),
            View: (
              <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#objectModal"
                onClick={() => setCurrentArticle({ ...item })}
              >
                <AiOutlineEye />
              </button>
            ),
            Actions: (
              <div
                className="btn-group"
                role="group"
                aria-label="Basic outlined example"
              >
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-bs-toggle="modal"
                  data-bs-target="#editlibrary"
                  onClick={() => setEditArticle({ ...item })}
                >
                  <AiFillEdit />
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary deleterow"
                  onClick={() => handleDeleteArticle(item)}
                >
                  <AiFillDelete className="text-danger" />
                </button>
              </div>
            ),
          }))}
        />
      </div>
      <DigitalLibraryModal
        modalType="add-digital-library"
        heading="Add a new Digital Library"
        setReReq={setReReq}
        reReq={reReq}
      />

      {/* ARTICLE MODAL */}
      <div
        className="modal fade"
        id="objectModal"
        tabindex="-1"
        aria-labelledby="objectModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="objectModalLabel">
                Go Beyond the <e className="text-primary fw-bold">Books!</e>
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
                <div className="d-flex flex-column align-items-end ">
                  <e className="fs-6">
                    {currentArticle?.subject_id?.name}
                    <e>({currentArticle?.chapter_id?.name})</e>
                  </e>
                </div>
                <div className="d-flex align-items-center gap-1">
                  {myId === currentArticle?.teacher_id?._id && (
                    <>
                      <button
                        className="btn btn-outline-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#editlibrary"
                        onClick={() => setEditArticle({ ...currentArticle })}
                      >
                        <AiFillEdit />
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={handleDeleteArticle}
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        <AiFillDelete />
                      </button>
                    </>
                  )}
                  <FaEye size={15} />
                  <e>{currentArticle?.views}</e>
                </div>
              </div>

              <img
                src="/assets/images/gallery/teach.jpg"
                height={200}
                className="w-100"
              />
              <h5 className="fw-bolder my-2">
                {/* Focus on things which do the best job of advancing your goals. */}
                {currentArticle?.title}
              </h5>

              <div className="row d-flex align-items-center my-3 mx-1">
                <div className="col-7 d-flex align-items-center">
                  {/* <div
                    className="bg-info rounded-circle"
                    style={{ height: 50, width: 50 }}
                  ></div> */}
                  <div className="rounded-circle">
                    {currentArticle?.teacher_id && (
                      <img
                        src="/assets/images/lg/avatar1.jpg"
                        // src={
                        //   `${SERVER}/staffmanage/staff/photo/` +
                        //   currentArticle?.teacher_id?._id
                        // }
                        height={50}
                        width={50}
                      />
                    )}
                  </div>
                  <p className="fs-6 ps-2 pt-3">
                    {currentArticle?.teacher_id.name}
                  </p>
                </div>

                <e className="col-5 text-dark fst-italic">
                  Uploaded on {currentArticle?.createdAt.slice(0, 10)}
                </e>
              </div>
              <div className="mx-3 fw-light">{currentArticle?.desc}</div>
            </div>
            <div className="modal-footer d-flex justify-content-between">
              {currentArticle?.urlLink && (
                <a className="btn btn-primary" href={currentArticle.urlLink}>
                  Read More..
                </a>
              )}
              {/* Under consideration */}
              {/* {currentArticle?.material && (
                <a
                  className="btn btn-primary"
                  href={`${SERVER}/materials/${currentArticle?.material}`}
                >
                  Download Material
                </a>
              )} */}
            </div>
          </div>
        </div>
      </div>
      {/* Edit */}
      <div
        className="modal fade"
        id="editlibrary"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="eventaddLabel">
                Edit Library
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="deadline-form">
                <div className="row g-3 mb-3">
                  <label htmlFor="name">Title</label>
                  <input
                    type="text"
                    name="title"
                    className=" form-control"
                    value={editArticle?.title}
                    onChange={(e) =>
                      setEditArticle({
                        ...editArticle,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="row g-3 mb-3">
                  <label htmlFor="desc">Description</label>
                  <textarea
                    value={editArticle?.desc}
                    onChange={(e) =>
                      setEditArticle({
                        ...editArticle,
                        desc: e.target.value,
                      })
                    }
                    class="form-control"
                    id="desc"
                    name="desc"
                    rows="3"
                    placeholder="Enter notice description"
                  ></textarea>
                </div>
                <div className="row g-3 mb-3">
                  <label htmlFor="name">URL</label>
                  <input
                    type="text"
                    name="title"
                    className=" form-control"
                    value={editArticle?.urlLink}
                    onChange={(e) =>
                      setEditArticle({
                        ...editArticle,
                        urlLink: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleArticleEdit}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyDigitalLibrary;
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const CardDiv = ({ data, name, reReq, setReReq, setCurrentArticle }) => {
  const [isHovered, setHovered] = useState(false);

  const handleView = async (obj) => {
    setCurrentArticle(obj);

    await axios
      .put(
        `${SERVER}/digitallibrary/update/${obj._id}`,
        { views: obj.views + 1 },
        { withCredentials: true }
      )
      .then((response) => console.log(response));
    setReReq(!reReq);
  };
  return (
    <div className="h-50 mb-5" style={{ width: "72vw" }}>
      <h5>{name}</h5>
      {data.length === 0 ? (
        <div
          className=" bg-primary rounded p-2 text-white d-flex justify-content-center align-items-center"
          style={{ height: 200, width: 300, transform: "scale(0.9)" }}
        >
          No Material Yet
        </div>
      ) : (
        <Carousel responsive={responsive}>
          {data?.map((item) => (
            <div
              onClick={() => name !== "My Teachers" && handleView(item)}
              data-bs-toggle="modal"
              data-bs-target="#objectModal"
              className="bg-image hover-overlay ripple shadow-1-strong rounded"
              data-mdb-ripple-color="light"
              style={{
                position: "relative",
                transform: isHovered === item._id ? "scale(1)" : "scale(0.9)",
              }}
              onMouseEnter={() => setHovered(item._id)}
              onMouseLeave={() => setHovered("")}
            >
              <img
                src="/assets/images/gallery/teach.jpg"
                className="w-100 "
                alt="image"
                style={{
                  filter: "blur(0.75px)",
                  objectFit: "cover",
                  height: "100%",
                }}
              />
              <div>
                <div
                  className="mask text-light d-flex justify-content-between align-items-end p-2"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.3)",

                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <div className="">
                    {name !== "My Teachers" && (
                      <div>
                        <p className="text-start my-0" style={{ fontSize: 8 }}>
                          Views:
                        </p>
                        <p className="text-start" style={{ fontSize: 10 }}>
                          {item?.views}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="">
                    {name !== "My Teachers" && (
                      <div>
                        <p className="text-end my-0" style={{ fontSize: 8 }}>
                          Class:
                        </p>
                        <p className="text-end" style={{ fontSize: 10 }}>
                          {item?.class_id?.name}
                        </p>
                      </div>
                    )}
                    {name !== "My Teachers" && (
                      <div>
                        <p className="text-end my-0" style={{ fontSize: 8 }}>
                          Subject:
                        </p>
                        <p className="text-end" style={{ fontSize: 10 }}>
                          {item?.subject_id?.name}
                        </p>
                      </div>
                    )}
                    {name !== "My Teachers" && (
                      <div>
                        <p className="text-end my-0" style={{ fontSize: 8 }}>
                          Topic:
                        </p>
                        <p className="text-end" style={{ fontSize: 10 }}>
                          {item?.title}
                        </p>
                      </div>
                    )}
                    {name !== "My Teachers" && (
                      <div className="">
                        <p style={{ fontSize: 14 }}>
                          By {item?.teacher_id?.name}
                        </p>
                      </div>
                    )}
                    {name === "My Teachers" && (
                      <div>
                        <p className="my-0" style={{ fontSize: 8 }}>
                          Teacher:
                        </p>
                        <p>{item?.name}</p>
                      </div>
                    )}{" "}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
};
