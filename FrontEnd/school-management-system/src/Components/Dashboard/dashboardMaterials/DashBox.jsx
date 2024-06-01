import React from "react";

const SmallBox = ({ data }) => {
  return (
    <div
      className="row d-flex align-items-center shadow-sm rounded text-white bg-primary"
      style={{ height: 100, width: 200 }}
    >
      <div className="col-5 d-flex justify-content-end">{data.icon}</div>

      <div className="col-7 d-flex justify-content-start pt-2">
        <div className="d-flex flex-column ">
          <p className="mb-0" style={{ fontSize: 10 }}>
            {data.title}
          </p>
          {data.total > 0 ? (
            <p style={{ fontSize: 24 }}>
              <i
                style={{
                  color:
                    ((data?.completed ? data.completed : 0) / data.total) *
                      100 >=
                    50
                      ? "green"
                      : "red",
                }}
              >
                {data?.completed ? data.completed : 0}
              </i>
              /<i>{data?.total ? data.total : 0}</i>
            </p>
          ) : (
            <p>No data</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmallBox;
