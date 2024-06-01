import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import { FaEye } from "react-icons/fa";

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

const CardDiv = ({ data, name, reReq, setReReq }) => {
  const [isHovered, setHovered] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);

  const handleView = async (obj) => {
    console.log(obj);
    await axios
      .put(
        `http://localhost:5000/digitallibrary/update/${obj._id}`,
        { views: obj.views + 1 },
        { withCredentials: true }
      )
      .then((response) => console.log(response));
    setReReq(!reReq);

    setCurrentArticle(obj);
  };
  console.log(currentArticle);
  return (
    <div className="h-50 mb-5" style={{ width: 900 }}>
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
                maxWidth: "22rem",
                position: "relative",
                transform: isHovered === item._id ? "scale(1)" : "scale(0.9)",
              }}
              onMouseEnter={() => setHovered(item._id)}
              onMouseLeave={() => setHovered("")}
            >
              <img
                src="/assets/images/gallery/teach.jpg"
                className="w-100"
                alt="image"
                style={{
                  filter: "blur(0.5px)",
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
                <div className="d-flex gap-2">
                  <FaEye size={20} />
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

              <div className="row d-flex align-items-center my-3">
                <div className="col-9 d-flex align-items-center ">
                  <div
                    className="bg-info rounded-circle"
                    style={{ height: 50, width: 50 }}
                  ></div>
                  <p className="fs-6 ps-2 pt-3">
                    {currentArticle?.teacher_id.name}
                  </p>
                </div>

                <e className="col-3 text-dark fst-italic">3 hours ago</e>
              </div>
              <div className="mx-2">
                <div className="fw-light lh-lg mb-3">
                  In this educational article titled 'cd,' authored by Rakshit
                  Ranjan, the focus is on Chapter 4 of Sanskrit. The class is
                  labeled as '1,' and it belongs to a school with the ID
                  '65523637e07d8dbdab09a852.' Despite having just been created,
                  this article has yet to receive any views
                </div>
                <div className="fw-light lh-lg">
                  The educational content titled 'cd' delves into the
                  intricacies of Sanskrit's Chapter 4, authored by Rakshit
                  Ranjan for class '1'. This insightful article, associated with
                  school ID '65523637e07d8dbdab09a852,' explores linguistic
                  nuances and pedagogical approaches. The absence of views
                  suggests it's a recent addition. The meticulous curation
                  includes details like creation and update timestamps
                  (2024-01-04T08:19:29.977Z). While the material and URL links
                  are yet to be added, the structured format with class,
                  subject, chapter, and teacher information exemplifies a
                  comprehensive resource, awaiting engagement in the educational
                  sphere. This pedagogical endeavor encapsulates the essence of
                  effective knowledge dissemination.
                </div>
              </div>
            </div>
            <div className="modal-footer d-flex justify-content-between">
              {currentArticle?.urlLink && (
                <a className="btn btn-primary" href={currentArticle.urlLink}>
                  Read More..
                </a>
              )}
              <button
                className="btn btn-primary"
                href="https://react-icons.github.io/react-icons/search/#q=eye"
              >
                Download Material
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDiv;
