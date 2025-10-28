const express = require("express");
const router = express.Router();

const ComplaintReview = require("../models/ComplaintReviewSchema");
const Complaint = require("../models/ComplaintSchema");

router.post("/", async (req, res) => {
  try {
    const data = req.body;

    const createReview = await ComplaintReview.create(data);
    await Complaint.findByIdAndUpdate(data.complaint_id, {
      status: data.status,
    });
    res.json({ status: "success", data: createReview });
  } catch (error) {
    res.json({ status: "error", data: error });
  }
});

router.get("/", async (req, res) => {
  const allReview = await ComplaintReview.find()
    .populate("employee_id")
    .populate("complaint_id");

  res.json({ status: "success", data: allReview });
});

router.get("/complaint/:complaintId", async (req, res) => {
  const { complaintId } = req.params;
  const review = await ComplaintReview.find({ complaint_id: complaintId })
    .populate("employee_id")
    .populate("complaint_id");

  res.json({ status: "success", data: review });
});

router.get("/:id", async (req, res) => {
  const reviewId = req.params.id;
  const review = await ComplaintReview.findById(reviewId)
    .populate("employee_id")
    .populate("complaint_id");

  res.json({ status: "success", data: review });
});

// router.delete("/:id", async (req, res) => {
//   const reviewId = req.params.id;
//   const review = await ComplaintReview.findById(reviewId);
//   if (!review)
//     return res.json({ status: "error", message: "Review not Found" });

//   await ComplaintReview.findByIdAndDelete(reviewId);

//   await Complaint.findByIdAndUpdate(review.complaint_id, { status: "Panding" });

//   res.json({
//     status: "success",
//     message: "Review deleted and complaint status reset",
//   });
// });

module.exports = router;
