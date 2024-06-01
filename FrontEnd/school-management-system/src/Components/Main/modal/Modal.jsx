import { useEffect, useRef, useState } from "react";
import Dropdown from "../dropdown/Dropdown";
import "./modal.css";
import { SERVER } from "../../../config";

const Modal = ({ modalType, heading }) => {
  const classRef = useRef(null);
  const subjectRef = useRef(null);
  const chapterRef = useRef(null);
  const topicRef = useRef(null);
  const descRef = useRef(null);

  const [className, setClassName] = useState([]);
  const [subjectName, setSubjectName] = useState([]);
  const [chapterName, setChapterName] = useState([]);
  const [topicName, setTopicName] = useState([]);
  const [change, setChange] = useState("");
  const [selectedButton, setSelectedButton] = useState("");
  const [inputs, setInputs] = useState({});
  const [topicsTag, setTopicsTag] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [file, setFile] = useState(null);

  const handleTagSelection = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions).map(
      (option) => option.value
    );
    setSelectedTags(selectedOptions);
  };

  useEffect(() => {
    const fetchClassNames = async () => {
      try {
        const classResponse = await fetch(`${SERVER}/class/getall`, {
          credentials: "include",
        });
        if (!classResponse.ok) {
          throw new Error(`HTTP error! Status: ${classResponse.status}`);
        }
        const classData = await classResponse.json();

        const topicResponse = await fetch(`${SERVER}/topic/getall`, {
          credentials: "include",
        });
        if (!topicResponse.ok) {
          throw new Error(`HTTP error! Status: ${topicResponse.status}`);
        }
        const topicData = await topicResponse.json();

        setClassName(classData);
        setTopicsTag(topicData);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchClassNames();
  }, []);

  const handleChange = async (selectedId, url, setData) => {
    try {
      const response = await fetch(`${SERVER}${url}/${selectedId}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const inputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (setInputs, url, body) => {
    setSelectedButton("");
    try {
      if (file) {
        const data = new FormData();
        const fileName = Date.now() + file?.name;
        data.append("name", fileName);
        data.append("file", file);

        // Upload file to the project folder
        const uploadFileResponse = await fetch(`${SERVER}/material/upload`, {
          method: "POST",
          credentials: 'include',
          body: data,
        });

        if (!uploadFileResponse.ok) {
          throw new Error(
            `Failed to upload file! Status: ${uploadFileResponse.status}`
          );
        }

        await fetch(`${SERVER}${url}/`, {
          method: "POST",
          body: JSON.stringify({ ...body, material: fileName }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
      } else {
        await fetch(`${SERVER}${url}/`, {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
      }

      setInputs({});
      setChange("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div className="modal fade" id="tickadd" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title  fw-bold" id="leaveaddLabel">
                {heading}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            {/* Add new Class */}
            {modalType === "add-class" && (
              <>
                <div className="modal-body">
                  <div className="mb-3">
                    <div className="modal-inputs">
                      <input
                        className="modal-input"
                        type="text"
                        name="class"
                        ref={classRef}
                        placeholder="For example: Class 12"
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-primary"
                    data-bs-dismiss="modal"
                    onClick={() =>
                      handleSubmit(classRef, "/class/add", {
                        class_name: classRef.current.value,
                      })
                    }
                  >
                    Add Class
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Done
                  </button>
                </div>
              </>
            )}

            {/* Add a new subject  */}
            {modalType === "add-subject" && (
              <>
                <div className="modal-body">
                  <div className="mb-3">
                    <div className="modal-dropdowns">
                      <Dropdown
                        label="Choose a Class"
                        options={className}
                        find="class_name"
                        onSelect={(selectedID) => {
                          setChange(selectedID);
                          setSelectedButton("subjectButton");
                        }}
                      />
                    </div>

                    <div className="modal-inputs">
                      <input
                        className="modal-input"
                        type="text"
                        ref={subjectRef}
                        placeholder="Add new subject, For example: Biology"
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-primary"
                    disabled={selectedButton !== "subjectButton"}
                    data-bs-dismiss="modal"
                    onClick={() =>
                      setTimeout(() => {
                        handleSubmit(subjectRef, "/subject/add", {
                          class_id: change,
                          subject_name: subjectRef.current.value,
                        });
                      }, 0.9)
                    }
                  >
                    Submit Subject
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Done
                  </button>
                </div>
              </>
            )}

            {/* Add new Chapter */}
            {modalType === "add-chapter" && (
              <>
                <div className="modal-body">
                  <div className="mb-3">
                    <div className="modal-dropdowns">
                      <Dropdown
                        label="Choose a class"
                        options={className}
                        find="class_name"
                        onSelect={(selectedId) => {
                          handleChange(
                            selectedId,
                            "/subject/getsub",
                            setSubjectName
                          );
                        }}
                      />
                      <Dropdown
                        label="Choose a subject"
                        options={subjectName}
                        find="subject_name"
                        onSelect={(selectedId) => {
                          setChange(selectedId);
                          setSelectedButton("chapterButton");
                        }}
                      />
                    </div>

                    <div className="modal-inputs">
                      <input
                        className="modal-input"
                        type="text"
                        ref={chapterRef}
                        placeholder="Add new chapter, For example: Probability"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-primary"
                    disabled={selectedButton !== "chapterButton"}
                    data-bs-dismiss="modal"
                    onClick={() =>
                      handleSubmit(chapterRef, "/chapter/add", {
                        subject_id: change,
                        chapter_name: chapterRef.current.value,
                      })
                    }
                  >
                    Submit Chapter
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Done
                  </button>
                </div>
              </>
            )}

            {/* Add a new topic */}
            {modalType === "add-topic" && (
              <>
                <div className="modal-body">
                  <div className="mb-3">
                    <div className="modal-dropdowns">
                      <Dropdown
                        label="Choose a class"
                        options={className}
                        find="class_name"
                        onSelect={(selectedID) => {
                          handleChange(
                            selectedID,
                            "/subject/getsub",
                            setSubjectName
                          );
                        }}
                      />
                      <Dropdown
                        label="Choose a subject"
                        options={subjectName}
                        find="subject_name"
                        onSelect={(selectedID) => {
                          handleChange(
                            selectedID,
                            "/chapter/getchapt",
                            setChapterName
                          );
                        }}
                      />

                      <Dropdown
                        label="Choose a chapter"
                        options={chapterName}
                        find="chapter_name"
                        onSelect={(selectedId) => {
                          setChange(selectedId);
                          setSelectedButton("topicButton");
                        }}
                      />
                    </div>

                    <div className="modal-inputs">
                      <input
                        className="modal-input"
                        type="text"
                        ref={topicRef}
                        placeholder="Add new topic, For example: Bayes Theorem"
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-primary"
                    disabled={selectedButton !== "topicButton"}
                    data-bs-dismiss="modal"
                    onClick={() =>
                      handleSubmit(topicRef, "/topic/add", {
                        chapter_id: change,
                        topic_name: topicRef.current.value,
                      })
                    }
                  >
                    Submit Topic
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Done
                  </button>
                </div>
              </>
            )}

            {/* Add new Material */}
            {modalType === "add-material" && (
              <>
                <div className="modal-body">
                  <div className="mb-3">
                    {/* add knowledge bank */}
                    <div className="modal-dropdowns">
                      <Dropdown
                        label="Choose a Class"
                        options={className}
                        find="class_name"
                        onSelect={(selectedId) => {
                          handleChange(
                            selectedId,
                            "/subject/getsub",
                            setSubjectName
                          );
                        }}
                      />
                      <Dropdown
                        label="Choose a Subject"
                        options={subjectName}
                        find="subject_name"
                        onSelect={(selectedId) => {
                          handleChange(
                            selectedId,
                            "/chapter/getchapt",
                            setChapterName
                          );
                        }}
                      />

                      <Dropdown
                        label="Choose a Chapter"
                        options={chapterName}
                        find="chapter_name"
                        onSelect={(selectedId) => {
                          handleChange(
                            selectedId,
                            "/topic/gettopic",
                            setTopicName
                          );
                        }}
                      />

                      <Dropdown
                        label="Choose a Topic"
                        options={topicName}
                        find="topic_name"
                        onSelect={(selectedId) => {
                          setChange(selectedId);
                          setSelectedButton("bankButton");
                        }}
                      />
                    </div>

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
                        ref={descRef}
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
                        <span style={{ fontSize: "12px", fontStyle: "italic" }}>
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
                          <option key={ele._id} value={ele.topic_name}>
                            {ele.topic_name}
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
                    disabled={selectedButton !== "bankButton"}
                    data-bs-dismiss="modal"
                    onClick={() =>
                      handleSubmit(setInputs, "/knowledgebank/add", {
                        topic_id: change,
                        ...inputs,
                        tags: selectedTags,
                        material: Date.now() + file?.name,
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
