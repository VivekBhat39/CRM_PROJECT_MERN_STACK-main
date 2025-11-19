import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    console.log(email, password);

    try {
      const res = await axios.post(
        import.meta.env.VITE_BASE_URL + "/employe/login",
        {
          email,
          password,
        }
      );

      console.log("login response :", res.data);

      if (res.data.status === "success") {
        navigate("/");
        // localStorage.setItem("id", res.data.data._id);
        localStorage.setItem("email", res.data.data.email);
        // localStorage.setItem("password", res.data.data.password);
        // localStorage.setItem("name", res.data.data.name);
        localStorage.setItem("role", res.data.data.role);
        // console.log("show dashboard");

      } else {
        setError("Incorrect email or Password");
        setTimeout(() => setError(""), 2000); //Hide after 2 second
      }
    } catch (err) {
      setError(err.response?.data.message || "Login failed");
      setTimeout(() => setError(""), 2000);
    }
  };

  return (
    <>
      <div class="container">
        <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div class="container">
            <div class="row justify-content-center">
              <div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div class="d-flex justify-content-center py-4">
                  <a
                    href="index.html"
                    class="logo d-flex align-items-center w-auto"
                  >
                    <img
                      src="/viprasLog.png"
                      alt="Vipras Logo"
                      style={{width:"50px"}}
                      className="me-2"
                    />
                  </a>
                </div>
                {/* <!-- End Logo --> */}

                <div class="card mb-3">
                  <div class="card-body">
                    <div class="pt-4 pb-2">
                      <h5 class="card-title text-center pb-0 fs-4">
                        Login to Your Account
                      </h5>
                      {error && (
                        <div className="alert alert-danger">{error} </div>
                      )}
                      <p class="text-center small">
                        Enter your email & password to login
                      </p>
                    </div>

                    <form
                      onSubmit={login}
                      class="row g-3 needs-validation"
                      novalidate
                    >
                      <div class="col-12">
                        <label for="yourUsername" class="form-label">
                          Email
                        </label>
                        <div class="input-group has-validation">
                          <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            name="email"
                            class="form-control"
                            id="email"
                            required
                          />
                          <div class="invalid-feedback">
                            Please enter your email.
                          </div>
                        </div>
                      </div>

                      <div class="col-12">
                        <label for="yourPassword" class="form-label">
                          Password
                        </label>
                        <input
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          type="password"
                          name="password"
                          class="form-control"
                          id="password"
                          required
                        />
                        <div class="invalid-feedback">
                          Please enter your password!
                        </div>
                      </div>

                      <div class="col-12"></div>
                      <div class="col-12">
                        <button class="btn btn-primary w-100" type="submit">
                          Login
                        </button>
                      </div>
                      <div class="col-12">
                        <p class="small mb-0">
                          Don't have account?{" "}
                          <Link to={"/register"} href="pages-register.html">Create an account</Link>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>

                <div class="credits">
                  {/* <!-- All the links in the footer should remain intact. --> */}
                  {/* <!-- You can delete the links only if you purchased the pro version. --> */}
                  {/* <!-- Licensing information: https://bootstrapmade.com/license/ --> */}
                  {/* <!-- Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/ --> */}
                  Designed by{" "}
                  <a href="https://bootstrapmade.com/">BootstrapMade</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Login;
