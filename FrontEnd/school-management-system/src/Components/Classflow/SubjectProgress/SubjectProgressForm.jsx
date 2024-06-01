import { useState } from "react"
import { useParams } from "react-router-dom";

export default function SubjectProgressForm({formId,title,handleCLassFLow}){
    const [chapter_name,setChapterName] = useState('');
    const [topicBlk,setTopicBlk] = useState([{topic:'',progress:0}]);
    const params = useParams();
// console.log(params);

    const handleTopic = (e,idx) =>{
        topicBlk[idx]['topic'] = e.target.value; 
        setTopicBlk([...topicBlk]);
    }

    const addTopic = () =>{
        setTopicBlk([...topicBlk,{topic:'',progress:0}])
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        let sumbitData = {classSubjectId:params.subject,chapter_name,topics:topicBlk};
        // console.log(sumbitData);
        handleCLassFLow(sumbitData);
    }
    
    return(
        <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
            <form className="modal-content" onSubmit={handleSubmit}>
                <div className="modal-header">
                    <h5 className="modal-title  fw-bold" id="addholidayLabel">{title}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                <div className="mb-3">
                    <label htmlFor="exampleFormControlInput1" className="form-label">Chapter Name</label>
                    <input type="text" className="form-control" id="exampleFormControlInput1" name="chapter_name" value={chapter_name} onChange={e => setChapterName(e.target.value)}/>
                </div>
                <div>
                    {
                        topicBlk.map((item,idx)=>{
                            return(
                                <div key={idx} class_name="card card-body">
                                    <div className="mb-3 row">
                    <label htmlFor="exampleFormControlInput1" className="form-label col">Topic Name</label>
                    <input type="text" className="form-control col" id="exampleFormControlInput1" name="section_name" value={topicBlk[idx].topic } onChange={(e)=>handleTopic(e,idx)}/>
                </div>
                                </div>
                            )
                        })
                    }
                </div>
                <button type="button" className="btn btn-secondary w-100" onClick={addTopic}>Add Topic</button>
                </div>
                <div className="modal-footer">
                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Add</button>
                </div>
            </form>
        </div>
    </div>
    )
}