import React from  "react";
import { useState, useEffect } from  "react";
import DataTable from  "react-data-table-component";
export const TableState={
  LOADING:0,
  SUCCESS:1,
  ERROR:-1
} as const


export type TableState = typeof TableState[keyof typeof TableState]

// The types are incompleate and need to be updated

export function InstilTable({titles,rows,tableState=TableState.LOADING,...props}:{titles:string[],rows:{[key :string]:React.ReactNode}[],tableState?:number,hideSearch?:boolean,title?:string}){
    const [records, setRecords] = useState<any[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
         
    // console.log(titles, "titlesInstilltable")
    // console.log(rows, "rowsInstilltable")

    useEffect(() => {
      setRecords(rows);
    }, [rows]);

    useEffect(()=>{
      setColumns(titles.map((title)=>({name:title,selector:(row:any)=>row[title],sortable:true})))
    },[titles])

    
    const handleFilter = (event:any) => {
      const newData = rows.filter((row) =>
        Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
      );
      setRecords(newData);
    };


   
    return(
      <div>
      {
      tableState==TableState.LOADING ? 
      (
        <div
          style={{
            height: "50vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div className="spinner-grow text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ):
      tableState==TableState.ERROR ?
       (
        <div
          style={{
            height: "50vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >Network Error</div>
      )
      : 
      (
        <div className="conatainer mt-5">
          {(!props.hideSearch) && (
          <div className="text-end">
            <input
              type="text"
              className="form-control"
              onChange={(e) => handleFilter(e)}
              placeholder="Search here..."
              style={{ width: "200px", marginBottom: "10px"}}
            ></input>
          </div>)}
          <DataTable
            title={props.title}
            columns={columns}
            data={records}
            // selectableRows
            fixedHeader
            pagination
            {...props}
          ></DataTable>
        </div>
      )}
    </div>

    )
  }




