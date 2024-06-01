import { useEffect, useRef, useState } from "react";
import Dropdown from "../dropdown/Dropdown";
import "./modal.css";
import { SERVER } from "../../../config";

const DigitalLibraryModal = ({ modalType, heading, setReReq, reReq }) => {
  const classRef = useRef(null);
  const subjectRef = useRef(null);
  const chapterRef = useRef(null);
  const topicRef = useRef(null);
  const titleRef = useRef(null);
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
  const [selectedClassId, setSelectedClassId] = useState();
  const [selectedSubjectId, setSelectedSubjectId] = useState();
  const [selectedChapterId, setSelectedChapterId] = useState();
  const [selectedTopicId, setSelectedTopicId] = useState();
  const [title, setTitle] = useState();
  const [desc, setdesc] = useState();
  const [referenceLink, setReferenceLink] = useState();
  useEffect(() => {
    const fetchClassNames = async () => {
      try {
        const classResponse = await fetch(`${SERVER}/classes/`, {
          credentials: "include",
        });
        if (!classResponse.ok) {
          throw new Error(`HTTP error! Status: ${classResponse.status}`);
        }
        const classData = await classResponse.json();

        const result = await fetch(`${SERVER}/course/getCourse`, {
          credentials: "include",
        });
        if (!result.ok) {
          throw new Error(`HTTP error! Status: ${result.status}`);
        }
        const topicData = await result.json();
        const topicArray = topicData?.data.map((subject) =>
          subject.topics.map((topic) => topic.topic)
        );
        const flattenedTopics = topicArray.flat();

        setClassName(classData);
        setTopicsTag(flattenedTopics);
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
      setData(data.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const inputChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (setInputs, url, body) => {
    setSelectedButton("");
    console.log({
      selectedTopicId,
      selectedChapterId,
      selectedSubjectId,
      selectedClassId,
      title,
      desc,
      referenceLink,
    });
    try {
      if (file) {
        const data = new FormData();
        const fileName = Date.now() + file?.name;
        data.append("name", fileName);
        data.append("file", file);

        // Upload file to the project folder
        const uploadFileResponse = await fetch(`${SERVER}/material/upload`, {
          method: "POST",
          credentials: "include",
          body: data,
        });

        if (!uploadFileResponse.ok) {
          throw new Error(
            `Failed to upload file! Status: ${uploadFileResponse.status}`
          );
        }

        await fetch(`${SERVER}${url}/`, {
          method: "POST",
          body: JSON.stringify({
            material: fileName,
            class_id: selectedClassId,
            subject_id: selectedSubjectId,
            chapter_id: selectedChapterId,
            topic_id: selectedTopicId,
            title,
            desc,
            urlLink: referenceLink,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
      } else {
        await fetch(`${SERVER}${url}/`, {
          method: "POST",
          body: JSON.stringify({
            class_id: selectedClassId,
            subject_id: selectedSubjectId,
            chapter_id: selectedChapterId,
            topic_id: selectedTopicId,
            title,
            desc,
            urlLink: referenceLink,
          }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
      }
      setSelectedClassId("");
      setSelectedSubjectId("");
      setSelectedChapterId("");
      setSelectedTopicId("");
      setTitle("");
      setdesc("");
      setReferenceLink("");
      setFile();
      setInputs({});
      setChange("");
      setReReq(!reReq);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTopic = (topic) => {
    const object = topic.topics;
    setTopicName(object);
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
            {/* Add new Digital library */}
            {modalType === "add-digital-library" && (
              <>
                <div className="modal-body">
                  <div className="mb-3">
                    {/* add digital library */}
                    <div className="modal-dropdowns">
                      <Dropdown
                        label="Choose a Class"
                        options={className}
                        find="name"
                        onSelect={(selectedId) => {
                          handleChange(
                            selectedId,
                            "/subject/getSubjectClass",
                            setSubjectName
                          );
                          setSelectedClassId(selectedId);
                        }}
                      />
                      <Dropdown
                        label="Choose a Subject"
                        options={subjectName}
                        find="name"
                        onSelect={(selectedId) => {
                          handleChange(
                            selectedId,
                            "/course/getCourse",
                            setChapterName
                          );
                          setSelectedSubjectId(selectedId);
                        }}
                      />

                      <a
                        className="btn btn-outline-primary dropdown-toggle"
                        role="button"
                        id="dropdownMenuLink2"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Select Course
                      </a>

                      <ul
                        className="dropdown-menu"
                        aria-labelledby="dropdownMenuButton"
                      >
                        {chapterName.map((option) => (
                          <li key={option._id}>
                            <a
                              href="#"
                              className="dropdown-item"
                              onClick={() => {
                                handleTopic(option);
                                setSelectedChapterId(option._id);
                              }}
                            >
                              {option.name}
                            </a>
                          </li>
                        ))}
                      </ul>

                      <Dropdown
                        label="Choose a Topic"
                        options={topicName}
                        find="topic"
                        onSelect={(selectedId) => {
                          setChange(selectedId);
                          setSelectedTopicId(selectedId);
                          setSelectedButton("libraryButton");
                        }}
                      />
                    </div>

                    <div className="modal-inputs">
                      <label htmlFor="title">Topic Name:</label>
                      <input
                        className="modal-input"
                        name="title"
                        ref={titleRef}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                      />
                      <label htmlFor="desc">Brief Description:</label>
                      <textarea
                        className="modal-input textarea"
                        name="desc"
                        id=""
                        cols="50"
                        rows="4"
                        value={desc}
                        ref={descRef}
                        onChange={(e) => setdesc(e.target.value)}
                      ></textarea>
                      <label htmlFor="material">Add material: </label>
                      <input
                        type="file"
                        // value={file}
                        id="file"
                        accept=".pdf,.doc,.docx,.mp4,.mp3"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                      <label htmlFor="link">Add link: </label>
                      <input
                        className="modal-input"
                        name="link"
                        onChange={(e) => setReferenceLink(e.target.value)}
                        type="text"
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-primary"
                    disabled={selectedButton !== "libraryButton"}
                    data-bs-dismiss="modal"
                    onClick={() =>
                      handleSubmit(setInputs, "/digitallibrary/add", {
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

export default DigitalLibraryModal;
