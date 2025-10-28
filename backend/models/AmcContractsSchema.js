const mongoose = require("mongoose");

const amcContractsSchema = mongoose.Schema(
  {
    customerid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
    },
    ano: { type: String, required: true },
    amcdate: { type: String, required: true },
    fromDate: { type: String, required: true },
    term: String,
    toDate: String,
    subtotal: Number,
    discount: Number,
    total: Number,
    gst: Number,
    billamount: Number,
    terms: String,
  },
  {
    timestamps: true,
  }
);

AmcContract = mongoose.model("amcContracts", amcContractsSchema);

module.exports = AmcContract;
