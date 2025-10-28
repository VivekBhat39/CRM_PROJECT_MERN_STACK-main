import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
// import logo from "";

function AmcContractPrint() {
  const { id } = useParams();

  const [amcdata, setamcData] = useState(null);

  function loadData() {
    axios
      .get(import.meta.env.VITE_BASE_URL + "/amcContracts/" + id)
      .then((res) => {
        // console.log(res.data);
        setamcData(res.data);
      });
  }

  useEffect(() => {
    loadData();
  }, [id]);

  if (!amcdata) {
    return <div className="text-center mt-5">Loading AMC Details...</div>;
  }

  // console.log(amcdata);

  function print_report(divname) {
    const printContent = document.getElementById(divname);
    const WinPrint = window.open(
      "",
      "",
      "left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0"
    );

    let str = `
    <html>
    <head>
      <title>Print Report</title>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />
      <style>
        * {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
          padding: 20px;
          background: #fff;
        }

      

        .table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        .table th, .table td {
          border: 1px solid #dee2e6;
          padding: 8px;
          vertical-align: middle;
        }

        .table thead th {
          background-color: #f1f1f1;
        }

        .summary-box {
          border: 1px solid #000;
          padding: 15px;
          margin-top: 20px;
        }

        .print-bordered {
          border: 1px solid #000;
          padding: 20px;
          margin-bottom: 20px;
        }

        .no-break-inside {
          page-break-inside: avoid;
        }

        .text-end {
          text-align: right;
        }

        .text-center {
          text-align: center;
        }

        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body {
            background: #fff;
          }

          
        }
          
      </style>
    </head>
    <body>
     <div style="text-align: left; margin-bottom: 20px;">
  </div>
        ${printContent.innerHTML}
    </body>
    </html>
  `;

    WinPrint.document.write(str);
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  }

  return (
    <>
      <h2 className="fw-bold mb-3 mt-3">AMC</h2>
      <nav>
        <ol className="breadcrumb small">
          <li className="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/amc/amc_contracts">AMC Contracts</Link>
          </li>
          <li className="breadcrumb-item active">AMC</li>
        </ol>
      </nav>

      <div className="text-end me-3 d-print-none text-end mb-3">
        <button
          className="btn btn-primary d-print-none"
          onClick={() => print_report("printArea")}
        >
          <i className="bi bi-printer"></i> Print
        </button>
      </div>

      <div
        className="container my-4 card p-4 shadow print-bordered no-break-inside"
        id="printArea"
        style={{
          width: "210mm",
          height: "292mm",
          padding: "20mm",
          breakAfter: "page",
          boxSizing: "border-box",
        }}
      >
        <div className="p-4 print-bordered no-break-inside mb-4">
          <h2 className="fw-bold mb-1 text-center">AMC CONTRACT</h2>

          <table style={{ width: "100%", marginBottom: "20px" }}>
            <tbody>
              <tr>
                <td style={{ width: "50%", verticalAlign: "top" }}>
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSahxTzxXN0TMFONk4H8UtHFN9RNlNi9hKNaU9utgaSAE5k_GUWXNPL32d-zEkYEWQYOtw&usqp=CAU"
                    alt="Logo"
                    style={{ maxWidth: "120px" }}
                  />
                </td>
                <td
                  style={{
                    width: "50%",
                    textAlign: "right",
                    verticalAlign: "top",
                  }}
                >
                  <h4 className="fw-bold mb-1">Vipras Technomart</h4>
                  <p className="mb-0">sales@viprasindia.com</p>
                  <p className="mb-0">+91-9325716859</p>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="text-center border-bottom pb-3 mb-4">
            <p className="mb-0">
              <strong>AMC No : </strong> AMC No-{amcdata.amccontract.ano}
            </p>
            <p className="mb-0">
              <strong>Date : </strong> {amcdata.amccontract.amcdate}
            </p>
          </div>

          <table className="table table-borderless mb-4">
            <tbody>
              <tr>
                <td style={{ width: "50%" }}>
                  <h5 className="fw-semibold">Customer Details</h5>
                  <p>
                    <strong>Name:</strong> {amcdata.amccontract.customerid.name}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {amcdata.amccontract.customerid.email}
                  </p>
                  <p>
                    <strong>Mobile:</strong>{" "}
                    {amcdata.amccontract.customerid.mobile}
                  </p>
                </td>

                <td className="text-end" style={{ width: "50%" }}>
                  <h5 className="fw-semibold">From</h5>
                  <p>Vipras Technomart</p>
                  <p>sales@viprasindia.com</p>
                  <p>+91-9325716859</p>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="table-responsive mb-4 no-break-inside">
            <table className="table table-bordered border">
              <thead className="table-light">
                <tr>
                  <th>No</th>
                  <th>Product</th>
                  <th>Description</th>
                  <th>From Date</th>
                  <th>To Date</th>
                  <th>Charges</th>
                </tr>
              </thead>
              <tbody>
                {amcdata.details.map((item, i) => (
                  <tr key={i}>
                    <td>{item.srno}</td>
                    <td>{item.product}</td>
                    <td>{item.description}</td>
                    <td>{amcdata.amccontract.fromDate}</td>
                    <td>{amcdata.amccontract.toDate}</td>
                    <td>{item.charge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <table className="table table-borderless no-break-inside">
            <tbody>
              <tr>
                <td style={{ width: "50%" }}>
                  <div className="card-body p-4">
                    <h6>Terms & Conditions </h6>
                    <p style={{ whiteSpace: "pre-line" }}>
                      {amcdata.amccontract.terms}
                    </p>
                  </div>
                </td>
                <td style={{ width: "50%" }}>
                  <div className="border border-dark rounded p-4 bg-light">
                    <h5 className="text-center mb-4">Summary</h5>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal :</span>
                      <span>₹ {amcdata.amccontract.subtotal}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Discount :</span>
                      <span>₹ {amcdata.amccontract.discount}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>GST (18%) :</span>
                      <span>₹ {amcdata.amccontract.gst}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold fs-5">
                      <span>Grand Total :</span>
                      <span>₹ {amcdata.amccontract.billamount}</span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AmcContractPrint;
