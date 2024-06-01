import { useState } from "react"

export default function AddTaxesform({formId,title,handleTaxes}) {
    const [taxName,setTaxName] = useState('');
    const [value,setValue] = useState('');

    const handleSubmit = (e) =>{
        e.preventDefault();
        handleTaxes({tax_name:taxName,value});
        setTaxName('');
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
                            <label htmlFor="exampleFormControlInput1" className="form-label">Tax Name</label>
                            <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="" value={taxName} onChange={(e)=>setTaxName(e.target.value)}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Amount (%)</label>
                            <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="%" value={value} maxLength={2} onChange={(e)=>setValue(e.target.value)}/>
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