import { AiFillEdit, AiFillDelete} from 'react-icons/ai';

import { InstilTable } from "../MainComponents/InstillTable"
export default function ViewClassDetail({title,formId,teacher,setEdit,handleDelete}){
    console.log(teacher)
    return (
        <div className="modal fade" id={formId} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title  fw-bold" id="addholidayLabel">{title}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        
                        {(teacher.length) && <InstilTable titles={[
                            'Subject',
                            'Teacher',
                            'Is Class Teacher',
                            'Action'
                        ]}  rows={teacher.map((item,idx)=>[
                            item.subject_id.name,
                            item.teacher_id.name,
    (item.IsClassTeacher ? 1 : 0),
    <div className="btn-group" role="group" aria-label="Basic outlined example">
    <button type="button" className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#editSubTeacher" onClick={() => setEdit(teacher)}><AiFillEdit /></button>
    <button type="button" className="btn btn-outline-secondary deleterow" onClick={() => handleDelete(teacher._id)}><AiFillDelete className='text-danger' /></button>
</div>
                        ])}/>
                    }

                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Add</button>
                    </div>
                </div>
            </div>
        </div>
    )
}




// rows={[
//     teacher.subject_id.name,
//     teacher.teacher_id.name,
//     (teacher.IsClassTeacher ? 1 : 0),
//     <div className="btn-group" role="group" aria-label="Basic outlined example">
//     <button type="button" className="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#editSubTeacher" onClick={() => setEdit(teacher)}><AiFillEdit /></button>
//     <button type="button" className="btn btn-outline-secondary deleterow" onClick={() => handleDelete(teacher._id)}><AiFillDelete className='text-danger' /></button>
// </div>
// ]}/>