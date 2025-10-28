let mongoose = require("mongoose");

let complaintSchema = mongoose.Schema({
  title: String,
  date_time: String,
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employe",
  },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
  },
  status: String,
  description: String,
});

let Complaint = mongoose.model("complaint", complaintSchema);

module.exports = Complaint;
