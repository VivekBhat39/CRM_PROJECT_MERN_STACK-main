let express = require("express");

let router = express.Router();

const Role = require("../models/RoleSchema");

router.post("/", async (req, res) => {
  const data = req.body;

  const roleData = await Role.create(data);

  res.json({ status: "succes", data: roleData });
});

router.get("/", async (req, res) => {
  const roleData = await Role.find();
  res.json({ status: "success", data: roleData });
});

router.get("/:id", async (req, res) => {
  const roleId = req.params.id;

  const roleData = await Role.findById(roleId);
  res.json({ status: "success", data: roleData });
});

router.delete("/:id", async (req, res) => {
  const roleId = req.params.id;

  const deletedRole = await Role.findByIdAndDelete(roleId);
  res.json({ status: "success", data: deletedRole });
});

router.put("/:id", async (req, res) => {
  const roleId = req.params.id;
  const data = req.body;

  let updatedRole = await Role.findByIdAndUpdate(roleId, data, { new: true });
  res.json({ status: "success", data: updatedRole });
});

module.exports = router;
