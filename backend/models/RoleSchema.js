let mongoose = require("mongoose");

let roleSchema = mongoose.Schema({
  role: String,
});

let Role = mongoose.model("role", roleSchema);

module.exports = Role;