import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("name");
    setUsername(name || "User");

    // Format today's date
    const today = new Date();
    const formatted = today.toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    setCurrentDate(formatted);
  }, []);

  const logout = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/login");
    }
  };

  const toggleSidebar = () => {
    document.body.classList.toggle("sidebar-visible");
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "🌅 Good Morning...";
    else if (hour < 17) return "☀️ Good Afternoon...";
    else return "🌇 Good Evening...";
  };

  return (
    <header className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm px-3">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Left: Logo and Sidebar */}
        <div className="d-flex align-items-center">
          <button className="btn me-3 d-lg-none" onClick={toggleSidebar}>
            <i className="bi bi-list fs-4"></i>
          </button>
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img
              src="/viprasLog.png"
              alt="Vipras Logo"
              height="32"
              className="me-2"
            />
            <span className="fw-bold text-primary">Vipras Technomart</span>
          </Link>
        </div>

        {/* Center: Page Title + Date */}
        <div className="text-center d-none d-md-block">
          <div className="fw-semibold">{greeting()}</div>
          <small className="text-muted">{currentDate}</small>
        </div>

        {/* Right: User + Logout */}
        <div className="d-flex align-items-center gap-3">
          {/* User */}
          <span className="fw-semibold d-none d-md-inline">Hi, {username}</span>

          {/* Logout */}
          <button onClick={logout} className="btn btn-outline-danger btn-sm">
            <i className="bi bi-box-arrow-right me-1"></i> Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
