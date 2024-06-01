import axios from "axios";
import React, { useEffect, useState } from "react";
// import HorizantalScroll from "react-scroll-horizontal";
import { SERVER } from "../../config/";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const items = [
  "Item 1",
  "Item 2",
  "Item 3",
  /* ... */
];
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
function Project() {
  const [recentData, setRecentData] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [teacherData, setTeacherData] = useState([]);
  useEffect(() => {
    (async () => {
      await axios
        .get(`http://localhost:5000/digitallibrary/getlibraryByViews`, {
          withCredentials: true,
        })
        .then((response) => setViewData(response.data.posts));
    })();
    (async () => {
      await axios
        .get(`http://localhost:5000/digitallibrary/getlibraryByRecent`, {
          withCredentials: true,
        })
        .then((response) => setRecentData(response.data.posts));
    })();
    (async () => {
      await axios
        .get(`http://localhost:5000/StudentDoubt/studentClassTeacher`, {
          withCredentials: true,
        })
        .then((response) => setTeacherData(response.data.data.teachers));
    })();
  }, []);
  console.log({ viewData, recentData, teacherData });
  return (
    <div className="">
      <CardDiv data={viewData} name="Most Recent" />
      <CardDiv data={recentData} name="Most Viewed" />
      <CardDiv data={teacherData} name="My Teachers" />
    </div>
  );
}

export default Project;

const CardDiv = ({ data, name }) => {
  const [isHovered, setHovered] = useState(false);

  return (
    <div className="h-50 mb-5" style={{ width: 900 }}>
      <h5>{name}</h5>
      <Carousel responsive={responsive} containerClass="">
        {data?.map((item) => (
          <div
            className="p-2 bg-info me-3 rounded rounded-lg"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "end",
              alignItems: "end",
              cursor: "pointer",
              height: 200,
              // backgroundColor: isHovered ? "#a0a0a0" : "#f0f0f0",
              // color: isHovered ? "#fff" : "#000",
              // width: 300,
            }}
            // onMouseEnter={() => setHovered(true)}
            // onMouseLeave={() => setHovered(false)}
          >
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
            {name !== "My Teachers" && <p>By {item?.teacher_id?.name}</p>}
            {name === "My Teachers" && (
              <div>
                <p className="my-0" style={{ fontSize: 8 }}>
                  Teacher:
                </p>
                <p>{item?.name}</p>
              </div>
            )}{" "}
          </div>
        ))}
      </Carousel>
    </div>
  );
};
