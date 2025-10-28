import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function Landing() {
  return (
    <>
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
    </>
  );
}

export default Landing;
