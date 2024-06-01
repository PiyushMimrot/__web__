import Sidebar from "./Components/MainComponents/Sidebar/Sidebar";
import Navbar from "./Components/MainComponents/Navbar";
import RSB from "./Components/MainComponents/rsb";
import { useEffect, useState } from "react";
import { Instil } from "./routes";
import { Routes, Route, useLocation } from "react-router-dom";
import { PrivateRoute } from "./Components/PrivateRoute/PrivateRoute";
import "./style/app.css";
import { getListItemButtonUtilityClass } from "@mui/material";

const routesToExcludeRSB = [
  "/",
  "/supperLogin",
  "/home",
  "/digitallibrary",
  "/dashboard_mobile",
  "/docs",
  "/student/*",
];

function App() {
  const location = useLocation();
  const [rsbIsVisible, setRsbIsVisible] = useState(false);
  const [isLogin, setIsLogin] = useState();
  // const [isMobile, setIsmobile] = useState(
  // location.pathname === "/dashboard_mobile" ? true : false
  // );

  useEffect(() => {
    setIsLogin(
      location.pathname === "/" ||
        location.pathname === "/supperLogin" ||
        location.pathname === "/dashboard_mobile"
    );
    setRsbIsVisible(
      routesToExcludeRSB.includes(location.pathname) ? false : true
    );
  }, [location.pathname]);

  return (
    <div className="theme-indigo" style={{ width: "100vw", display: "flex" }}>
      <div
        style={{
          flexGrow: 1,
          padding: "0px 5px",
          height: "100vh",
          overflowY: "auto",
          scrollbarGutter: "stable",
        }}
      >
        {!isLogin && <Navbar />}
        <div
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "nowrap",
            ...(!isLogin && { height: "calc(100vh - 108px)" }),
            // height:"calc(100vh - 108px)"
          }}
        >
          <div>{!isLogin && <Sidebar />}</div>
          <div
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: "nowrap",
              ...(!isLogin && { maxHeight: "calc(100vh - 108px)" }),
              // maxHeight:"calc(100vh - 108px)",
              overflowY: "auto",
              scrollbarGutter: "stable",
            }}
           >
            <div style={rsbIsVisible ? { width: "calc(100% - 260px)" } : {}}>
              <InstilRoutes />
            </div>
            {rsbIsVisible && (
              <div
                style={{ width: "260px", marginLeft: "10px" }}
                className="noprint"
              >
                {<RSB />}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

const InstilRoutes = () => {
  return (
    <Routes>
      {Instil.routeConfigurations.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <PrivateRoute Access={route.Access}>
              <route.element />
            </PrivateRoute>
          }
        />
      ))}
    </Routes>
  );
};
