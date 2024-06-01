import React from 'react'
import FunFact from './RSidebarComponent/FunFact'
import Ads from "../../utils/Adds/techtoklogo.png";

export default function RSidebar() {
    return (
        <div style={{userSelect:'none'}} className="px-3 py-3 py-md-3 mr-4">
            <div className="d-flex flex-column h-100">
                <div className="card shadow mb-3 rounded-2">
                    <div className="card-body">
                        <h5 className="card-title">Tool Tips</h5>
                        <p className="card-text">Add a staff and give permission to a class. Admin is the only person who can handle this </p>
                    </div>
                </div>
                <FunFact/>
                <div className="card shadow mb-3 rounded-2" >
                    <div className="card-body">
                        <h5 className="card-title">Notice</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    </div>
                </div>
                <div className="card shadow mb-3 rounded-2">
                    <div className="card-body">
                       <img src={Ads} alt='ads' className='img-fluid img-thumbnail'/>
                    </div>
                </div>
            </div>
        </div>
    )
}
