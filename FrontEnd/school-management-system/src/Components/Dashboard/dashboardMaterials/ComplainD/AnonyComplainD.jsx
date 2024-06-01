import { InstilTable, TableState } from "../../../MainComponents/InstillTable";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export function AnonyCOmplainD2({ complaints }) {
  return (
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold ">Anonymous Complaint Centre</h6>
      </div>
      <InstilTable
        tableState={TableState.SUCCESS}
        paginationPerPage={5}
        hideSearch={true}
        titles={["Sr. No", "Complaint", "Status"]}
        rows={complaints
          ?.filter((item) => item.isAnonymous)
          .map((item, idx) => ({
            "Sr. No": idx + 1,
            Complaint: item.complainTitle,
            Status: (
              <div className="btn-outline-warning">
                {item.queryStatus ? "Solved" : "Not Solved"}
              </div>
            ),
          }))}
      />
      {/* <div ><a href={'complaints'} className="row d-flex justify-content-center text-primary">{(complain.length === 5)?'View More':''}</a></div> */}
    </div>
  );
}

export default function AnonyCOmplainD({ complaints }) {
  const navigate = useNavigate();

  const redirect = (id) => {
    navigate(`/complaints/${id}`);
  };

  return (
    <div className="card">
      <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold ">Anonymous Complaint Centre</h6>
      </div>
      <table id="patient-table" className="table table-hover align-middle mb-0">
        <thead>
          <tr>
            <th>Sr.no</th>
            <th>User Type</th>
            <th>Date</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {complaints?.complains.map((item, idx) => (
            <tr key={idx} onClick={() => redirect(item._id)}>
              <td>{idx + 1}.</td>
              <td>
                <img
                  src="assets/images/xs/avatar3.jpg"
                  className="avatar sm rounded-circle me-2"
                  alt="profile-image"
                />
                {item.complainFor[0]?.category}
              </td>
              <td>{moment(item.dateCreated).format("D MMM")}</td>
              <td>{item.complainTitle}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
