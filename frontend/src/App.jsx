import Dashboard from "./component/user/dashboard/Dashboard";
import Landing from "./component/user/Landing";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Employes from "./component/user/master/Employes";
import Customer from "./component/user/master/Customer";
import Login from "./component/Login";
import Role from "./component/user/master/Role";
import ProtectedRoute from "./component/ProtectedRoute";
import Add_complaint from "./component/user/complaint/Add_complaint";
import Complaint_Review from "./component/user/complaint/Complaint_Review";
import Quotations from "./component/user/quotation/Quotations";
import Complaints from "./component/user/complaint/Complaints";
import AddQuotation from "./component/user/quotation/AddQuotation";
import QuotationPrint from "./component/user/quotation/QuotationPrint";
import AmcContracts from "./component/user/amc/AmcContracts";
import Add_Amc from "./component/user/amc/Add_Amc";
import AmcContractPrint from "./component/user/amc/AmcContractPrint";
import Register from "./component/Register";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Landing />
            </ProtectedRoute>
          }
          >
            <Route path="" element={<Dashboard />}></Route>
          </Route>

          {/* master route*/}
          <Route
            path="/master"
            element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            }
          >
            <Route path="/master/employes" element={<Employes />}></Route>
            <Route path="/master/customer" element={<Customer />}></Route>
            <Route path="/master/role" element={<Role />}></Route>
          </Route>

          {/* complaint route */}
          <Route
            path="/complaint"
            element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            }
          >
            <Route
              path="/complaint/complaints"
              element={<Complaints />}
            ></Route>

            <Route
              path="/complaint/add-complaint"
              element={<Add_complaint />}
            ></Route>
            <Route
              path="/complaint/add-complaint/:id"
              element={<Add_complaint />}
            ></Route>
            <Route
              path="/complaint/complaint-review/:id"
              element={<Complaint_Review />}
            ></Route>
          </Route>

          {/* quotation route */}
          <Route
            path="/quotation"
            element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            }
          >
            <Route
              path="/quotation/quotations"
              element={<Quotations />}
            ></Route>
            <Route
              path="/quotation/add-quotaion"
              element={<AddQuotation />}
            ></Route>
            <Route
              path="/quotation/add-quotaion/:id"
              element={<AddQuotation />}
            ></Route>
            <Route
              path="/quotation/quotation_print/:id"
              element={<QuotationPrint />}
            ></Route>
          </Route>

          {/* amc route */}
          <Route
            path="/amc"
            element={
              <ProtectedRoute>
                <Landing />
              </ProtectedRoute>
            }
          >
            <Route
              path="/amc/amc_contracts"
              element={<AmcContracts></AmcContracts>}
            ></Route>
            <Route path="/amc/add-amc" element={<Add_Amc></Add_Amc>}></Route>
            <Route
              path="/amc/add-amc/:id"
              element={<Add_Amc></Add_Amc>}
            ></Route>
            <Route
              path="/amc/amc_print/:id"
              element={<AmcContractPrint></AmcContractPrint>}
            ></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
