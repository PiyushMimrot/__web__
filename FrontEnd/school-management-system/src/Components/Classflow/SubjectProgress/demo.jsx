import { SERVER } from "../../../config";
import { AiFillEdit, AiFillDelete, AiOutlineEye } from "react-icons/ai";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SubjectprogressEdit from "./SubjectprogressEdit";
import { InstilTable } from "../../MainComponents/InstillTable";
import Swal from 'sweetalert2';


export default function SubjectProgress() {
    const params = useParams();
    const [subject, setSubject] = useState({});
    const [classProgres, setClassProgress] = useState([]);
    const [edit, setEdit] = useState();
    const [chapters, setChapters] = useState([]);
    const [students, setStudents] = useState([]);
    const [reason, setReason] = useState([]);
    const [chapterD,setChapterD] = useState({});
    // const [itemId,setItemId] = useState();

    // console.log(classProgres);
    // console.log(students);

    useEffect(() => {
        if (subject._id) {
            getChapters();
        } else {
            getSubject();
        }
        // getStudents();
        getClassprogress();
        getReason();

    }, [subject]);

    useEffect(() => {
        if (!classProgres.length) {
            postClassProgress();
        }
    }, [chapters]);

    useEffect(() => {
        console.log(classProgres,'cp');
        console.log(students,'std');

        if (classProgres.length && !students.length) {
            getAttendance();
        }

    }, [classProgres])

    const getReason = () => {
        fetch(SERVER + `/classLeave`,{credentials:'include'})
            .then((res => res.json()))
            .then(data => setReason(data))
    }

    const getAttendance = async () => {
        let date = new Date().toISOString().split('T')[0];
        let { class_id, section_id } = classProgres[0].classSubjectId;
        const res = await fetch(`${SERVER}/attendance/getAttendanceByClassAndSection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ class_id, section_id, date }),
            credentials:'include'
        })
            .then(res =>res.json())
            .then(data =>{ 
                console.log(data);
                setStudents(data.data)
            })
            .catch((err)=>console.log(err))
    }

    const postClassProgress = () => {

        let chapterProgress = chapters.reduce((acc, crr, idx) => {
            acc.push({ chapter_id: crr._id, classSubjectId: params.subject, topics: crr.topics });
            return acc;
        }, []);

        if (chapterProgress.length) {
            fetch(SERVER + '/clasflow/chapters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(chapterProgress),
                credentials:'include'
            })
                .then((response) => response.json())
                .catch((error) => {
                    console.error('Error adding Chapter:', error)
                });

        }
    };



    const getChapters = () => {
        fetch(SERVER + `/course/getCourse/${subject._id}`)
            .then((res => res.json()))
            .then(data => setChapters(data.data))
    }

    const getSubject = () => {
        fetch(`${SERVER}/ClassTeacher/getSubject/${params.subject}`,{credentials:'include'})
            .then(res => res.json())
            .then(data => setSubject(data.data.subject_id));

    }
    const getClassprogress = () => {
        // console.log('fetch')
        fetch(SERVER + `/clasflow/${params.subject}`,{credentials:'include'})
            .then(response => response.json())
            .then(data => setClassProgress(data))
            .catch(err => console.error('Error fetching:', err));
    }

    const handleEditData = (editData) => {
        let { chapter, topic } = edit;
        // console.log(editData);
        // console.log(edit);
        let editChapter = chapter.topics.map((item, idx) => {
            // console.log(item._id, ' ', topic._id)
            if (item._id === topic._id) {
                item = { ...item, ...editData }
            }
            return item
        })

        chapter.topics = editChapter;

        classProgres
        console.log(chapter)
        // editClassFlow(chapter);

        Swal.fire({
            title: 'Success',
            text: 'Progress Added ...',
            icon: 'success',
            timer: 3000
          })
        //   getClassprogress();

    }

    const handleAbsentee = (absentsD) => {

        let absentD = { topic: edit.topic.topic, chapterflow: edit.chapter._id, absentees: [...absentsD] }
        fetch(SERVER + '/classabsents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(absentD),
            credentials:'include'
        })
            .then((response) => response.json())
            .catch((error) => {
                console.error('Error adding absentees:', error)
            });
    }

    const editClassFlow = (editD) => {
        console.log(editD);


        fetch(SERVER + `/clasflow/${editD._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editD),
            credentials:'include'
        })
            .then((response) => response.json())
            .catch((error) => {
                console.error('Error adding Progress:', error)
            });
    }
    // console.log(students)
    const handleChapter = (e) =>{ 

        // console.log(classProgres[e.target.value])
        let claProg = classProgres;
        claProg[e.target.value].topics = claProg[e.target.value].topics.filter((item)=>item.progress!==100); 
        setChapterD(claProg[e.target.value])
    }
 console.log(classProgres,'t');

    return (
        <div>
            <h2>{subject.name}</h2>
            <div>
                <div className="col-sm shadow">
                    <select className="form-select" aria-label="Default select reason" name="topics" onChange={handleChapter}>
                        <option>Select Chapter</option>
                        {
                            classProgres.map((chapter, idx) => {
                                return (
                                    <option key={idx} value={idx} >{chapter.chapter_id.name}</option>
                                )
                            })
                        }
                    </select>
                </div>


                { 
                    (chapterD['topics']) && <InstilTable
                    titles={
                        [
                            "Sr No.",
                            "Topic",
                            "Progress (%)",
                            "Action"
                        ]
                    }
                    rows={chapterD.topics.map((topic, id) => [
                        id + 1,
                        topic.topic,
                        (topic.progress) ? topic.progress : 0,
                        <div>
                            <button type="button" className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target={'#editProgress'} onClick={() => setEdit({ topic, chapter:chapterD })}><AiFillEdit /></button>
                        </div>
                    ]
                    )} />
                }
                <SubjectprogressEdit formId={'editProgress'} title={'Edit Progress'} handleEdit={handleEditData} handleAbsents={handleAbsentee} students={students} reasons={reason} edit={edit || ''} />

            </div>

        </div>
    )
}