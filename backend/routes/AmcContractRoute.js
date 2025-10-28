const express = require("express");
const router = express.Router();

const AmcContract = require("../models/AmcContractsSchema");
const AmcContractsDetails = require("../models/AmcContractsDetailsSchema");

router.post("/", async (req, res) => {
  try {
    // console.log(req.body);

    const { details, ...amcData } = req.body;

    const amcContract = new AmcContract({
      ...amcData,
    });

    // console.log(amcContract);

    const savedAmcContract = await amcContract.save();

    const detailsRecords = details.map((item, index) => ({
      ...item,
      amcid: savedAmcContract._id,
      srno: index + 1,
    }));

    await AmcContractsDetails.insertMany(detailsRecords);

    res.status(201).json({
      success: true,
      message: "AMC created successfully",
    });
  } catch (error) {
    console.log("Ther error is ", error);

    res.status(500).json({
      success: false,
      message: "Error saving quotation",
      data: error,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 10;
    let skip = (page - 1) * limit;

    const totalCount = await AmcContract.countDocuments();

    const Amscontracts = await AmcContract.find()
      .populate("customerid")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      status: "success",
      data: Amscontracts,
      totalCount: totalCount,
    });
  } catch (error) {
    res.json({ status: "Error", data: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const amccontract = await AmcContract.findById(id).populate("customerid");
    const details = await AmcContractsDetails.find({ amcid: id });

    res.json({ amccontract, details });
  } catch (error) {
    res.json({ status: "Error", data: error });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { details, ...amcData } = req.body;

    await AmcContract.findByIdAndUpdate(id, amcData);

    await AmcContractsDetails.deleteMany({ amcid: id });

    const newDetails = details.map((item, index) => ({
      ...item,
      amcid: id,
      srno: index + 1,
    }));

    await AmcContractsDetails.insertMany(newDetails);

    res.json({ status: "success", data: AmcContract });
  } catch (error) {
    res.json({ status: "Error", data: error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await AmcContract.findByIdAndDelete(id);
    await AmcContractsDetails.deleteMany({ amcid: id });

    res.status({ status: "success", data: AmcContract });
  } catch (error) {
    res.json({ status: "Error", data: error });
  }
});

module.exports = router;
