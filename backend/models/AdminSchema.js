const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  mobile: String,
  role: String,
  status: String,
});

const Admin = mongoose.model("admin", AdminSchema);

module.exports = Admin;
