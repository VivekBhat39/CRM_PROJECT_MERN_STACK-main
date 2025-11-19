import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isLogin = localStorage.getItem("email");
  const role = localStorage.getItem("role"); // admin / employee

  if (!isLogin) {
    return <Navigate to="/login" />;
  }

  // Pass role to children (Landing) using cloneElement
  return React.cloneElement(children, { role });
}

export default ProtectedRoute;



// import React from "react";
// import { Navigate } from "react-router-dom";

// function ProtectedRoute({ children }) {
//   const isLogin = localStorage.getItem("email");

//   return isLogin ? children : <Navigate to={"/login"} />;
// }

// export default ProtectedRoute;
