import { useState } from "react"

export default function SpecialChargesform({formId,title,handleSpCharge}) {
    const [chargeName,setChargeName] = useState('');
    const [value,setValue] = useState('');

    const handleSubmit = (e) =>{
        e.preventDefault();
        handleSpCharge({name:chargeName,value});
        setChargeName('');
        setValue('')
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
                            <label htmlFor="exampleFormControlInput1" className="form-label">Charge Name</label>
                            <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="" value={chargeName} onChange={(e)=>setChargeName(e.target.value)}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Amount</label>
                            <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="" value={value} onChange={(e)=>setValue(e.target.value)}/>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">Add</button>
                    </div>
                </form>
            </div>
        </div>
    )
}