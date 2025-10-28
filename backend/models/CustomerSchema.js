let mongoose = require("mongoose");

let customerSchema = mongoose.Schema({
  name: String,
  contactPerson: String,
  mobile: Number,
  email: String,
  address: String,
});

let Customer = mongoose.model("customer", customerSchema);

module.exports = Customer;
