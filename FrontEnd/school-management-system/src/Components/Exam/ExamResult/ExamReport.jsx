import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER } from "../../../config";
import { useParams } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
import { FaRegFileAlt } from "react-icons/fa";
import Marksheet from "./Marksheet";
import { BackDrop } from "../../../utils/popups/backdrop";

const ExamReport = () => {
  const [ExamList, setExamList] = useState(null);
  const [ExamSubjectList, setExamSubjectList] = useState(null);
  const [reportData, setreportData] = useState([]);
  const [ChartReport, setChartReport] = useState([0, 0, 0, 0]);
  const [subjects, setSubjects] = useState(null);
  const [selectedSection, setselectedSection] = useState(null);
  const [currentItem, setCurrentItem] = useState();
  const [details, setDetails] = useState();
  const [studentInFocus, setStudentInFocus] = useState({});
  const params = useParams();

  const [student_id, setStudent_id] = useState("")
  // const [student_id, setStudent_id] = useState("")




  const getStudent = async (id) => {
    const response = await fetch(`${SERVER}/api/student/${id}`, {
      method: "GET",
      credentials: "include",

      headers: {
        "Content-Type": "application/json"
      }
    })
    const data = await response.json();

    setStudent_id(data?.student?._id);
    getStudentParent(student_id)

  }


  const [Parent, setParent] = useState("");

  const getStudentParent = async (studentId) => {

    let url = student_id ? `${student_id}?student_id=${student_id}` : student_id;

    try {
      const response = await fetch(`${SERVER}/courseplatform/searchStudent/${url}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      }
      )
      const data = await response.json();
      setParent(data?.studentParent);


    }
    catch (error) {
      console.log(error)
    }
  }

  // 


  const fetchExamList = async () => {
    try {
      const response1 = await axios.get(
        SERVER + `/examSubject/${params.exam}`,
        { withCredentials: true }
      );

      let update = response1.data[0].subject.map((item) => ({
        name: item.subject_id.name,
        total_marks: item.total_marks,
        _id: item.subject_id._id,
      }));
      setSubjects(update);

      const response2 = await axios.get(SERVER + `/examlist/${params.exam}`, {
        withCredentials: true,
      });
      setExamList(response2.data);
      let section = response2.data.section_id;
      setExamSubjectList(section);
      if (section.length > 0) {
        setselectedSection(section[0]["_id"]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchResultsReport = async (id) => {
    try {
      const { data } = await axios.get(
        SERVER + `/examlist/showresults/${params.exam}?section=${id}`,
        {
          withCredentials: true,
        }
      );
      let update = data.resultsData.map((item) => {
        const subjectsTemp = item.subjectsArray.map((item2) => {
          let subjectName = subjects.find((sub) => sub._id === item2.subject);

          return {
            ...item2,
            name: subjectName.name,
            exam_total: subjectName.total_marks,
          };
        });

        console.log(subjectsTemp);

        let total_exam_marks = subjects.reduce(
          (result, single_item) => result + single_item.total_marks,
          0
        );
        const percentage = (item.totalMarksObtained / total_exam_marks) * 100;

        return {
          _id: item._id,
          name: item.name,
          studentId: item.studentId,
          totalMarks: item.totalMarksObtained,
          subjects: subjectsTemp,
          percentage: Number(percentage.toFixed(2)),
        };
      });
      const counts = [0, 0, 0, 0];

      update.forEach((student) => {
        const percentage = student.percentage;
        if (percentage > 90) {
          counts[0]++;
        } else if (percentage >= 60 && percentage <= 89) {
          counts[1]++;
        } else if (percentage >= 40 && percentage <= 59) {
          counts[2]++;
        } else {
          counts[3]++;
        }
      });
      setreportData(update);
      setChartReport(counts);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSchoolDetails = async () => [
    axios.get(`${SERVER}/userDetail`, { withCredentials: true }).then((res) => {
      setDetails(res.data);
    }),
  ];
  const options = {
    labels: ["Above 90%", "89% to 60%", "59% to 40%", "Below 40%"],
    colors: ["#00e676", "#ffeb3b", "#ff9800", "#e57373"],
  };

  useEffect(() => {
    fetchExamList();
    fetchSchoolDetails();
  }, []);

  useEffect(() => {
    if (selectedSection) {
      fetchResultsReport(selectedSection);
    }
  }, [selectedSection]);

  //   console.log(ExamList);
  return (
    <>
      <div className="border-0 mb-4 card ">
        <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
          <h3 className="fw-bold mb-0 text-primary noprint">Exam Report</h3>
        </div>

        <div className="">
          <div className="w-50 my-2 px-3">
            <label htmlFor="formFileMultipleone" className="form-label">
              Select Section
            </label>
            <select
              className="form-select "
              aria-label="Default select Section"
              name="section_id"
              onChange={(e) => setselectedSection(e.target.value)}
            >
              <option value="" defaultChecked>
                Select Section
              </option>
              {ExamSubjectList &&
                ExamSubjectList?.map((item, index) => {
                  return (
                    <option
                      key={index}
                      value={item._id}
                      selected={selectedSection === item._id}
                    >
                      {item.name}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>
      </div>

      <div className="card mb-4 p-3">
        <h4 className="fw-bolder ">Percentage Report Analysis</h4>
        <div className="d-flex justify-content-center">
          <ReactApexChart
            options={options}
            series={ChartReport}
            type="donut"
            width={400}
          />
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          {subjects && reportData.length > 0 && (
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Name</th>
                  <th scope="col">Student ID</th>
                  {reportData[0].subjects.map((item, index) => (
                    <th scope="col" key={index}>
                      {item.name}
                    </th>
                  ))}
                  <th scope="col">total</th>
                  <th scope="col">percentage</th>
                  <th>Marksheet</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item, index) => (
                  <tr key={index}>
                    <td className="text-primary fw-bold">{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.studentId}</td>
                    {item.subjects.map((item2) => (
                      <td>{item2.marks}</td>
                    ))}
                    <td>{item.totalMarks}</td>
                    <td>{item.percentage}</td>
                    <td>
                      <button
                        className="btn btn-success"
                        onClick={() => {

                          setCurrentItem(item);
                          setStudentInFocus({ for: "marksheet" });
                          getStudent(item.studentId)
                          // getStudentParent(student_id)
                          // setStudentReportId(item.studentId)
                          // console.log("reportId",studentReportId)                          
                        }}
                      >
                        <FaRegFileAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <BackDrop show={studentInFocus.for === "marksheet"}>
        {/* <SupperAdminOption
          onClose={() => setStudentInFocus({})}
          setStudentInFocus={setStudentInFocus}
        /> */}
        <Marksheet
          onClose={() => setStudentInFocus({})}
          details={details}
          item={currentItem}
          Parent={Parent}
        //  getStudentParent=  {getStudentParent(student_id)}
        />
      </BackDrop>
    </>
  );
};

export default ExamReport;
