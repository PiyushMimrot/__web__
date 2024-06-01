import axios from "axios";
import { useEffect, useState } from "react"
import { SERVER } from "../../config";

export default function ComplaintForm({handleComplain}){
    const [staffType,setStaffType] = useState([]);
    const [staff,setStaff] = useState([]);
    const [complainText,setComplainText] = useState(''); 
    const [complainTo,setComplainTo] = useState({});
    
    useEffect(() => {
        getStaffType();
        if(complainTo['staffType_id']){
            getStaff();
        }
    },[complainTo]);

    const getStaffType = async () =>{
        try {
            let data = await axios.get(SERVER + '/staffmanage/getStaffType');
            setStaffType(data.data.data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const getStaff = async () =>{
        try {
            let data = await axios.get(SERVER + `/complain/${complainTo['staffType_id']}`);
            setStaff(data.data);
            console.log(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleSelect = (e) =>{
        complainTo[e.target.name] = e.target.value;
        setComplainTo({...complainTo});
    }

    const handleChange = (e) => {
        setComplainText(e.target.value);
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        handleComplain({'staff_id':complainTo['staff_id'],complain:complainText,complainant_id:'5678799'});
        setStaff([]);
        setComplainText('');
        setComplainTo({});
    }
    // console.log(complainTo);

    return(
        <div className="card shadow">
                <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                    <h4 className="mb-0 fw-bold ">Complaint</h4>
                </div>
                <div className="card-body card-hover-show">
                    <form onSubmit={handleSubmit} name="complainForm">
                        <div className="row g-3 mb-3">
                            <div className="g-3 d-flex justify-content-between col-4">
                            <h6 className="mb-0 fw-bold">To</h6>
                                <div className="ml-3">                 
                                    <label htmlFor="formFileMultipleone" className="form-label">Select staff type</label>
                                    <select className="form-select" aria-label="Default select Priority" name="staffType_id" onChange={handleSelect}>
                                    <option defaultValue></option>
                                        {
                                            staffType.map((item,idx)=>{
                                                return <option value={item._id} key={idx}>{item.name}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="ml-3">                 
                                    <label htmlFor="formFileMultipleone" className="form-label">Select staff </label>
                                    <select className="form-select" aria-label="Default select Priority" name="staff_id" onChange={handleSelect}>
                                    <option defaultValue></option>
                                        {
                                            staff.map((item,idx)=>{
                                                return <option value={item._id} key={idx}>{item.name}</option>
                                            })
                                        }
                                    </select>
                                </div>
                            </div>

                            <div className="col-sm-12">
                                <label htmlFor="fileimg" className="form-label">Attach document</label>
                                <input type="File" className="form-control" />
                            </div>
                            <div className="col-sm-12">
                                <label htmlFor="depone" className="form-label">Complain</label>
                                <textarea type="text" className="form-control" value={complainText} onChange={handleChange}/>
                            </div>

                        </div>

                        <button type="submit" className="btn btn-primary lift">Submit</button>
                    </form>
                </div>
            </div>
    )
}