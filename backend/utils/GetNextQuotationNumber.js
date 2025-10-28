import Counter from "../models/Counter";

const getNextQuotationNumber = async () => {
  const result = await Counter.findOneAndUpdate(
    { _id: "quotationid" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `QTN-${result.seq}`;
};

module.exports = getNextQuotationNumber;
