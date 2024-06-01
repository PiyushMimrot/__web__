import React, {  useEffect, useRef, useState } from "react";
import { ExcelStudentData } from "../student_apis.js";
import { RiFileDownloadLine } from "react-icons/ri/index.js";
import * as XLSX from "xlsx";
import { SERVER } from "../../../config.js";
import Swal from "sweetalert2";

const XLFileTypes = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
];

export const MultipleAdd = (props: {onClose: () => void}) => {

  const [alert, setAlert] = useState<{type:'primary'|'danger',data:string}|null>(null);
  const [excelData, setExcelData] = useState<any>();
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | null) => {
    const selectedFile = e?.target?.files?.[0];
    if (e?.target?.files?.[0]) {
      if (selectedFile && XLFileTypes.includes(selectedFile.type)) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const workbook = XLSX.read(e.target?.result);
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const parsedData: any[] = XLSX.utils.sheet_to_json(sheet);
          console.log("Parsed data=>",parsedData)
          for (const item of parsedData) {
           if(Object.keys(item).length < 7){
             setAlert({type:'danger',data:"Invalid sheet row number. Some fields are missing!"})
           }
          }
          setExcelData(parsedData);
        };
        reader.readAsArrayBuffer(e.target.files[0]);
      }
      else{
        setAlert({type:'danger',data:"Invalid file type. Please select a valid file type!"})
        console.log("Invalid file type")
      }
    } else {
      setAlert({type:'danger',data:"Please select a file!"})
    }
  };

  return (
    <div className="modal-dialog modal-dialog-centered modal-md modal-dialog-scrollable">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title  fw-bold" id="leaveaddLabel">
            Add Students from Excel Sheet
          </h5>
          <button type="button" className="btn-close" onClick={props.onClose} />
        </div>
        <div className="modal-body">
          <input
            type="file"
            accept=".xls, .xlsx, .csv"
            className="form-control"
            onChange={handleFileUpload}
          />
          <p className="text-danger font-monospace">
            *Please ensure that the Excel includes mandatory columns:
            
              name, number, class, section, parent's name and parent's number
          
          </p>

          {
            alert && (
              <div className={`alert alert-${alert.type} mt-2`} role="alert">
                {alert.data}
              </div>
            )
          }

          {
            excelData ? (
              <ExcelSheetRowValidation data={excelData} onSuccess={()=>{
                props.onClose()
                Swal.fire("Data uploaded successfully!", "", "success")
              }}/>
            ):
            <div className="d-flex justify-content-between align-items-center">
            <a
              className="btn btn-danger text-light"
              href="../../../public/sampleDocs/addmultiplestudent_sample.xlsx"
              download="addmultiplestudent_sample.xlsx"
            >
              <RiFileDownloadLine size={20} />
              Sample
            </a>
          </div>
          }

          
        </div>
      </div>
    </div>
  );
};




const ExcelSheetRowAndDataMapping:{val:keyof ExcelStudentData,label:string,required?:boolean}[] = [
  {val:"name",label:"Name",required:true},
  {val:"number",label:"Number",required:true},
  {val:"cls",label:"Class",required:true},
  {val:"sec",label:"Section",required:true},
  {val:"parentNumber",label:"Parent's Number",required:true},
  {val:"dob",label:"Date of Birth",required:true},
  {val:"gender",label:"Gender",required:true},
  {val:"fatherName",label:"Father's Name",required:true},
  {val:"motherName",label:"Mother's Name",required:true},
  {val:"religion",label:"Religion"},
  {val:"nationality",label:"Nationality"},
] as const

type ExcelStudentDataValues = typeof ExcelSheetRowAndDataMapping[number]["val"]






const SelectOptions = (props:{rowName:string,selected?:ExcelStudentDataValues,onChange:(selected?:ExcelStudentDataValues)=>void}) => {

  useEffect(() => {
    const formattedRowName = props.rowName.trim().toLowerCase()
    const selected = ExcelSheetRowAndDataMapping.find((data) => data.val.toLocaleLowerCase() == formattedRowName || data.label.toLocaleLowerCase() == formattedRowName)
    props.onChange(selected?.val)
  },[])

  return (
    <select className="form-select" value={props.selected||''} onChange={(e)=>props.onChange(e.target.value as ExcelStudentDataValues)}>
      <option value="" disabled>Select</option>
      {ExcelSheetRowAndDataMapping.map((data:any, idx:number) => (
        <option key={idx} value={data.val}>{data.label}</option>
      ))}
    </select>
  );
};


const ExcelSheetRowValidation = (props: { data: any[],onSuccess:()=>void }) => {
  
  const [excelRowMaping, setExcelRowMaping] = useState<Partial<{[key:string]:ExcelStudentDataValues}>>({});
  const [alert, setAlert] = useState<{type:'primary'|'danger'|'loading',data:string}|null>(null);

  const upload =async ()=>{
    setAlert({type:'loading',data:"Uploading..."})
    const requiredFields = ExcelSheetRowAndDataMapping.map((item) => item.val);
    const missingFields = requiredFields.filter((field) => !Object.values(excelRowMaping).some((value) => value === field));
    if(missingFields.length){
      setAlert({type:'danger',data:`Please map the following fields\t\n: ${missingFields.map((item) => ExcelSheetRowAndDataMapping.find(e=>e.val==item)?.label).join(",")}`})
      return
    }

    const data:ExcelStudentData[] = []
    props.data.map((item) => {
      const studentData:ExcelStudentData = {}
      for(const key in item){
        const mappedKey = excelRowMaping[key]
        if(mappedKey){
          studentData[mappedKey] = item[key]
        }
      }
      data.push(studentData)
    })
    const resp = await fetch(`${SERVER}/students/add_multiple_students`,
    {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(data),
      credentials:"include"
    })
    const result = await resp.json()
    if(result.success){
      setAlert({type:'primary',data:"Data uploaded successfully!"})
      props.onSuccess()
    }
  }
    return (
      <>
      {
        alert && alert.type == 'loading' ? (
         
        <div style={{width:'100%' , display:'flex',justifyContent:'center',margin:'40px 0px'}}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        ):
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <h5>Excel Sheet Data</h5>
             </div>
            <div className="table-responsive">
                <table className="table table-bordered table-hover table-striped">
                    <thead>
                        <tr>
                            <th>Excel Sheet Row</th>
                            <th>Student Data</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(props.data[0]).map((item, idx) => (
                            <tr key={idx}>
                                <td>{item}</td>
                                <td>
                                    <SelectOptions rowName={item} selected={excelRowMaping[item]} onChange={(selected)=>{
                                      if(alert) setAlert(null)
                                      setExcelRowMaping((prev)=>{
                                        for(const key in prev){
                                          if(prev[key] == selected)delete prev[key]
                                        }
                                        return {...prev,[item]:selected}
                                      })
                                    }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {
                  alert && (
                    <div className={`alert alert-${alert.type} mt-2`} role="alert">
                      {alert.data}
                    </div>
                  )
                }
               
                <div className="d-flex justify-content-end align-items-center">
                <button
                  type="button"
                  className="btn btn-primary m-1"
                  onClick={upload}>
                  Upload
                </button>
            </div>
          </div>
        </div>}
        </>
    )
}





