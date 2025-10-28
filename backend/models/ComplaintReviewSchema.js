let mongoose = require("mongoose");

let complaintReviewSchema = mongoose.Schema({
  date_time: String,
  complaint_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "complaint",
  },
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "employe",
  },
  review: String,
  status: String,
});

const ComplaintReview = mongoose.model(
  "complaint_review",
  complaintReviewSchema
);

module.exports = ComplaintReview;
