import { SERVER } from "../../config";

import ComplaintForm from "./ComplainForm";

export default function Complaint() {

    const handleComplain = (complaintData) =>{
        fetch(SERVER + `/complain`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(complaintData),
        })
            .then((response) => response.json())
            .catch((error) => {
                console.error('Error sending complain:', error)
            });
    }

    return (
        <div>
            <ComplaintForm handleComplain={handleComplain} />
        </div>
    )
}