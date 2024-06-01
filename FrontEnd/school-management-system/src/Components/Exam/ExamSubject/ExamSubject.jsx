import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { SERVER } from "../../../config";
import Table2 from "../../MainComponents/Table2";
import Addbutton from "../../../utils/AddButton/Addbutton";
import ExamSubjectform from "./ExamSubjectform";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Card from "../../../utils/Card/Card";
import ReactApexChart from "react-apexcharts";
import { getTypeToken } from "../../../Context/localStorage";
import moment from "moment";

const type = getTypeToken();

export default function ExamSubject() {
  const [subject, setSubject] = useState([]);
  const [edit, setEdit] = useState();
  const [exam, setExam] = useState({});
  const [examlist, setExamList] = useState({});
  const [subjectList, setsubjectList] = useState([]);
  const [studentResult, setstudentResult] = useState([]);
  const [examReport, setexamReport] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  // console.log(params);
  const getExamSubject = () => {
    fetch(SERVER + `/examSubject/${params.exam}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setExam(data[0]);
        let update = data[0].subject.map((item) => ({
          name: item.subject_id.name,
          total_marks: item.total_marks,
          _id: item.subject_id._id,
          chapters: item.chapters,
        }));
        // setSubject(data[0].subject);
        setSubject(update);
      });
  };

  const getExamListById = () => {
    fetch(SERVER + `/examlist/${params.exam}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setExamList(data);
        getSubjectList(data.class_id._id);
        if ((type === "student" || type === "parent") && data.status) {
          getStudentExamResults();
        }
      });
  };

  const getSubjectList = (id) => {
    fetch(SERVER + "/subject/getTeacherSubject", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        let subD = data?.data?.filter((item) => id === item.class_id);
        setsubjectList(subD);
      });
  };

  const getStudentExamResults = async (id) => {
    const config = {
      withCredentials: true,
    };
    const response = await axios.get(
      `${SERVER}/examResult/single/${params.exam}`,
      config
    );
    // console.log(response);
    let filterData = response.data.map((item) => ({
      Subname: item.exam_subject_name_id?.name,
      marks: item.marksObtain,
    }));
    console.log(filterData);
    setstudentResult(filterData);
  };

  useEffect(() => {
    getExamSubject();
    getExamListById();
  }, []);

  let tableHeader = [];
  if (type === "admin" || type === "teacher") {
    tableHeader = {
      id: "Sr.No",
      name: "Subject",
      total_marks: "Total Marks",
      action: "ACTION",
    };
  } else {
    tableHeader = {
      id: "Sr.No",
      name: "Subject",
      total_marks: "Total Marks",
    };
  }

  const updateData = async (id, updateData) => {
    // console.log(id,' ',updateData );
    try {
      await axios.put(SERVER + `/examSubject/${id}`, updateData, {
        withCredentials: true,
      });
      // setSubject(a.data.subject);
    } catch (error) {
      console.error("Error updating Exam list:", error);
    }
  };

  const handleAddExamSub = async (nData) => {
    let updateExamSubject = exam.subject.map((item) => ({
      subject_id: item.subject_id._id,
      total_marks: item.total_marks,
      chapters: item.chapters.map((item) => item._id),
    }));

    updateExamSubject.push(nData);

    exam.subject = updateExamSubject;
    // console.log(exam);
    await updateData(exam._id, exam);

    getExamSubject();

    Swal.fire({
      title: "Success",
      text: "Exam Subject Added Successfully",
      icon: "success",
      timer: 3000,
    });
  };

  // edit the exam subject
  const handleEditExamSub = async (data) => {
    // console.log(data);
    // console.log(edit);
    let updateExamSubject = exam.subject.map((item) => ({
      subject_id: item.subject_id._id,
      total_marks: item.total_marks,
      chapters: item.chapters.map((item) => item._id),
    }));

    let index = updateExamSubject.findIndex(
      (item) => item.subject_id === edit._id
    );

    updateExamSubject[index].subject_id = data.subject_id;
    updateExamSubject[index].total_marks = data.total_marks;

    exam.subject = updateExamSubject;
    // console.log(exam);

    await updateData(exam._id, exam);
    getExamSubject();

    Swal.fire({
      title: "Success",
      text: "Exam Subject Edited Successfully",
      icon: "success",
      timer: 3000,
    });
  };

  const handleDeleteExamSub = (id) => {
    // console.log(exam.subject);
    let updateExamSubject = exam.subject.map((item) => ({
      subject_id: item.subject_id._id,
      total_marks: item.total_marks,
      chapters: item.chapters.map((item) => item._id),
    }));

    updateExamSubject = updateExamSubject.filter(
      (item) => item.subject_id !== id
    );

    exam.subject = updateExamSubject;
    // console.log(exam)
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      await updateData(exam._id, exam);
      getExamSubject();

      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Exam Subject has been deleted.", "success");
      }
    });
  };

  // console.log(exam);

  const options = {
    plotOptions: {
      bar: {
        columnWidth: "60%",
      },
    },
    colors: ["#484c7f"],
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      showForSingleSeries: true,
      customLegendItems: ["Marks Obtained", "Subject Marks"],
      markers: {
        fillColors: ["#B80000", "#775DD0"],
      },
    },
  };

  const series = [
    {
      name: "Marks Obtained",
      data:
        studentResult.length > 0 &&
        subject.map((item) => ({
          x: item.name,
          y: studentResult.find((value) => item.name === value.Subname).marks,
          goals: [
            {
              name: "Expected Marks",
              value: item.total_marks,
              strokeHeight: 4,
              strokeColor: "rgb(184, 0, 0)",
            },
          ],
        })),
    },
  ];
  // console.log(subject);
  // console.log(studentResult);
  // console.log(series);

  if (Object.keys(examlist).length) {
    if ((type === "admin" || type === "teacher") && examlist.status) {
      delete tableHeader.action;
    }
    return (
      <div>
        {type === "admin" || type === "teacher" ? (
          <>
            {examlist.status ? (
              <h3 className="text-primary my-3 fw-bold">
                Exam of Class {examlist.class_id.name}{" "}
              </h3>
            ) : (
              <Addbutton
                title={`Exam  of Class : ${examlist.class_id.name}`}
                buttonTitle="Add Subject"
                formId="addExamSubject"
              />
            )}
            <div className="d-flex gap-3">
              <button
                type="button"
                className="btn btn-primary btn-set-task w-sm-100 mb-3 fs-6"
                onClick={() => navigate(`${exam?._id}`)}
                disabled={moment().isAfter(examlist?.exam_date) ? false : true}
              >
                Results
              </button>
              {examlist.status && (
                <button
                  type="button"
                  className="btn btn-success btn-set-task w-sm-100 mb-3 fs-6"
                  onClick={() => navigate(`${"examReport"}`)}
                >
                  Report
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="d-flex justify-content-between">
            <h2 className="fw-bold mb-2 text-primary">Exam Subject</h2>
            {examlist.status && (
              <button
                type="button"
                className="btn btn-success btn-set-task w-sm-100 mb-3 fs-6"
                data-bs-toggle="modal"
                data-bs-target="#showreportanalysis"
                onClick={() => setexamReport(true)}
              >
                Report
              </button>
            )}
          </div>
        )}
        {type === "admin" || type === "teacher" ? (
          <div className="card mb-4">
            <Table2
              tableHeader={tableHeader}
              tableData={subject}
              noOfCol={4}
              deleteFunc={handleDeleteExamSub}
              editFunc={setEdit}
              editTarget="editExamSubject"
            />
          </div>
        ) : (
          <>
            <div className="card mb-2">
              <Table2
                tableHeader={tableHeader}
                tableData={subject}
                noOfCol={3}
              />
            </div>

            {examlist.status &&
              (studentResult.length > 0 ? (
                <div className="bg-white d-flex justify-content-center mb-2">
                  <ReactApexChart
                    options={options}
                    series={series}
                    type="bar"
                    height={280}
                    width={500}
                  />
                </div>
              ) : (
                <div className="card mb-2 p-3">
                  <h6 className="text-danger fw-bold text-center">
                    Results Not Found
                  </h6>
                </div>
              ))}
          </>
        )}

        <ExamSubjectform
          formId="addExamSubject"
          title="Add Subject"
          handleExamSubject={handleAddExamSub}
          allSubjects={subjectList}
          enteredSubjects={subject}
        />
        <ExamSubjectform
          formId="editExamSubject"
          title="Edit Subject"
          handleExamSubject={handleEditExamSub}
          allSubjects={subjectList}
          // enteredSubjects={subject}
        />

        <div className="row align-item-center row-deck g-3 mb-3">
          <Card col={6}>
            <div className="table-responsive">
              <table className="table">
                <tbody>
                  <tr>
                    <th>Exam Name :</th>
                    <td>{examlist.exam_name}</td>
                  </tr>
                  <tr>
                    <th>Exam Type :</th>
                    <td>{examlist.exam_type?.exam_name}</td>
                  </tr>
                  <tr>
                    <th>Class :</th>
                    <td>
                      Class {examlist.class_id?.name}/
                      {examlist.section_id?.map((item) => item.name).join(",")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
          <Card col={6}>
            <div className="table-responsive ">
              <table className="table">
                <tbody>
                  <tr>
                    <th>Exam Date :</th>
                    <td>{moment(examlist.exam_date).format("D MMMM YYYY")}</td>
                  </tr>
                  <tr>
                    <th>Exam Time :</th>
                    <td>
                      {moment(examlist.exam_time, "HH:mm").format("hh:mm A")}
                    </td>
                  </tr>
                  <tr>
                    <th>Exam Duration :</th>
                    <td>{examlist.exam_duration} Minutes</td>
                  </tr>
                  {examlist.status && (
                    <tr>
                      <th>Result :</th>
                      <td>Published</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="row align-item-center row-deck g-3 mb-3">
          <Card col={12}>
            <div className="table-responsive">
              <table className="table">
                <tbody>
                  <tr>
                    <th>Subject Name</th>
                    <th>Chapters</th>
                  </tr>

                  {subject.map((item) => (
                    <tr>
                      <td>{item.name} </td>
                      <td>
                        {item.chapters.map((item) => item.name).join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {(type === "student" || type === "parent") && (
          <ViewReportStudent
            formId="showreportanalysis"
            examid={params.exam}
            examReport={examReport}
          />
        )}
      </div>
    );
  } else {
    ("");
  }
}

const ViewReportStudent = ({ formId, examid, examReport }) => {
  const [ChartReport, setChartReport] = useState([0, 0, 0, 0]);
  const [subjects, setSubjects] = useState(null);
  const [reportData, setreportData] = useState([]);

  const options = {
    labels: ["Above 90%", "89% to 60%", "59% to 40%", "Below 40%"],
    colors: ["#00e676", "#ffeb3b", "#ff9800", "#e57373"],
  };

  const fetchExamList = async () => {
    try {
      const response1 = await axios.get(SERVER + `/examSubject/${examid}`, {
        withCredentials: true,
      });

      let update = response1.data[0].subject.map((item) => ({
        name: item.subject_id.name,
        total_marks: item.total_marks,
        _id: item.subject_id._id,
      }));

      setSubjects(update);
      fetchResultsReport(update);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchResultsReport = async (subjects) => {
    try {
      const { data } = await axios.get(
        SERVER + `/examlist/showresults/${examid}`,
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
      update = update.slice(0, 3);
      setreportData(update);
      setChartReport(counts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (examReport) {
      fetchExamList();
    }
  }, [examReport]);
  return (
    <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title  fw-bold" id="addholidayLabel">
              Percentage Report Analysis
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="card mb-4 p-3">
              <div className="d-flex justify-content-center">
                <ReactApexChart
                  options={options}
                  series={ChartReport}
                  type="donut"
                  width={400}
                />
              </div>

              <div className="card">
                <div className="table-responsive">
                  {subjects && reportData.length > 0 && (
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">S.No</th>
                          <th scope="col">Rank</th>
                          {reportData[0].subjects.map((item, index) => (
                            <th scope="col" key={index}>
                              {item.name}
                            </th>
                          ))}
                          <th scope="col">total</th>
                          <th scope="col">percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.map((item, index) => (
                          <tr key={index}>
                            <td className="text-primary fw-bold">
                              {index + 1}
                            </td>
                            <td>Ranker{index + 1}</td>
                            {item.subjects.map((item2) => (
                              <td>{item2.marks}</td>
                            ))}
                            <td>{item.totalMarks}</td>
                            <td>{item.percentage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" data-bs-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
