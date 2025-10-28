let express = require("express");
let router = express.Router();

let Customer = require("../models/CustomerSchema");

router.post("/", async (req, res) => {
  const data = req.body;
  const createCustomer = await Customer.create(data);
  res.json({ status: "success", data: createCustomer });
});

router.post("/bulk", async (req, res) => {
  try {
    const customer = req.body;
    if (!Array.isArray(customer) || customer.length == 0) {
      return res.status(400).json({ status: "error", message: "Invaild data" });
    }
    const result = await Customer.insertMany(customer);
    res.json({ status: "success", data: result });
  } catch (error) {
    console.log(error);
  }
});

router.get("/", async (req, res) => {
  const findCustomer = await Customer.find();
  res.json({ status: "success", data: findCustomer });
});

router.get("/:id", async (req, res) => {
  const custId = req.params.id;
  const singleCustomer = await Customer.findById(custId);
  res.json({ status: "success", data: singleCustomer });
});

router.delete("/:id", async (req, res) => {
  const custId = req.params.id;
  const deleteCustomer = await Customer.findByIdAndDelete(custId);

  res.json({ status: "success", data: deleteCustomer });
});

router.put("/:id", async (req, res) => {
  const custId = req.params.id;
  const customer = req.body;
  let updatedCustomer = await Customer.findByIdAndUpdate(custId, customer, {
    new: true,
  });

  res.json({ status: "success", data: updatedCustomer });
});

module.exports = router;
