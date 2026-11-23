import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ParkingSlots from "./pages/ParkingSlots";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./pages/AdminDashboard";
import CreateSlots from "./pages/CreateSlots";
import VehicleEntry from "./pages/VehicleEntry";
import MyTickets from "./pages/MyTickets";
import TicketConfirmation from "./pages/TicketConfirmation";
import UserManagement from "./pages/UserManagement";
import OccupiedSlots from "./pages/OccupiedSlots";
import PendingExitRequests from "./pages/PendingExitRequests";
import ParkingAvailability from "./pages/ParkingAvailability";
import AdminAnalytics from "./pages/AdminAnalytics";
import UserProfile from "./pages/UserProfile";

const ALL_ROLES = ["ADMIN", "MANAGER", "OPERATOR", "USER"];

function RoleDashboard() {
  const role = localStorage.getItem("role");

  switch (role) {
    case "ADMIN":
      return <Navigate to="/admin" replace />;

    case "OPERATOR":
      return <Navigate to="/operator" replace />;

    case "MANAGER":
      return <Navigate to="/manager" replace />;

    case "USER":
      return <Dashboard />;

    default:
      return <Navigate to="/login" replace />;
  }
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute allowedRoles={ALL_ROLES} />}>
        <Route path="/dashboard" element={<RoleDashboard />} />
        <Route path="/slots" element={<ParkingSlots />} />
        <Route path="/parking-availability" element={<ParkingAvailability />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
        <Route path="/vehicle-entry" element={<VehicleEntry />} />
        <Route path="/my-tickets" element={<MyTickets />} />
        <Route path="/ticket/:ticketUid" element={<TicketConfirmation />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/slots" element={<CreateSlots />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/occupied-slots" element={<OccupiedSlots />} />
        <Route path="/admin/exit-requests" element={<PendingExitRequests />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/users/:userId" element={<UserProfile />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["OPERATOR"]} />}>
        <Route
          path="/operator"
          element={
            <div className="p-8">
              <h1 className="text-2xl font-bold">Operator Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Welcome to the parking operations dashboard.
              </p>
            </div>
          }
        />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["MANAGER"]} />}>
        <Route
          path="/manager"
          element={
            <div className="p-8">
              <h1 className="text-2xl font-bold">Manager Dashboard</h1>
              <p className="mt-2 text-gray-600">
                Welcome to the parking management dashboard.
              </p>
            </div>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
