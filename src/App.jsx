import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Records from "./pages/Records";
import Units from "./pages/Units";
import AnnualReports from "./pages/AnnualReports";
import SDOfficer from "./pages/SDOfficer";
import DashboardAdmin from "./pages/DashboardAdmin";
import Instruments from "./pages/Instruments";
import InstrumentForm from "./pages/InstrumentForm";
import RecordAdmin from "./pages/RecordAdmin";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/csd/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/csd/sd/records" element={<Records />} />
                <Route path="/csd/admin/records" element={<RecordAdmin />} />
                <Route path="/csd/units" element={<Units />} />
                <Route path="/csd/annual-reports" element={<AnnualReports />} />
                <Route path="/csd/sd-officers" element={<SDOfficer />} />
                <Route path="/csd/sd/dashboard" element={<DashboardAdmin />} />
                <Route path="/csd/instruments" element={<Instruments />} />
                <Route path="*" element={<Login />} />
                <Route
                    path="/csd/instruments-form"
                    element={<InstrumentForm />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
