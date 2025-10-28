let express = require("express");
let mongoose = require("mongoose");
let cors = require("cors");

mongoose.connect("mongodb://localhost:27017/crm").then((res) => {
  console.log("DB connected successfully...");
});

let app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("welcome to node js");
});

app.use("/admin", require("./routes/AdminRoute"));
app.use("/employe", require("./routes/EmployesRoute"));
app.use("/customer", require("./routes/CustomerRoute"));
app.use("/role", require("./routes/RoleRoute"));

app.use("/complaint", require("./routes/ComplaintRoute"));

app.use("/complaint_review", require("./routes/ComplaintReviewRoute"));

app.use("/quotations", require("./routes/QuotationsRoute"));

app.use("/amcContracts", require("./routes/AmcContractRoute"));

app.use("/dashboard", require("./routes/DashboardRoute"));

app.listen(8080, () => {
  console.log("server running on http://localhost:8080");
});
