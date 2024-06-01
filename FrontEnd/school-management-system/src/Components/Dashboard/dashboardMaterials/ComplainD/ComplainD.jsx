import { InstilTable, TableState } from "../../../MainComponents/InstillTable";

import { useNavigate } from "react-router-dom";

export default function ComplainD({ complaints }) {
  // const [tableState,setTableState] = useState(TableState.LOADING)
  const nav = useNavigate();

  const mappedArray = complaints?.complains.map((item) => {
    const forId = item.complainFor[0].forId;

    const matchingStudent = complaints.studentDetails.find(
      (student) => student._id.toString() === forId.toString()
    );
    item.complainFor[0].details = matchingStudent;
    return item;
  });

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between bg-transparent border-bottom-0">
        <h6 className="mb-0 fw-bold ">Complaint Center</h6>
      </div>
      <InstilTable
        tableState={TableState.SUCCESS}
        paginationPerPage={5}
        hideSearch={true}
        titles={["Sr. No", "Student Name", "Complain On", "Reason"]}
        rows={mappedArray?.map((item, idx) => ({
          "Sr. No": idx + 1,
          "Student Name": (
            <span
              style={{ cursor: "pointer" }}
              onClick={() => nav("/StudentDoubts/")}
            >
              {item.complainFor[0]?.details?.name ?? "Not Assigned"}
            </span>
          ),
          "Complain On": item.complainOn[0]?.category ?? "Not Assigned",
          Reason: item.complainTitle,
        }))}
      />
      {/* <div ><a href={'complaints'} className="row d-flex justify-content-center text-primary">{(complaints?.length === 5)?'View More':''}</a></div> */}
    </div>
  );
}
