import style from "./Sidebar.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { getTypeToken } from "../../../Context/localStorage";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SERVER } from "../../../config";
import {
  AdminSideBarElements,
  StaffSideBarElements,
  ParentSideBarElements,
  StudentSideBarElements,
  SidebarElement,
  AccountantSideBarElements,
  SupperAdminSideBarElements,
} from "./Schema";
import React from "react";

export default function Sidebar() {
  const type = useRef(getTypeToken());
  const elements = useRef(
    type.current == "admin"
      ? AdminSideBarElements
      : type.current == "teacher"
      ? StaffSideBarElements
      : type.current == "parent"
      ? ParentSideBarElements
      : type.current == "student"
      ? StudentSideBarElements
      : type.current == "Accountant"
      ? AccountantSideBarElements
      : type.current == "supperadmin"
      ?SupperAdminSideBarElements
      :[]
    // change the string literals to Instil.User.Type constants
  );
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      style={{ ...(!expanded ? { width: "70px" } : {}) }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className={style.leftSidebar}
    >
     

      <div className={style.content}>
        <SideBarComponent elements={elements.current} />
      </div>
    </motion.div>
  );
}

function SideBarComponent({ elements }: { elements: SidebarElement[] }) {
  const type = localStorage.getItem("type");
  useEffect(() => {
    if (type === "teacher") {
      (async () => {
        await axios
          .get(`${SERVER}/ClassTeacher/isClassTeacher`, {
            withCredentials: true,
          })
          .then((res) => {
            if (!res?.data?.teachD) {
              elements[2]?.subMenu?.splice(0, 1);
            }
          });
      })();
    } 
  }, []);
  const nav = useNavigate();
  const [visibility, setVisibility] = useState(
    Array.from({ length: elements.length }, () => false)
  );

  return (
    <ul
      style={{
        color: "white",
        fontSize: "17px",
        fontWeight: "400",
      }}
    >
      {elements?.map((element, index) => (
        <li style={{ listStyle: "none" }}>
          <motion.div
            whileHover={{ color: "#ffc107" }}
            style={{ padding: "6px 0px" }}
            onClick={(e) => {
              e.stopPropagation();
              setVisibility((prev) => {
                prev[index] = !prev[index];
                return [...prev];
              });
            }}
          >
            <i style={{ marginRight: "10px" }} className={element.icon} />
            <span>{element.name}</span>
          </motion.div>

          <AnimatePresence>
            {visibility[index] && (
              <motion.ul
                key={index}
                style={{ overflow: "hidden" }}
                initial={{ height: 0 }}
                animate={{ height: "auto", transition: { duration: 0.4 } }}
                exit={{ height: 0, overflow: "hidden" }}
              >
                {element.subMenu.map((subElement) => (
                  <motion.li
                    whileHover={{ color: "#ffc107" }}
                    onClick={(e) => {
                      nav(subElement.link);
                    }}
                    style={{
                      color: "#fff",
                      fontSize: "0.83em",
                      padding: "6px 0px",
                      listStyle: "none",
                    }}
                  >
                    <span>{subElement.name}</span>
                  </motion.li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </li>
      ))}
    </ul>
  );
}
