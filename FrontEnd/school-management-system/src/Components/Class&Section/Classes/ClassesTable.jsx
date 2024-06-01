import { useState } from "react";
import { Link } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { AiOutlineEye } from "react-icons/ai";
import { IoBook } from "react-icons/io5";
import { getTypeToken } from "../../../Context/localStorage";
export default function ClassesTable({
  classInfo,
  deleteClass,
  getEditClassId,
}) {
  const [showSections, setShowsections] = useState(true);
  const type = getTypeToken();

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Class</th>
            <th scope="col">SECTION</th>
            <th scope="col">SUBJECTS</th>
            {type === "admin" ? <th scope="col">ACTIONS</th> : ""}
          </tr>
        </thead>
        <tbody>
          {classInfo?.map((item, idx) => {
            return (
              <tr key={idx}>
                <th scope="row" className="text-secondary fs-6">
                  {idx + 1}
                </th>
                <td>Class {item.name} </td>
                <td>
                  <Link
                    to={`class_${item.name}`}
                    state={item._id}
                    className=" btn btn btn-outline-primary "
                  >
                    <AiOutlineEye />
                  </Link>
                  <span className="p-3">
                    Total Sections : <b>{item.noOfSec}</b>
                  </span>
                </td>
                <td>
                  <Link
                    to={"/subject"}
                    state={item._id}
                    className=" btn btn btn-outline-primary "
                  >
                    <IoBook />
                  </Link>
                </td>
                {type === "admin" ? (
                  <th
                    className="btn-group"
                    role="group"
                    aria-label="Basic outlined example"
                  >
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      data-bs-toggle="modal"
                      data-bs-target="#editClass"
                      onClick={() => {
                        getEditClassId(item);
                      }}
                    >
                      <AiFillEdit />
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary deleterow"
                      onClick={() => deleteClass(item)}
                    >
                      <AiFillDelete className="text-danger" />
                    </button>
                  </th>
                ) : (
                  ""
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
