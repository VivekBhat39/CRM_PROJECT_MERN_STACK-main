const express = require("express");
const router = express.Router();

const Employe = require("../models/EmployesSchema");
const Customer = require("../models/CustomerSchema");
const Complanint = require("../models/ComplaintSchema");
const Quotation = require("../models/QuotationsSchema");
const Amc = require("../models/AmcContractsSchema");

router.get("/total-employees", async (req, res) => {
  try {
    const count = await Employe.countDocuments();
    res.json({ status: "success", data: count });
  } catch (error) {
    console.log(error);
  }
});

router.get("/total-customer", async (req, res) => {
  try {
    const count = await Customer.countDocuments();
    res.json({ status: "success", data: count });
  } catch (error) {
    console.log(error);
  }
});

router.get("/complaint-summary", async (req, res) => {
  try {
    const total = await Complanint.countDocuments();
    const statusCount = await Complanint.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    const statusSummary = {};
    statusCount.forEach((item) => {
      statusSummary[item._id] = item.count;
    });
    res.json({ status: "success", total, statusSummary });
  } catch (error) {
    console.error("Error:", error);
  }
});

router.get("/complaints-by-date", async (req, res) => {
  try {
    const data = await Complanint.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $toDate: "$date_time" },
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    res.json({ success: true, data });
  } catch (error) {
    console.log(error);
  }
});

router.get("/complaint-datewise", async (req, res) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0, 23, 59, 59);

    const result = await Complanint.aggregate([
      {
        $match: {
          cdate: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: { $toDate: "$date_time" },
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/top-customers", async (req, res) => {
  try {
    const topCustomers = await Complanint.aggregate([
      {
        $group: {
          _id: "$customer_id",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "customers", // 👈 correct MongoDB collection name
          localField: "_id",
          foreignField: "_id",
          as: "customerDetails",
        },
      },
      {
        $unwind: "$customerDetails",
      },
      {
        $project: {
          _id: 0,
          name: "$customerDetails.name",
          count: 1,
        },
      },
    ]);

    res.json({ status: "success", data: topCustomers });
  } catch (error) {
    console.error("Top customers error:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

router.get("/quotation-total", async (req, res) => {
  try {
    const count = await Quotation.countDocuments();
    res.json({ status: "success", data: count });
  } catch (error) {
    console.log(error);
  }
});
// routes/dashboard.js ya jo bhi aapka dashboard route file hai
router.get("/top-quotations", async (req, res) => {
  try {
    const quotations = await Quotation.aggregate([
      {
        $lookup: {
          from: "customers",
          localField: "customerid",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },
      { $sort: { qdate: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          qno: 1,
          customername: "$customer.name",
          qdate: 1,
          total: 1,
        },
      },
    ]);
    res.json({ status: "success", data: quotations });
  } catch (error) {
    console.error("Top quotation fetch error:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

router.get("/amc-total", async (req, res) => {
  try {
    const count = await Amc.countDocuments();
    res.json({ status: "success", data: count });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
