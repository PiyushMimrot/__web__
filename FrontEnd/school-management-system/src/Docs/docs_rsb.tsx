import React from "react"

import { useEffect, useState } from "react";


export function DocsRSB() {
  const [tips, setTips] = useState({});
  const [facts, setFacts] = useState({});
          

  
  return (
    <div style={{ userSelect: "none", width:'260px'}}>
      <div className="d-flex flex-column">
        <div className="planned_task client_task">
          <div className="dd" data-plugin="nestable">
            <div className="dd-handle">
              <div className="task-info d-flex align-items-center justify-content-between">
                <div className="task-priority d-flex flex-column align-items-center justify-content-center">
                  <div className="avatar-list avatar-list-stacked m-0">
                    <img
                      style={{ maxWidth: "20%", height: "auto" }}
                    //   src={tips}
                      alt=""
                    />
                  </div>
                </div>
              </div>
              {/* <b>{tips?.fact}</b> */}
              <p className="py-2 mb-0">{'wediwei'}</p>
              <div className="tikit-info row g-3 align-items-center">
                <div className="col-sm text-end">
                  <div className="small text-truncate light-danger-bg py-1 px-2 rounded-1 d-inline-block fw-bold small">
                    {" "}
                    Tip of the Day{" "}
                  </div>
                </div>
              </div>
            </div>

            <div className="dd-handle">
              <div className="task-info d-flex align-items-center justify-content-between">
                <div className="task-priority d-flex flex-column align-items-center justify-content-center">
                  <div className="avatar-list avatar-list-stacked m-0">
                    <img
                      style={{ maxWidth: "20%", height: "auto" }}
                    //   src={fact}
                      alt=""
                    />
                  </div>
                </div>
              </div>
              {/* <b>{facts.fact}</b> */}
              <p className="py-2 mb-0">
                {/* {facts?.explanation} */}
              </p>
              <div className="tikit-info row g-3 align-items-center">
                <div className="col-sm"></div>
                <div className="col-sm text-end">
                  <div className="small text-truncate light-danger-bg py-1 px-2 rounded-1 d-inline-block fw-bold small">
                    It's a Fact !
                  </div>
                </div>
              </div>
            </div>

            <div className="dd-handle">
              <div className="task-info d-flex align-items-center justify-content-between">
                <div className="task-priority d-flex flex-column align-items-center justify-content-center">
                  <div className="avatar-list avatar-list-stacked m-0">
                    <img
                      style={{ maxWidth: "20%", height: "auto" }}
                    //   src={comp}
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <p className="py-2 mb-0">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In id
                nec scelerisque massa.
              </p>
              <div className="tikit-info row g-3 align-items-center">
                <div className="col-sm"></div>
                <div className="col-sm text-end">
                  <div className="small text-truncate light-danger-bg py-1 px-2 rounded-1 d-inline-block fw-bold small">
                    {" "}
                    Just For You{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}