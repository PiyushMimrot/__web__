import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { SERVER } from '../../config';

export default function ClassTeacherNew() {
    const [subjects, setSubjects] = useState([]);

    const [sessions, setSessions] = useState([]);
    const [classInfo, setClassinfo] = useState([]);
    const [sectionInfo, setSectionInfo] = useState([]);
    const [teacherInfo, setTeacherInfo] = useState([]);

    const [selectedClass, setSelectedClass] = useState("");
    const [selectedSection, setSelectedSection] = useState("");
    const [selectedSession, setSelectedSession] = useState("");

    const [classTeacherId, setClassTeacherId] = useState("");


    const getSubjects = async () => {

        if (selectedClass !== "0") {
            const res = await axios.get(`${SERVER}/subject/getSubjectClass/${selectedClass}`, {withCredentials:true})
            //(res)
            console.log(res)
            setSubjects(res.data.data);
        }
        else {
            setSubjects([]);
        }
    }

    const getTeacher = async () => {

        const res = await axios.get(`${SERVER}/ClassTeacher/getTeachers`, {withCredentials:true});

        console.log(res)

        setTeacherInfo(res.data.data);

    }

    const handleAddTeacher = async () => {

        const res = await axios.post(`${SERVER}/ClassTeacher/addTeachers`, {
            subjectArray: subjects,
            class_id: selectedClass,
            section_id: selectedSection,
            session_id: selectedSession,
            class_teacher_id: classTeacherId
        }, {withCredentials:true})

        console.log(res);
    }

    const getSection = async () => {

        if (selectedClass !== "0") {
            const res = await axios.get(`${SERVER}/section/getSectionClass/${selectedClass}`, {withCredentials:true})
            //(res)
            console.log(res)
            setSectionInfo(res.data.data);
        }
        else {
            setSectionInfo([]);
        }

    }

    useEffect(() => {
        getSubjects()
    }, [selectedClass]);

    useEffect(() => {
        fetch(SERVER + '/classes',{credentials:'include'})
            .then((res) => res.json())
            .then((data) => setClassinfo(data))
    }, [])

    useEffect(() => {
        getSection();
    }, [selectedClass])

    useEffect(() => {
        fetch(SERVER + '/sessions')
            .then((res) => res.json())
            .then((data) => setSessions(data))
    }, [])

    useEffect(() => {
        getTeacher()
    }, [])

    return (
        <>
            <div className="body d-flex py-lg-3 py-md-2">
                <div className="container-xxl">
                    <div className="row align-items-center">
                        <div className="border-0 mb-4">
                            <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom">
                                <h3 className="fw-bold mb-0 col-2">Add teachers</h3>
                                <div className="col-10 d-flex">
                                    <div className='row w-100 px-5'>
                                        <div className='col-3'>
                                            <select value={selectedClass} className="form-select" aria-label="Default select example" onChange={(e) => setSelectedClass(e.target.value)}>
                                                <option value={0} selected>No Class</option>
                                                {classInfo?.map((item, idx) => {
                                                    return (
                                                        <option key={idx} value={item._id}>{item.name}</option>
                                                    )
                                                }
                                                )}
                                            </select>
                                        </div>
                                        <div className='col-3'>
                                            <select value={selectedSection} className="form-select" aria-label="Default select example" onChange={(e) => setSelectedSection(e.target.value)}>
                                                <option value={0} selected>No Section</option>
                                                {sectionInfo?.map((item, idx) => {
                                                    return (
                                                        <option key={idx} value={item._id}>{item.name}</option>
                                                    )
                                                }
                                                )}
                                            </select>
                                        </div>
                                        <div className='col-3'>
                                            <select value={selectedSession} className="form-select" aria-label="Default select example" onChange={(e) => setSelectedSession(e.target.value)}>
                                                <option value={0} selected>No Session</option>
                                                {sessions?.map((item, idx) => {
                                                    return (
                                                        <option key={idx} value={item._id}>{item.session_name}</option>
                                                    )
                                                }
                                                )}
                                            </select>
                                        </div>
                                        <div className='col-3'>
                                            <select value={classTeacherId} className="form-select" aria-label="Default select example" onChange={(e) => setClassTeacherId(e.target.value)}>
                                                <option value={0} selected>Select Class Teacher</option>
                                                {teacherInfo?.map((item, idx) => {
                                                    return (
                                                        <option key={idx} value={item._id}>{item.name}</option>
                                                    )
                                                }
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th scope="col">No.</th>
                                        <th scope="col">Subject</th>
                                        <th scope="col">Select Teacher</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subjects?.map((item, idx) => {
                                        return (
                                            <tr key={idx}>
                                                <th scope="row">{idx + 1}</th>
                                                <td>{item.name}</td>
                                                <td>
                                                    <select className="form-select" aria-label="Default select example"
                                                        onChange={(e) => {
                                                            let temp = [...subjects]
                                                            temp[idx].teacher_id = e.target.value;
                                                            console.log(temp);
                                                            setSubjects(temp);
                                                        }}
                                                    >
                                                        <option value={0} selected>Select Teacher</option>
                                                        {teacherInfo?.map((item, idx) => {
                                                            return (
                                                                <option key={idx} value={item._id}>{item.name}</option>
                                                            )
                                                        }
                                                        )}
                                                    </select>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <button type="button" className="btn btn-dark btn-set-task w-sm-100" onClick={handleAddTeacher}>Add Teacher</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Edit subject Model */}
        </>
    )
}