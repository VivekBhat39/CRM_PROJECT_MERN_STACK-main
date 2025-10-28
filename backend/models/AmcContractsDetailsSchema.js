let mongoose = require("mongoose");

let amcContractsDetailsSchema = mongoose.Schema(
  {
    amcid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "amcContracts",
      required: true,
    },
    srno: Number,
    product: String,
    description: String,
    charge: Number,

    subtotal: Number,
    discount: Number,
    total: Number,
    gst: Number,
    billamount: Number,
  },
  {
    timestamps: true,
  }
);

AmcContractsDetails = mongoose.model(
  "amcContractsDetails",
  amcContractsDetailsSchema
);

module.exports = AmcContractsDetails;
