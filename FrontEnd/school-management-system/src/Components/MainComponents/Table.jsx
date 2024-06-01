import React from "react";
import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";
import { getTypeToken } from "../../Context/localStorage";

export default function Table({
  titleRowData,
  mainData,
  selector,
  otherComponent,
  handleDelete,
  onEdit,
}) {
  const type = getTypeToken();
  return (
    <>
      <div className="row clearfix g-3">
        <div className="col-sm-12">
          <div className="card mb-3">
            <div className="card-body">
              <table
                id="myProjectTable"
                className="table table-hover align-middle mb-0"
                style={{ width: "100%" }}
              >
                <thead>
                  <tr>
                    {titleRowData.map((data, index) => {
                      return (
                        <React.Fragment key={index}>
                          <th key={index}>{data}</th>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {mainData?.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        {selector?.map((selector, idx) => {
                          const fieldValue = selector
                            .split(".")
                            .reduce((obj, key) => obj?.[key], data);

                          return (
                            <>
                              <td key={fieldValue}>{fieldValue}</td>
                            </>
                          );
                        })}
                        {type === "admin" && (
                          <td>
                            <div
                              className="btn-group"
                              role="group"
                              aria-label="Basic outlined example"
                            >
                              <button
                                type="button"
                                className="btn btn-outline-secondary"
                                data-bs-toggle="modal"
                                data-bs-target="#edittickit"
                                onClick={() => onEdit && onEdit(index)}
                              >
                                <AiFillEdit />
                              </button>
                              <button
                                type="button"
                                className="btn btn-outline-secondary deleterow"
                                onClick={() => handleDelete(data._id)}
                              >
                                <AiFillDelete className="text-danger" />
                              </button>
                            </div>
                          </td>
                        )}
                        {otherComponent?.map((Component, index) => {
                          return (
                            <React.Fragment key={index}>
                              <td>
                                <Component data={data} />
                              </td>
                            </React.Fragment>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
