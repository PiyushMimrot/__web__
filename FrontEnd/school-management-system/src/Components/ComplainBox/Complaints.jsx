import { useEffect, useState } from "react";
import { SERVER } from "../../config";

export default function Complaints(){
const [complaints,setComplaints]  =  useState([]);
useEffect(()=>{
    getComplaints();
},[]);

const getComplaints = () =>{
    fetch(SERVER + `/complain`)
	.then(response => response.json())
	.then(data => setComplaints(data))
	.catch(err => console.error(err));
}
console.log(complaints)
    return (
        <div>
            
        </div>
    )
}