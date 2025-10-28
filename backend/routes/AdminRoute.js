const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const Admin = require("../models/AdminSchema");

//  LOGIN ROUTE (Keep this at the top)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    let admin;

    //  Check if username is actually MongoDB ID
    if (mongoose.Types.ObjectId.isValid(username)) {
      admin = await Admin.findOne({ _id: username, password });
    } else {
      admin = await Admin.findOne({ username, password });
    }

    //  Check admin found or not
    if (!admin) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid username or password" });
    }

    //  Check if status is active
    if (admin.status !== "active") {
      return res
        .status(403)
        .json({ status: "error", message: "Admin account is inactive" });
    }

    //  Return login response
    res.json({
      status: "success",
      message: "Login successful",
      data: {
        adminid: admin._id,
        name: admin.name,
        role: admin.role,
        username: admin.username,
        password: admin.password,
        mobile: admin.mobile,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
});

//  GET all admins
router.get("/", async (req, res) => {
  try {
    let result = await Admin.find();
    res.json({ status: "success", data: result });
  } catch (err) {
    res.json({ status: "error", data: err });
  }
});

//  CREATE new admin
router.post("/:id", async (req, res) => {
  try {
    const data = req.body;

    let existingAdmin = await Admin.findOne({
      $or: [{ username: data.username }, { mobile: data.mobile }],
    });

    if (existingAdmin) {
      return res.status(400).json({
        status: "error",
        data: "Admin with this username or mobile already exists.",
      });
    }

    let object = await Admin.create(data);
    res.json({ status: "success", data: object });
  } catch (err) {
    res.json({ status: "error", data: err });
  }
});

//  UPDATE admin
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    let object = await Admin.findByIdAndUpdate(id, data, { new: true });
    res.send({ status: "success", data: object });
  } catch (err) {
    res.send({ status: "error", data: err });
  }
});

//  DELETE admin
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const object = await Admin.findByIdAndDelete(id);
    res.send({ status: "success", data: object });
  } catch (err) {
    res.send({ status: "error", data: err });
  }
});

module.exports = router;
