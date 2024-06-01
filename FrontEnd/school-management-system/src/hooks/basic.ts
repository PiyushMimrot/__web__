import { useEffect, useState } from "react";
import { SERVER } from "../config.js";


type ClassAndSectionInfo = {
    cls:string;
    sections:string[]
}

function useClassAndSectionInfo(){
    const [info, setInfo] = useState<ClassAndSectionInfo[]>([]);
    useEffect(() => {
        fetch(`${SERVER}/api/cls_and_section_info`, { credentials: "include" })
            .then((res) => res.json())
            .then((data) =>{
                if(data.success){
                    setInfo(data.info)
                }
            });
    },[])
    return info;
}


function useActiveSession(){
    const [session, setSession] = useState<string|null>(null);
    useEffect(() => {
        fetch(`${SERVER}/sessions/active`, { credentials: "include" })
          .then((res) => res.json())
          .then((data) => {
            setSession(data.data._id)
            console.log("Use session called :",data.data._id)
        });
    },[])
    return session;
}


export { useClassAndSectionInfo,useActiveSession }
