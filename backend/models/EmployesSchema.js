let mongoose = require("mongoose");

let employeSchema = mongoose.Schema({
  name: String,
  gender: String,
  email: String,
  password: String,
  mobile: Number,
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "role",
  },
  address: String,
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active", // 👈 optional
  },
});

let Employe = mongoose.model("employe", employeSchema);

module.exports = Employe;
