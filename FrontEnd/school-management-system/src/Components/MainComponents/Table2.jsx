import { AiFillEdit, AiFillDelete, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";

export default function Table2({
  tableHeader,
  tableData,
  editTarget,
  editFunc,
  deleteFunc,
  noOfCol,
  view = 0,
}) {
  // console.log((deleteFunc)?'a':'b')
  const posView = deleteFunc ? "2" : "1";
  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            {Object.keys(tableHeader).map((item, idx) => (
              <th scope="col" key={idx}>
                {tableHeader[item]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, idx) => {
            // console.log(item);
            return (
              <tr key={idx}>
                {Object.keys(tableHeader).map((thData, id) => {
                  if (id === 0) {
                    return (
                      <th scope="row" key={id}>
                        {idx + 1}
                      </th>
                    );
                  }
                  if (view && id === noOfCol - posView) {
                    return (
                      <td id={id} key={id}>
                        <Link
                          to={`${item._id}`}
                          className=" btn btn btn-outline-primary "
                        >
                          <AiOutlineEye />
                        </Link>
                        <span className="p-3">
                          <b></b>
                        </span>
                      </td>
                    );
                  }
                  if (id === noOfCol - 1 && deleteFunc) {
                    return (
                      <th
                        className="btn-group"
                        role="group"
                        aria-label="Basic outlined example"
                        key={id}
                      >
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          data-bs-toggle="modal"
                          data-bs-target={"#" + editTarget}
                          onClick={() => editFunc(item)}
                        >
                          <AiFillEdit />
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary deleterow"
                          onClick={() => deleteFunc(item._id)}
                        >
                          <AiFillDelete className="text-danger" />
                        </button>
                      </th>
                    );
                  }
                  return <td key={id}>{item[thData]}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
