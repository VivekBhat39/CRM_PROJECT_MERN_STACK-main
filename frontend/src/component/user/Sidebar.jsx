import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const logout = (e) => {
    e.preventDefault();
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/login");
    }
  };

  return (
    <>
      {/* <!-- ======= Sidebar ======= --> */}
      <aside id="sidebar" className="sidebar ">
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <Link to={"/"} className="nav-link ">
              <i className="bi bi-grid"></i>
              <span>Dashboard</span>
            </Link>
          </li>

          {/* <!-- End Dashboard Nav --> */}

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#components-nav"
              data-bs-toggle="collapse"
              href="#"
            >
              <i className="bi bi-menu-button-wide"></i>
              <span>Masters</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="components-nav"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link to={"/master/employes"}>
                  <i className="bi bi-circle"></i>
                  <span>Employees</span>
                </Link>
              </li>

              <li>
                <Link to={"/master/customer"} href="components-accordion.html">
                  <i className="bi bi-circle"></i>
                  <span>Customers</span>
                </Link>
              </li>

              <li>
                <Link to={"/master/role"} href="components-badges.html">
                  <i className="bi bi-circle"></i>
                  <span>Roles</span>
                </Link>
              </li>
            </ul>
          </li>

          {/* <!-- End Components Nav --> */}

          <li className="nav-item">
            <Link
              to={"/complaint"}
              className="nav-link collapsed"
              data-bs-target="#forms-nav"
              data-bs-toggle="collapse"
            >
              <i className="bi bi-journal-text"></i>
              <span>Complaint </span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </Link>
            <ul
              id="forms-nav"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link to={"/complaint/complaints"} href="forms-elements.html">
                  <i className="bi bi-circle"></i>
                  <span>Complaints</span>
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#tables-nav"
              data-bs-toggle="collapse"
            >
              <i className="bi bi-layout-text-window-reverse"></i>
              <span>Quotation</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="tables-nav"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link to={"/quotation/quotations"}>
                  <i className="bi bi-circle"></i>
                  <span>Quotations</span>
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#amc-nav"
              data-bs-toggle="collapse"
            >
              <i className="bi bi-layout-text-window-reverse"></i>
              <span>AMC</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="amc-nav"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link to={"/amc/amc_contracts"}>
                  <i className="bi bi-circle"></i>
                  <span>AMC Contracts</span>
                </Link>
              </li>
            </ul>
          </li>

          {/* Logout */}
          <li className="nav-item">
            <button
              className="nav-link btn btn-link text-start w-100"
              onClick={logout}
            >
              <i className="bi bi-box-arrow-right"></i>
              <span> Logout</span>
            </button>
          </li>

          {/* <!-- End Login Page Nav --> */}
        </ul>
      </aside>
      {/* <!-- End Sidebar--> */}
    </>
  );
}

export default Sidebar;
