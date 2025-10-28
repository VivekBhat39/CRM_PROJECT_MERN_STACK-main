const express = require("express");
const router = express.Router();

const Employe = require("../models/EmployesSchema");

// -----------login-----------
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // console.log(email, password);

    const emp = await Employe.findOne({ email, password }); //roll id

    // console.log("emp :", emp);

    if (!emp) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid email or password" });
    }

    if (emp.status !== "active") {
      return res.status(403).json({
        status: "error",
        message: "Employee account is inactive",
      });
    }
    res.json({
      status: "success",
      message: "Login Successful",
      data: {
        _id: emp._id,
        name: emp.name,
        email: emp.email,
        password: emp.password, //add other filed to show in ui
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Server error", error: error });
  }
});

// ------------create employee --------------

router.post("/", async (req, res) => {
  const data = req.body;

  const createEmploye = await Employe.create(data);
  res.json({ status: "success", data: createEmploye });
});

router.get("/", async (req, res) => {
  let allEmploye = await Employe.find().populate("role_id");
  res.json({ status: "success", data: allEmploye });
});

router.get("/:id", async (req, res) => {
  let empId = req.params.id;
  let singleEmploye = await Employe.findById(empId);
  res.json({ status: "success", data: singleEmploye });
});
router.delete("/:id", async (req, res) => {
  let empId = req.params.id;
  let deleteData = await Employe.findByIdAndDelete(empId);
  res.json({ status: "success", data: deleteData });
});

router.put("/:id", async (req, res) => {
  try {
    let empId = req.params.id;
    let data = req.body;
    let updatedEmploye = await Employe.findByIdAndUpdate(empId, data, {
      new: true,
    });
    res.json({ status: "success", data: updatedEmploye });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
