let mongoose = require("mongoose");

let quotationdetailsSchema = mongoose.Schema(
  {
    qid: { type: mongoose.Schema.Types.ObjectId, ref: "quotations" },
    srno: { type: Number },

    product:{type:String},
    qty:{type:Number},
    rate:{type:Number},

    description: { type: String },
    subtotal: { type: Number },
    discount: { type: Number },
    total: { type: Number },
    gst: { type: Number },
    billamount: { type: Number },
  },
  {
    timestamps: true,
  }
);

QuotationDetails = mongoose.model("quotationDetails", quotationdetailsSchema);

module.exports = QuotationDetails;
