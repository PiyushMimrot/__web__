import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SERVER } from "../../../config";

const DigitalLibraryMaterial = () => {
  const topicId = useParams().digitallibraryId;
  const [digitalLibrary, setdigitalLibrary] = useState([]);
  const [topic, setTopic] = useState([]);
  const [chapter, setChapter] = useState([]);
  const [inputs, setInputs] = useState({});
  const [topicsTag, setTopicsTag] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [file, setFile] = useState(null);

  const typeOfLoggedIn = localStorage.getItem("type");

  const handleTagSelection = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions).map(
      (option) => option.value
    );
    setSelectedTags(selectedOptions);
  };

  useEffect(() => {
    fetchInfo();
  }, [topicId]);

  const fetchInfo = async () => {
    try {
      const materialResponse = await fetch(
        `${SERVER}/digitallibrary/getlibrary/${topicId}`,
        {
          credentials: "include",
        }
      );
      if (!materialResponse.ok) {
        throw new Error(`HTTP error! Status: ${materialResponse.status}`);
      }
      const materialData = await materialResponse.json();

      const result = await fetch(`${SERVER}/course/getCourse`, {
        credentials: "include",
      });
      if (!result.ok) {
        throw new Error(`HTTP error! Status: ${result.status}`);
      }
      const topicData = await result.json();
      const topicArray = topicData?.data.map((subject) => subject.topics);
      const flattenedTopics = topicArray.flat();

      //   const chapters = await fetch(`${SERVER}/course/`)

      setdigitalLibrary(materialData);
      setTopicsTag(flattenedTopics);
      //   setChapter(topicData);
      //   setTopic();
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const inputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (setInputs, url, body) => {
    try {
      if (file) {
        const data = new FormData();
        const fileName = Date.now() + file?.name;
        data.append("name", fileName);
        data.append("file", file);

        // Uploading the file to the project folder
        const uploadResponse = await fetch(`${SERVER}/material/upload`, {
          method: "POST",
          credentials: "include",
          body: data,
        });
        if (!uploadResponse.ok) {
          throw new Error(`HTTP error! Status: ${uploadResponse.status}`);
        }

        const uploadData = await uploadResponse.json();

        const postResponse = await fetch(`${SERVER}${url}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ ...body, material: fileName }),
        });

        if (!postResponse.ok) {
          throw new Error(`HTTP error! Status: ${postResponse.status}`);
        }
      } else {
        const postResponse = await fetch(`${SERVER}${url}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(body),
        });

        if (!postResponse.ok) {
          throw new Error(`HTTP error! Status: ${postResponse.status}`);
        }
      }

      setInputs({});
      fetchInfo();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div id="mytask-layout" className="theme-indigo">
        {/* main body area */}
        <div className="main px-lg-4 px-md-4">
          {/* Body: Header */}

          {/* Body: Body  */}
          <div className="body d-flex py-lg-3 py-md-2">
            <div className="container-xxl">
              {(typeOfLoggedIn === "admin" || typeOfLoggedIn === "teacher") && (
                <div className="row align-items-center">
                  <div className="border-0 mb-4">
                    <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                      <div className="col-auto d-flex w-sm-100">
                        <button
                          type="button"
                          className="btn btn-dark btn-set-task w-sm-100"
                          data-bs-toggle="modal"
                          data-bs-target="#tickadd"
                        >
                          <i className="icofont-plus-circle me-2 fs-6"></i>Add
                          New Material
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Row end  */}
              <div className="row clearfix g-3">
                <div className="col">
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="row g-3 row-cols-1 row-cols-sm-1 row-cols-md-1 row-cols-lg-2 row-cols-xl-2 row-cols-xxl-2 row-deck py-1 pb-4">
                        {digitalLibrary.map((ele) => (
                          <div key={ele._id} className="col">
                            <div className="card teacher-card">
                              <div className="card-body d-flex">
                                <div className="profile-av pe-xl-4 pe-md-2 pe-sm-4 pe-4 text-center w220">
                                  <img
                                    src="/assets/images/lg/avatar3.jpg"
                                    alt=""
                                    className="avatar xl rounded-circle img-thumbnail shadow-sm"
                                  />
                                  <div className="about-info d-flex align-items-center mt-3 justify-content-center">
                                    <div className="followers me-2">
                                      <i className="icofont-tasks color-careys-pink fs-4"></i>
                                      <span className="">04</span>
                                    </div>
                                    <div className="star me-2">
                                      <i className="icofont-star text-warning fs-4"></i>
                                      <span className="">4.5</span>
                                    </div>
                                    <div className="own-video">
                                      <i className="icofont-data color-light-orange fs-4"></i>
                                      <span className="">04</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="teacher-info border-start ps-xl-4 ps-md-3 ps-sm-4 ps-4 w-100">
                                  {/* <h6 className="mb-0 mt-2  fw-bold d-block fs-6">
                                    {chapter.chapter_name}
                                  </h6>
                                  <span className="light-info-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-11 mb-0 mt-1">
                                    {topic.topic_name}
                                  </span> */}
                                  <div className="video-setting-icon mt-3 pt-3 border-top">
                                    <p>{ele.desc}</p>
                                  </div>
                                </div>
                              </div>
                              <div
                                style={{ paddingInline: "9px" }}
                                className="d-flex flex-column align-items-start justify-content-center"
                              >
                                <div className="d-flex gap-3 mb-2">
                                  {ele.material && (
                                    <a
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      href={`https://${ele.material}`}
                                      className="btn btn-dark btn-sm mt-1"
                                    >
                                      <i className="icofont-plus-circle me-2 fs-6"></i>
                                      Files
                                    </a>
                                  )}
                                  {ele.link && (
                                    <a
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      href={`https://${ele.link}`}
                                      className="btn btn-dark btn-sm mt-1"
                                    >
                                      <i className="icofont-plus-circle me-2 fs-6"></i>
                                      Link
                                    </a>
                                  )}
                                </div>
                                <div className="d-flex flex-wrap gap-2">
                                  {ele.tags?.map((tag, ind) => (
                                    <span
                                      key={ind}
                                      className="light-warning-bg py-1 px-2 rounded-1 d-inline-block fw-bold small-11 mb-0 mt-1"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-3"></div>
                </div>
                {/* Row End */}
              </div>
            </div>

            {/* Modal Members */}

            {/* Add Tickit */}
            <div
              className="modal fade"
              id="tickadd"
              tabIndex="-1"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title  fw-bold" id="leaveaddLabel">
                      Add New Material
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <div className="modal-inputs">
                        <label htmlFor="desc">
                          Add a brief description about the topic:
                        </label>
                        <textarea
                          className="modal-input textarea"
                          name="desc"
                          id=""
                          cols="50"
                          rows="4"
                          onChange={inputChange}
                        ></textarea>
                        <label htmlFor="material">Add material: </label>
                        <input
                          type="file"
                          id="file"
                          accept=".pdf,.doc,.docx,.mp4,.mp3"
                          onChange={(e) => setFile(e.target.files[0])}
                        />
                        <label htmlFor="link">Add link: </label>
                        <input
                          className="modal-input"
                          name="link"
                          onChange={inputChange}
                          type="text"
                        />
                        <label htmlFor="tags">
                          Add tags{" "}
                          <span
                            style={{ fontSize: "12px", fontStyle: "italic" }}
                          >
                            (Press and Hold ctrl to select multiple tags) :{" "}
                          </span>{" "}
                        </label>
                        <select
                          className="form-select"
                          multiple
                          aria-label="multiple select example"
                          onChange={handleTagSelection}
                          value={selectedTags}
                          style={{ width: "350px", fontSize: "13.5px" }}
                        >
                          {topicsTag.map((ele) => (
                            <option key={ele._id} value={ele.topic}>
                              {ele.topic}
                            </option>
                          ))}
                        </select>
                        <p>Selected Tags: {selectedTags.join(", ")}</p>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      onClick={() =>
                        handleSubmit(setInputs, "/digitallibrary/add", {
                          ...inputs,
                          topic_id: topicId,
                          tags: selectedTags,
                        })
                      }
                    >
                      Submit Content
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalLibraryMaterial;