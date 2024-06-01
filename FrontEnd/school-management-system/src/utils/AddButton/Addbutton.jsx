import {IoAddCircleOutline} from 'react-icons/io5';

export default function Addbutton({title,buttonTitle,formId}) {
    return (
        <div className="row align-items-center">
            <div className="border-0 mb-4">
                <div className="card-header py-3 no-bg bg-transparent d-flex align-items-center px-0 justify-content-between border-bottom flex-wrap">
                    <h2 className="fw-bold mb-0 text-primary">{title}</h2>
                    <div className="col-auto d-flex w-sm-100">
                        <button type="button" className="btn btn-dark btn-lg btn-set-task w-sm-100 shadow" data-bs-toggle="modal" data-bs-target={`#${formId}`}><IoAddCircleOutline color="white"  size={20}/> {buttonTitle}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}