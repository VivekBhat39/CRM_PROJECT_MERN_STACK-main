import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { data, Link, useNavigate, useParams } from "react-router-dom";

function AddQuotation() {
  const [customer, setCustomers] = useState([]);
  useEffect(() => {
    axios
      .get(import.meta.env.VITE_BASE_URL + "/customer")
      .then((res) => setCustomers(res.data.data));
  }, []);

  const [customerid, setCustomerId] = useState("");
  const [qdate, setQDate] = useState("");
  const [qno, setQNo] = useState("");
  const [discount, setDiscount] = useState("");
  const gstRate = 18;
  const [terms, setTerms] = useState(
    "1. Payment to be made within 7 days.\n2. Warranty as per manufacturer.\n3. Goods once sold will not be taken back.\n4. Prices are exclusive of GST.\n5. Delivery in 5-7 working days."
  );

  const [quotationdetails, setQuotationDetails] = useState([
    {
      product: "",
      description: "",
      quantity: "",
      rate: "",
      total: 0,
    },
  ]);

  //validation
  const [showElert, setShowElert] = useState(false);

  const [summary, setSummary] = useState({
    subtotal: 0,
    total: 0,
    gst: 0,
    billamount: 0,
  });

  const { id } = useParams();

  const navigate = useNavigate();

  function addRow(e) {
    e.preventDefault();
    setQuotationDetails([
      ...quotationdetails,
      { product: "", description: "", quantity: "", rate: "", total: 0 },
    ]);
  }

  function handleChange(e, index, key) {
    const updatedRows = [...quotationdetails];

    updatedRows[index][key] = e.target.value;

    if (key === "quantity" || key === "rate") {
      const qty = Number(updatedRows[index].quantity);
      const rate = Number(updatedRows[index].rate);
      updatedRows[index].total = qty * rate;
    }
    setQuotationDetails(updatedRows);
  }

  //summary

  useEffect(() => {
    const subtotal = quotationdetails.reduce(
      (sum, item) => sum + Number(item.total || 0),
      0
    );
    const total = subtotal - Number(discount || 0);
    const gst = (total * gstRate) / 100;
    const billamount = total + gst;

    setSummary({
      subtotal,
      discount,
      total,
      gst,
      billamount,
    });
  }, [quotationdetails, discount]);

  function handleSubmit(e) {
    e.preventDefault();
    setShowElert(true);

    if (!qno || !qdate || !customerid || customerid === "Customer Name") {
      return;
    }
    const hasInvalidRow = quotationdetails.some(
      (item) =>
        !item.product.trim() ||
        Number(item.quantity) <= 0 ||
        Number(item.rate) <= 0
    );

    if (hasInvalidRow) return;
    else {
      const detailsPayload = quotationdetails.map((item, i) => ({
        srno: i + 1,
        product: item.product,
        description: item.description,
        qty: Number(item.quantity),
        rate: Number(item.rate),
        total: item.total,
      }));

      const payload = {
        qdate,
        qno,
        customerid,
        subtotal: summary.subtotal,
        discount: discount,
        total: summary.total,
        gst: summary.gst,
        billamount: summary.billamount,
        terms: terms,
        details: detailsPayload,
      };

      console.log(" Final Payload: ", payload);
      if (id === undefined) {
        axios
          .post(import.meta.env.VITE_BASE_URL + "/quotations", payload)
          .then((res) => {
            console.log(res.data);
            resetData();
            navigate("/quotation/quotations");
          });
      } else {
        axios
          .put(import.meta.env.VITE_BASE_URL + "/quotations/" + id, payload)
          .then((res) => {
            console.log(res.data);
            resetData();
            navigate("/quotation/quotations");
          });
      }
    }
  }

  function resetData() {
    setQNo("");
    setQDate("");
    setCustomerId("");
    setDiscount("");
    setSummary({
      subtotal: 0,
      total: 0,
      gst: 0,
      billamount: 0,
    });
    setQuotationDetails([
      {
        product: "",
        description: "",
        quantity: "",
        rate: "",
        total: "",
      },
    ]);
  }

  useEffect(() => {
    if (id) {
      // console.log(id);
      axios
        .get(import.meta.env.VITE_BASE_URL + "/quotations/" + id)
        .then((res) => {
          console.log(res.data);

          const q = res.data.quotation;
          const details = res.data.details;

          // console.log(q);
          // console.log(details);

          setQNo(q.qno);
          setQDate(q.qdate);
          setCustomerId(q.customerid._id);

          setDiscount(q.discount);

          const mapDetails = details.map((item, i) => ({
            product: item.product,
            description: item.description,
            quantity: item.qty,
            rate: item.rate,
            total: item.total,
          }));

          setQuotationDetails(mapDetails);
        });
    }
  }, [id]);

  return (
    <>
      <h2 className="fw-bold mb-3 mt-3">
        {id ? "Update Quotation " : "Add New Quotation"}
      </h2>
      <nav>
        <ol className="breadcrumb small">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/quotation/quotations">Quotations</Link>
          </li>
          <li className="breadcrumb-item active">Add Quotation</li>
        </ol>
      </nav>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body p-5">
          <form className="row g-4">
            <div className="col-md-3">
              <label className="form-label fw-semibold">
                Quotation Number <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                value={qno}
                placeholder="Enter Quotation Number"
                onChange={(e) => setQNo(e.target.value)}
              />
              {showElert && !qno && (
                <span className="text-danger small">
                  Quotation number is required
                </span>
              )}
            </div>

            <div className="col-md-4">
              <label className="form-label fw-semibold">
                Date <span className="text-danger">*</span>
              </label>
              <input
                type="date"
                className="form-control"
                value={qdate}
                onChange={(e) => setQDate(e.target.value)}
              />
              {showElert && !qdate && (
                <span className="text-danger small">
                  Quotation date is required
                </span>
              )}
            </div>

            <div className="col-md-5">
              <label className="form-label fw-semibold">
                Select Customer <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                value={customerid}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <option>Customer Name</option>
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

            <div className="col-12">
              <table className="table table-bordered align-middle">
                <thead className="table-secondary text-center">
                  <tr>
                    <th style={{ width: "50px" }}>No</th>
                    <th style={{ width: "30%" }}>Product & Description</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quotationdetails.map((item, i) => (
                    <tr key={i}>
                      <td className="text-center fw-bold">{i + 1}</td>
                      <td>
                        <input
                          type="text"
                          className="form-control mb-2"
                          value={item.product}
                          placeholder="Product Name"
                          onChange={(e) => handleChange(e, i, "product")}
                        />
                        <textarea
                          className="form-control"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => handleChange(e, i, "description")}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control text-center"
                          value={item.quantity}
                          placeholder="Quantity"
                          onChange={(e) => handleChange(e, i, "quantity")}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control text-center"
                          value={item.rate}
                          placeholder="Rate"
                          onChange={(e) => handleChange(e, i, "rate")}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control text-center bg-light"
                          value={item.total}
                          placeholder="Total"
                          readOnly
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="text-end">
                <button className="btn btn-outline-secondary" onClick={addRow}>
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
                      Quotation Summary
                    </h6>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>₹ {summary.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Discount:</span>
                      <div className="d-flex gap-2">
                        <input
                          type="number"
                          className="form-control form-control-sm text-end"
                          style={{ width: "100px" }}
                          value={discount}
                          onChange={(e) => setDiscount(Number(e.target.value))}
                        />
                        <span>₹ {summary.discount}</span>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Total:</span>
                      <span>₹ {summary.total.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>GST (18%):</span>
                      <span>₹ {summary.gst.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold fs-5">
                      <span>Bill Amount:</span>
                      <span>₹ {summary.billamount.toFixed(2)}</span>
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
                {id ? "Update Quotation" : "Save Quotation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddQuotation;
