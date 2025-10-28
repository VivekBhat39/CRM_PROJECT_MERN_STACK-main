const express = require("express");
const router = express.Router();

const Quotation = require("../models/QuotationsSchema");
const QuotationDetails = require("../models/QuotationdetailsSchema");
// const getNextQuotationNumber = require("../utils/GetNextQuotationNumber");

router.post("/", async (req, res) => {
  try {
    console.log(req.body); 

    const { details, ...quotationData } = req.body;

    // const qno = await getNextQuotationNumber();

    const quotation = new Quotation({ ...quotationData });

    //save masterdata to mongodb
    const savedQuotation = await quotation.save();

    const detailRecords = details.map((item, index) => ({
      ...item,
      qid: savedQuotation._id,
      srno: index + 1,
    }));

    await QuotationDetails.insertMany(detailRecords);

    res
      .status(201)
      .json({ success: true, message: "Quotation Created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error saving quotation" });
  }
});

router.get("/", async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let skip = (page - 1) * limit;

    const totalCount = await Quotation.countDocuments();

    const Quotations = await Quotation.find()
      .populate("customerid")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      status: "success",
      data: Quotations,
      totalCount: totalCount,
    });
  } catch (error) {
    res.json({ status: "Error", data: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const quotation = await Quotation.findById(id).populate("customerid");
    const details = await QuotationDetails.find({ qid: id });
    res.json({ quotation, details });
  } catch (error) {
    res.json({ status: "Error", data: error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { details, ...quotationData } = req.body;

    //master update
    await Quotation.findByIdAndUpdate(id, quotationData);

    //old details delete
    await QuotationDetails.deleteMany({ qid: id });

    //New data insert

    const newDetails = details.map((item, index) => ({
      ...item,
      qid: id,
      srno: index + 1,
    }));

    await QuotationDetails.insertMany(newDetails);

    res.json({ status: "success", data: Quotation });
  } catch (error) {
    res.json({ status: "Error", data: error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await Quotation.findByIdAndDelete(id);
    await QuotationDetails.deleteMany({ qid: id });

    res.status({ status: "success", data: Quotation });
  } catch (error) {
    res.json({ status: "Error", data: error });
  }
});

module.exports = router;
