const express = require("express");
const router = express.Router();

const Complaint = require("../models/ComplaintSchema");
const ComplaintReview = require("../models/ComplaintReviewSchema"); //form review count

const mongoose = require("mongoose");

router.post("/", async (req, res) => {
  const data = req.body;
  console.log(data);

  const createComplaint = await Complaint.create(data);
  res.json({ status: "success", data: createComplaint });
});

// router.get("/", async (req, res) => {
//   const allComplaint = await Complaint.find()
//     .populate("employee_id")
//     .populate("customer_id");
//   res.json({ status: "succes", data: allComplaint });
// });

router.get("/", async (req, res) => {
  try {
    let query = {};

    //for pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    //serching

    const { employee_id, customer_id, statuses, from_date, to_date } =
      req.query;

    let matchQuery = {};

    // console.log("Received query params:", req.query);

    if (employee_id && mongoose.Types.ObjectId.isValid(employee_id)) {
      matchQuery.employee_id = new mongoose.Types.ObjectId(employee_id);
    }
    if (customer_id && mongoose.Types.ObjectId.isValid(customer_id)) {
      matchQuery.customer_id = new mongoose.Types.ObjectId(customer_id);
    }
    if (statuses && statuses.trim() != "") {
      const statusArray = statuses.split(",").map((s) => s.trim());
      matchQuery.status = { $in: statusArray };
    }

    if (from_date && to_date) {
      matchQuery.date_time = {
        $gte: from_date, //$gte : Greter than equle to
        $lte: to_date, //$lte :less than equle to
      };
    }

    const allComplaint = await Complaint.aggregate([
      { $match: matchQuery },

      //join employee
      {
        $lookup: {
          from: "employes", //collection  name(not model name)
          localField: "employee_id",
          foreignField: "_id",
          as: "employee",
        },
      },
      { $unwind: "$employee" }, //its give an array to convert in object

      //join customer
      {
        $lookup: {
          from: "customers",
          localField: "customer_id",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },

      //join complint_reviews and count them
      {
        $lookup: {
          from: "complaint_reviews",
          localField: "_id",
          foreignField: "complaint_id",
          as: "reviews",
        },
      },
      {
        $addFields: {
          review_count: { $size: "$reviews" },
        },
      },
      //for pagination
      { $skip: skip },
      { $limit: limit },
    ]);

    //Total count for pagination

    const totalCount = await Complaint.countDocuments(matchQuery);

    //Adjust format to match frontend expectation

    const formatted = allComplaint.map((item) => ({
      ...item,
      employee_id: item.employee,
      customer_id: item.customer,
    }));

    // console.log("Built Mongo query:", query);

    //complaint find on the bases of query
      
    // const allComplaint = await Complaint.find(query) 
    //   .populate("employee_id")
    //   .populate("customer_id")
    //   .skip(skip)
    //   .limit(limit);

    res.json({ status: "success", data: formatted, totalCount });
  } catch (error) {
    res.json({ status: "Error", data: error });
  }
});

router.get("/:id", async (req, res) => {
  let compId = req.params.id;
  const findComplaint = await Complaint.findById(compId)
    .populate("employee_id")
    .populate("customer_id");
  res.json({ status: "success", data: findComplaint });
});

router.delete("/:id", async (req, res) => {
  let compId = req.params.id;
  const deleteComplaint = await Complaint.findByIdAndDelete(compId);
  res.json({ status: "success", data: deleteComplaint });
});

router.put("/:id", async (req, res) => {
  let compId = req.params.id;
  let data = req.body;
  const updateComplaint = await Complaint.findByIdAndUpdate(compId, data, {
    new: true,
  });
  res.json({ status: "success", data: updateComplaint });
});

module.exports = router;
