import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { data, Link, useNavigate, useParams } from "react-router-dom";

function Add_Amc() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState([]);
  useEffect(() => {
    axios.get(import.meta.env.VITE_BASE_URL + "/customer").then((res) => {
      setCustomer(res.data.data);
    });
  }, []);
  const [ano, setANo] = useState("");
  const [amcdate, setAmcDate] = useState("");
  const [customerid, setCustomerId] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [termYears, setTermYears] = useState(0);
  const [termMonths, setTermMonths] = useState(0);
  const [toDate, setTodate] = useState("");
  const [discount, setDiscount] = useState("");
  const gstRate = 18;
  const [terms, setTerms] = useState(
    "1. Payment to be made within 7 days.\n2. Warranty as per manufacturer.\n3. Goods once sold will not be taken back.\n4. Prices are exclusive of GST.\n5. Delivery in 5-7 working days."
  );

  const [showElert, setShowElert] = useState(false);

  let { id } = useParams();

  //auto update todate
  useEffect(() => {
    if (fromDate) {
      const start = new Date(fromDate);
      const Years = parseInt(termYears || 0);
      const months = parseInt(termMonths || 0);
      start.setFullYear(start.getFullYear() + Years);
      start.setMonth(start.getMonth() + months);
      const toISO = start.toISOString().split("T")[0];
      setTodate(toISO);
    }
  }, [fromDate, termMonths, termYears]);

  const [amcDetails, setAmcDetails] = useState([
    { product: "", description: "", charge: "" },
  ]);

  function addRow(e) {
    e.preventDefault();
    setAmcDetails([
      ...amcDetails,
      {
        product: "",
        description: "",
        charge: "",
      },
    ]);
  }

  const [summary, setSummary] = useState({
    subtotal: 0,
    total: 0,
    gst: 0,
    billamount: 0,
  });

  function handleChange(e, i, key) {
    // console.log(e);
    // console.log(i);
    // console.log(key);
    const updatedRows = [...amcDetails];

    updatedRows[i][key] = e.target.value;
    setAmcDetails(updatedRows);
  }

  useEffect(() => {
    const subtotal = amcDetails.reduce(
      (acc, i) => acc + Number(i.charge || 0),
      0
    );
    const total = subtotal - Number(discount || 0);
    const gst = (total * gstRate) / 100;
    const billamount = total + gst;

    setSummary({
      subtotal,
      total,
      gst,
      billamount,
    });
  }, [amcDetails, discount]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowElert(true);
    if (
      !ano ||
      !amcdate ||
      !customerid ||
      customerid === "Customer Name" ||
      !fromDate ||
      !termMonths ||
      !termYears
    ) {
      return;
    } else {
      //details array
      const DetailsPlayload = amcDetails.map((item, i) => ({
        srno: i + 1,
        product: item.product,
        description: item.description,
        charge: item.charge,
      }));

      const payload = {
        ano,
        amcdate,
        customerid,
        fromDate,
        toDate,
        term: `${termYears} Years ${termMonths} Months`,
        subtotal: summary.subtotal,
        discount: discount,
        total: summary.total,
        gst: summary.gst,
        billamount: summary.billamount,
        terms,
        details: DetailsPlayload,
      };

      console.log("Final Payload:", payload);

      if (id == undefined) {
        axios
          .post(import.meta.env.VITE_BASE_URL + "/amcContracts", payload)
          .then((res) => {
            console.log(res.data);
            resetData();
            navigate("/amc/amc_contracts");
          });
        setAmcDetails([
          {
            product: "",
            description: "",
            charge: "",
          },
        ]);
      } else {
        axios
          .put(import.meta.env.VITE_BASE_URL + "/amcContracts/" + id, payload)
          .then((res) => {
            console.log(res.data);
            resetData();
            navigate("/amc/amc_contracts");
          });
      }
    }
  }

  function resetData() {
    setANo("");
    setAmcDate("");
    setCustomerId("");
    setFromDate("");
    setTermMonths("");
    setTermYears("");
    setTodate("");
    setDiscount("");
    setSummary({
      subtotal: 0,
      total: 0,
      gst: 0,
      billamount: 0,
    });
  }
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BASE_URL + "/amcContracts/" + id)
      .then((res) => {
        console.log(res.data);
        const amc = res.data.amccontract;
        const details = res.data.details;

        setANo(amc.ano);
        setAmcDate(amc.amcdate);
        setCustomerId(amc.customerid._id);
        setFromDate(amc.fromDate);
        const termParts = amc.term.split(" "); // ["1", "Years", "6", "Months"]
        const years = parseInt(termParts[0]) || 0;
        const months = parseInt(termParts[2]) || 0;
        setTermYears(years);
        setTermMonths(months);
        setDiscount(amc.discount);

        const mapDetails = details.map((item, i) => ({
          product: item.product,
          description: item.description,
          charge: item.charge,
        }));
        setAmcDetails(mapDetails);

        setTerms(amc.terms);
      });
  }, [id]);

  return (
    <>
      <h2 className="fw-bold mb-3 mt-3">
        {id ? "Update AMC " : "Add New AMC"}
      </h2>
      <nav>
        <ol className="breadcrumb small">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/amc/amc_contracts">AMC Contracts</Link>
          </li>
          <li className="breadcrumb-item active">Add AMC</li>
        </ol>
      </nav>

      <div className="card">
        <div className="card-body p-5">
          <form className="row g-4">
            <div className="col-md-4">
              <label className="form-label fw-semibold">
                AMC Number <span className="text-danger">*</span>
              </label>
              <input
                value={ano}
                type="text"
                className="form-control"
                placeholder="Enter AMC Number"
                onChange={(e) => setANo(e.target.value)}
              />
              {showElert && !ano && (
                <span className="text-danger small">
                  Contract number is required
                </span>
              )}
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">
                Date <span className="text-danger">*</span>
              </label>
              <input
                value={amcdate}
                type="date"
                className="form-control"
                onChange={(e) => setAmcDate(e.target.value)}
              />
              {showElert && !amcdate && (
                <span className="text-danger small">
                  Contract date is required
                </span>
              )}
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">
                Select Customer <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={customerid}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <option>Select Customer</option>
                {customer.map((item, i) => (
                  <option key={i} value={item._id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {showElert &&
                (customerid === "" || customerid === "Customer Name") && (
                  <span className="text-danger small">
                    Please select a customer
                  </span>
                )}
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">
                From Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              {showElert && !fromDate && (
                <span className="text-danger small">From date is required</span>
              )}
            </div>

            <div className="col-md-2">
              <label className="form-label fw-semibold">Term (Years)</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={termYears}
                onChange={(e) => setTermYears(e.target.value)}
              />
              {showElert && !termYears && (
                <span className="text-danger small">Give Year</span>
              )}
            </div>
            <div className="col-md-2">
              <label className="form-label fw-semibold">Term (Months)</label>
              <input
                type="number"
                min="0"
                className="form-control"
                value={termMonths}
                onChange={(e) => setTermMonths(e.target.value)}
              />{" "}
              {showElert && !termMonths && (
                <span className="text-danger small">Give Month</span>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">
                To Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                value={toDate}
                readOnly
              />
            </div>

            <div className="col-12 mt-4">
              <table className="table table-bordered align-middle">
                <thead className="table-secondary text-center">
                  <tr>
                    <th style={{ width: "100px" }}>No</th>
                    <th style={{ width: "60%" }}>Service</th>
                    <th>Charges</th>
                  </tr>
                </thead>
                <tbody>
                  {amcDetails.map((item, i) => (
                    <tr key={i}>
                      <td className="text-center fw-bold">{i + 1}</td>
                      <td>
                        <input
                          type="text"
                          value={item.product}
                          className="form-control mb-2"
                          placeholder="Product Name"
                          onChange={(e) => handleChange(e, i, "product")}
                        />
                        <textarea
                          value={item.description}
                          className="form-control"
                          placeholder="Description"
                          onChange={(e) => handleChange(e, i, "description")}
                        ></textarea>
                      </td>
                      <td>
                        <input
                          value={item.charge}
                          type="number"
                          className="form-control"
                          placeholder="Charge"
                          onChange={(e) => handleChange(e, i, "charge")}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-end">
                <button
                  className="btn btn-outline-secondary me-1"
                  onClick={addRow}
                >
                  <PlusOutlined /> Add Row
                </button>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-md-6">
                <div className="card-body">
                  <h6 className="mb-3 fw-bold text-center">
                    Terms & Conditions
                  </h6>
                  <textarea
                    className="form-control"
                    rows="6"
                    value={terms}
                    onChange={(e) => setTerms(e.target.value)}
                  ></textarea>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card bg-light shadow-sm border">
                  <div className="card-body">
                    <h6 className="text-center mb-3 fw-bold mt-2">
                      AMC Summary
                    </h6>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>₹{summary.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Discount:</span>
                      <div className="d-flex gap-2">
                        <input
                          type="number"
                          className="form-control form-control-sm text-end"
                          style={{ width: "100px" }}
                          value={discount}
                          onChange={(e) => setDiscount(e.target.value)}
                        />
                        <span>₹{summary.discount}</span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Total:</span>
                      <span>₹{summary.total.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>GST (18%):</span>
                      <span>₹{summary.gst.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold fs-5">
                      <span>Bill Amount:</span>
                      <span>₹{summary.billamount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center mt-4">
              <button
                className="btn btn-success px-5 py-2"
                onClick={handleSubmit}
              >
                {id ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Add_Amc;
