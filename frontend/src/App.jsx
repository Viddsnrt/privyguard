import { Navigate, Route, Routes } from "react-router-dom";

import LandingPage from "./LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

import ScanHistoryPage from "./pages/ScanHistoryPage.jsx";
import ScanDetailPage from "./pages/ScanDetailPage.jsx";


function App() {
  return (
    <Routes>

      {/* LANDING PAGE */}
      <Route
        path="/"
        element={<LandingPage />}
      />


      {/* AUTHENTICATION */}
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/register"
        element={<RegisterPage />}
      />


      {/* DASHBOARD */}
      <Route
        path="/dashboard"
        element={<DashboardPage />}
      />


      {/* SCAN HISTORY */}
      <Route
        path="/scan-history"
        element={<ScanHistoryPage />}
      />


      {/* SCAN DETAIL */}
      <Route
        path="/scan/:id"
        element={<ScanDetailPage />}
      />


      {/* FALLBACK */}
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}


export default App;