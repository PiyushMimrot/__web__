import { useEffect, useState } from "react"
import { SERVER } from "../../../config";
import axios from "axios";

export default function FunFact() {
    const [funFacts,setFunfacts] = useState([]);
    // const [oneFunFact,setOneFunfact] = useState({fact:'',explanation:''});
    const [index,setIndex] = useState(0);


    useEffect(()=>{

        if(!funFacts.length){
            getFunFact();
        }
            if (index === funFacts.length - 1){
                setIndex(0);
            }
            setTimeout(() => {
              setIndex(index + 1)
            }, 10000);
        
    },[index]);

    const getFunFact = async () =>{
        try {
            let funf = await axios.get(SERVER + '/funfact',{withCredentials:true});
            setFunfacts(funf.data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className="card mb-3 rounded-2" >
            <div className="card-body">
                { (funFacts.length)?(
                         <>
                         <h5 className="card-title">{funFacts[index].fact}</h5>
                         <p className="card-text">{funFacts[index].explanation} </p>
                         </>
                ):''
                }
            </div>
        </div>
    )
}