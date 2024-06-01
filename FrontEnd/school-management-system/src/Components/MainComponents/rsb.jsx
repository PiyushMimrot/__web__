import { useEffect, useState } from "react";
import Logo from "../../utils/Adds/Logo.png";
import fact from "../../utils/imgs/fact.png";
import { SERVER } from "../../config";

export default function RSB() {
  const [tips, setTips] = useState({});
  const [facts, setFacts] = useState({});

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await fetch(`${SERVER}/funfacts/gettips`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials:'include'
        });


        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTips(data);

        const factData = await fetch(`${SERVER}/funfacts/getfacts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials:'include'
        });


        if (!factData.ok) {
          throw new Error(`HTTP error! Status: ${factData.status}`);
        }
        const fact = await factData.json();
        setFacts(fact);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    fetchInfo();
  }, []);


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
                      src={tips}
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <b>{tips?.fact}</b>
              <p className="py-2 mb-0">{tips?.explanation}</p>
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
                      src={fact}
                      alt=""
                    />
                  </div>
                </div>
              </div>
              <b>{facts.fact}</b>
              <p className="py-2 mb-0">
                {facts?.explanation}
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
              
                <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // backgroundColor:'green',
          boxShadow:'0px 0px 1px  rgba(0,0,0,5)',
          height: "80px",
          marginTop: "20px",
        }}
      >
        <img
          draggable="false"
          src={Logo}
          alt="logo"
          style={{ width: "60px", marginRight: "20px" }}
        />
        <span
          className="logo-text"
          style={{  fontSize: 20, fontWeight: "bolder" }}
        >
          Instil
        </span>
      </div>
              
             
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}