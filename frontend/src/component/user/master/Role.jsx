import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Role() {
  const [role, setRole] = useState({
    role: "",
  });

  const [newrole, setNewrole] = useState([]);
  function handleChange(e) {
    setRole({ ...role, [e.target.name]: e.target.value });
    // console.log(role);
  }

  const [id, setId] = useState(undefined);

  function handleSubmit(e) {
    e.preventDefault();
    // console.log(role);

    if (id == undefined) {
      axios.post(import.meta.env.VITE_BASE_URL + "/role", role).then((res) => {
        // console.log(res.data);
        loadData();
      });

      setRole({
        role: "",
      });
    } else {
      axios
        .put(import.meta.env.VITE_BASE_URL + "/role/" + id, role)
        .then((res) => {
          // console.log(res.data);
          loadData();
          setId(undefined);
        });
      setRole({
        role: "",
      });
    }
  }

  function loadData() {
    axios.get(import.meta.env.VITE_BASE_URL + "/role").then((res) => {
      // console.log(res.data);
      setNewrole(res.data.data);
    });
  }

  useEffect(() => {
    loadData();
  }, []);

  // console.log(newrole);

  function handleRoleDelete(id) {
    const confirm = window.confirm(
      "Are you sure you want to delete this complaint?"
    );
    if (confirm) {
      axios
        .delete(import.meta.env.VITE_BASE_URL + "/role/" + id)
        .then((res) => {
          // console.log(res.data);
          loadData();
        });
    }
  }

  function handleRoleEdit(id) {
    setId(id);

    axios.get(import.meta.env.VITE_BASE_URL + "/role/" + id).then((res) => {
      // console.log(res.data.data);
      const { role } = res.data.data;

      setRole({
        role,
      });
    });
  }

  return (
    <>
      <div class="pagetitle mt-3">
        <h1>Add Role</h1>
        <nav>
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <Link to={"/"}>Home</Link>
            </li>

            <li class="breadcrumb-item active">Roles</li>
          </ol>
        </nav>
      </div>

      <div class="card">
        <div class="card-body mt-5">
          {/* <!-- Multi Columns Form --> */}
          <form class="row g-3">
            <div className="col-md-3"></div>
            <div class="col-md-6">
              <label for="inputName5" class="form-label fw-bold ">
                Add Role <span className="text-danger">*</span>
              </label>
              <input
                value={role.role}
                onChange={handleChange}
                type="text"
                class="form-control"
                id="inputName5"
                name="role"
              />
              <div className="text-center">
                <button
                  type="submit"
                  class="btn btn-primary mt-4 "
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
            <div className="col-md-3"></div>
          </form>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <table class="table table-bordered mt-5 text-center">
            <thead>
              <tr>
                <th scope="col" style={{ width: "10%" }}>
                  Sr. No.
                </th>
                <th scope="col">Roles</th>

                <th scope="col" style={{ width: "30%" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {newrole.map((eachData, i) => (
                <tr key={i}>
                  <th scope="row">{i + 1}</th>
                  <td>{eachData.role}</td>

                  <td>
                    <button
                      className="btn btn-primary me-5"
                      onClick={() => handleRoleEdit(eachData._id)}
                    >
                      <i class="fa-solid fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRoleDelete(eachData._id)}
                    >
                      <i class="fa-solid fa-minus"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Role;
