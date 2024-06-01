import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SERVER } from "../../config";
import { InstilTable, TableState } from "../MainComponents/InstillTable";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { TbXboxX } from "react-icons/tb";
export default function StudentAttendence() {
  const params = useParams();
  const [report, setReport] = useState([]);
  const [studentD, setStudentD] = useState({});
  const type = localStorage.getItem("type");
  const [tableState, setTableState] = useState(TableState.LOADING);

  useEffect(() => {
    fetch(SERVER + `/attendance/getStudentAtt/${params.studentatt}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setReport(data.data);
        setTableState(TableState.SUCCESS);
      });
    if (type !== "student") {
      getStudnentDetail();
    }
  }, []);

  const getStudnentDetail = () => {
    fetch(SERVER + `/courseplatform/studentinformation/${params.studentatt}`)
      .then((res) => res.json())
      .then((data) => setStudentD(data));
  };
  console.log(report);
  return (
    <div>
      <h2>{studentD["name"] || ""} Attendance Report </h2>
      <InstilTable
        tableState={tableState}
        titles={["Sr. No", "Date", "Status"]}
        rows={report.map((item, idx) => ({
          "Sr. No": idx + 1,
          Date: item?.date.slice(0, 10),
          Status: item.present ? (
            <RiCheckboxCircleFill color="green" size={20} />
          ) : (
            <TbXboxX color="red" size={20} />
          ),
        }))}
      />
    </div>
  );
}
