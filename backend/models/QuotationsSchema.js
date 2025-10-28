let mongoose = require("mongoose");

let quotationsSchema = mongoose.Schema(
  {
    qno: { type: String, required: true },
    qdate: { type: String, required: true },
    customerid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
    },

    terms: { type: String },
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    billamount: { type: Number, default: 0 },
  },
  {
    timestamps: true, //auto add createdAt, updatedAt
  }
);

Quotation = mongoose.model("quotations", quotationsSchema);
module.exports = Quotation;
