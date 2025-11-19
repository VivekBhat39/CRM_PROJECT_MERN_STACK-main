import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import EmployeeDashboard from "../employee/EmployeeDashboard";

function Landing({ role }) {
  return (
    <>
      {
        role === "admin"
          ?
          <div>
            <Header />
            <div className="container-fluid" style={{ paddingTop: "70px" }}>
              <div className="row">
                <div className="col-lg-3">
                  <Sidebar />
                  <div
                    className="sidebar-overlay"
                    onClick={() => document.body.classList.remove("sidebar-visible")}
                  ></div>
                </div>
                <div className="col-lg-9 ">
                  <div className="me-5">
                    <Outlet />
                  </div>
                </div>
              </div>
            </div>
            <Footer />
          </div>

          :

          <div className="div">
            <Header />
            <EmployeeDashboard />
            <Footer />
          </div>
      }

    </>
  );
}

export default Landing;
