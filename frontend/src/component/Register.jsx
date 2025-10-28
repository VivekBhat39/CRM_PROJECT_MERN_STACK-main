import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

function Register() {
  const nav = useNavigate();
  const [data, setData] = useState({
    name: "",
    gender: "",
    email: "",
    password: "",
    mobile: "",
    role_id: "",
    address: "",
  });

  //role id
  const [role, setRole] = useState([]);

  useEffect(() => {
    axios.get(import.meta.env.VITE_BASE_URL + "/role").then((res) => {
      //   console.log(res.data.data);
      setRole(res.data.data);
    });
  }, []);

  function handleChange(e) {
    setData({ ...data, [e.target.id]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post(import.meta.env.VITE_BASE_URL + "/employe", data)
      .then((res) => {
        console.log("Register successfully...", res.data.data);
        console.log(data);
        resetData();
        setTimeout(() => {
          nav("/login");
          toast.success("Register successfully...");
        }, 2000);
      })
      .catch((err) => {
        toast.error("Some Thing Wrong...");
      });
  }

  function resetData() {
    setData({
      name: "",
      gender: "",
      email: "",
      password: "",
      mobile: "",
      role_id: "",
      address: "",
    });
  }

  return (
    <>
      <main>
        <div class="container">
          <ToastContainer />
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
                        style={{ width: "50px" }}
                        className="me-2"
                      />
                    </a>
                  </div>
                  <div class="card mb-3">
                    <div class="card-body">
                      <div class="pt-4 pb-2">
                        <h5 class="card-title text-center pb-0 fs-4">
                          Create an Account
                        </h5>
                        <p class="text-center small">
                          Enter your personal details to create account
                        </p>
                      </div>

                      <form class="row g-3 needs-validation" novalidate>
                        <div class="col-12">
                          <label for="name" class="form-label">
                            Your Name
                          </label>
                          <input
                            type="text"
                            class="form-control"
                            id="name"
                            required
                            value={data.name}
                            onChange={handleChange}
                          />
                          <div class="invalid-feedback">
                            Please, enter your name!
                          </div>
                        </div>

                        <div class="col-12">
                          <label for="yourEmail" class="form-label">
                            Your Email
                          </label>
                          <input
                            onChange={handleChange}
                            value={data.email}
                            type="text"
                            class="form-control"
                            id="email"
                            required
                          />
                          <div class="invalid-feedback">
                            Please enter a valid Email adddress!
                          </div>
                        </div>

                        <div class="col-12">
                          <label for="yourUsername" class="form-label">
                            Gender
                          </label>
                          <select
                            id="gender"
                            className="form-control"
                            onChange={handleChange}
                            value={data.gender}
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Famale</option>
                          </select>
                        </div>

                        <div class="col-12">
                          <label for="yourPassword" class="form-label">
                            Password
                          </label>
                          <input
                            onChange={handleChange}
                            value={data.password}
                            type="password"
                            class="form-control"
                            id="password"
                            required
                          />
                          <div class="invalid-feedback">
                            Please enter your password!
                          </div>
                        </div>
                        <div class="col-12">
                          <label for="yourPassword" class="form-label">
                            Mobile
                          </label>
                          <input
                            onChange={handleChange}
                            value={data.mobile}
                            type="Number"
                            class="form-control"
                            id="mobile"
                            required
                          />
                        </div>
                        <div class="col-12">
                          <label for="yourPassword" class="form-label">
                            Role
                          </label>
                          <select
                            onChange={handleChange}
                            name=""
                            id="role_id"
                            className="form-control"
                            value={data.role_id}
                          >
                            <option value="">Choose role...</option>
                            {role.map((item, i) => (
                              <option key={i} value={item._id}>
                                {item.role}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div class="col-12">
                          <label for="yourPassword" class="form-label">
                            Address
                          </label>
                          <textarea
                            onChange={handleChange}
                            value={data.address}
                            type="text"
                            class="form-control"
                            id="address"
                            required
                          />
                          <div class="invalid-feedback">
                            Please enter your password!
                          </div>
                        </div>

                        <div class="col-12">
                          <button
                            class="btn btn-primary w-100"
                            type="submit"
                            onClick={handleSubmit}
                          >
                            Create Account
                          </button>
                        </div>
                        <div class="col-12">
                          <p class="small mb-0">
                            Already have an account?{" "}
                            <Link to={"/login"} href="pages-login.html">Log in</Link>
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default Register;
