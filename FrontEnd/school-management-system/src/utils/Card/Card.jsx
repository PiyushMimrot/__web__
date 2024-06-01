export default function Card({children,col,bg}){
    return(
        <div className={`col-xxl-${col} col-xl-${col} col-lg-${col} col-md-12 ${bg} shadow`}>
            <div className="card">
                <div className="card-body">
                    {children}
                </div>
            </div>
        </div>
    )
}