import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ButtonCompnent({data}) {

    const navigate = useNavigate();

    return (
        <>
            <button type="submit" className="btn btn-primary" onClick={
                () => navigate(`/courses/${data._id}`)
            }>View Courses</button>
        </>
    )
}
