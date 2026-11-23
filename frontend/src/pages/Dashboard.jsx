import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  CarFront,
  CheckCircle,
  Clock,
  LogOut,
  ParkingCircle,
  RefreshCw,
  Ticket,
  XCircle,
  ArrowRight,
  ParkingSquare,
} from "lucide-react";

import { apiFetch } from "../api/api";

function Dashboard() {
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem("username") || "User";

  const fetchSlots = useCallback(async () => {
    try {
      setLoading(true);

      const data = await apiFetch("/slots");
      console.log(data);

      const slotList = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : [];

      setSlots(slotList);
    } catch (error) {
      toast.error(error.message || "Failed to load parking slots");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const totalSlots = slots.length;

  const availableSlots = slots.filter(
    (slot) => slot.status === "AVAILABLE",
  ).length;

  const occupiedSlots = slots.filter(
    (slot) => slot.status === "OCCUPIED",
  ).length;

  const formatSlotType = (type) => {
    if (!type) return "N/A";

    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  const getStatusStyle = (status) => {
    if (status === "AVAILABLE") {
      return "bg-green-100 text-green-700";
    }

    if (status === "OCCUPIED") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2 text-white">
              <ParkingCircle size={25} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">ParkSmart</h1>
              <p className="text-xs text-gray-500">Parking Management System</p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Welcome, {username}!
          </h2>

          <p className="mt-2 text-gray-600">
            Manage your parking activity and check parking slot availability.
          </p>
        </section>

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Slots"
            value={loading ? "..." : totalSlots}
            description="Total parking capacity"
            icon={<ParkingCircle size={24} />}
            iconStyle="bg-blue-100 text-blue-600"
          />

          <StatCard
            title="Available Slots"
            value={loading ? "..." : availableSlots}
            description="Slots ready for parking"
            icon={<CheckCircle size={24} />}
            iconStyle="bg-green-100 text-green-600"
          />

          <StatCard
            title="Occupied Slots"
            value={loading ? "..." : occupiedSlots}
            description="Currently occupied slots"
            icon={<XCircle size={24} />}
            iconStyle="bg-red-100 text-red-600"
          />
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h3 className="mb-4 text-lg font-bold text-gray-900">
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <ActionCard
              title="Vehicle Entry"
              description="Register your vehicle and get a parking ticket."
              icon={<CarFront size={25} />}
              iconStyle="bg-blue-100 text-blue-600"
              to="/vehicle-entry"
              buttonText="Park Vehicle"
            />

            <ActionCard
              title="My Tickets"
              description="View your parking history and manage active tickets."
              icon={<Ticket size={25} />}
              iconStyle="bg-purple-100 text-purple-600"
              to="/my-tickets"
              buttonText="View Tickets"
            />
          </div>
        </section>

        {/* Parking Slots */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className=" w-full gap-120 flex">
              <div className="w-full">
                <h3 className="text-lg font-bold text-gray-900">
                  Parking Slots
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Check the current status of parking slots.
                </p>
              </div>

              <button
                onClick={() => navigate("/parking-availability")}
                className="flex w-full items-center border gap-3 rounded-xl pl-4 py-3 text-left text-slate-600 hover:bg-slate-100"
              >
                <ParkingSquare size={19} />
                View Availability
              </button>
            </div>

            <button
              onClick={fetchSlots}
              disabled={loading}
              className="flex items-center justify-center gap-2 self-start rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <RefreshCw size={28} className="animate-spin text-blue-600" />
              <p className="mt-3 text-sm text-gray-500">
                Loading parking slots...
              </p>
            </div>
          ) : slots.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <ParkingCircle size={40} className="mx-auto text-gray-300" />

              <h4 className="mt-3 font-semibold text-gray-800">
                No parking slots found
              </h4>

              <p className="mt-1 text-sm text-gray-500">
                Parking slots will appear here once they have been added.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto  max-h-[400px] overflow-y-auto rounded-lg">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Slot Number</th>
                    <th className="px-6 py-4 font-semibold">Floor</th>
                    <th className="px-6 py-4 font-semibold">Zone</th>
                    <th className="px-6 py-4 font-semibold">Slot Type</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {slots.map((slot) => (
                    <tr key={slot.id} className="transition hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {slot.slotNumber || "N/A"}
                      </td>

                      <td className="px-6 py-4">{slot.floor ?? "N/A"}</td>

                      <td className="px-6 py-4">{slot.zone || "N/A"}</td>

                      <td className="px-6 py-4">
                        {formatSlotType(slot.slotType)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            slot.status,
                          )}`}
                        >
                          {slot.status === "AVAILABLE" ? (
                            <CheckCircle size={13} />
                          ) : slot.status === "OCCUPIED" ? (
                            <XCircle size={13} />
                          ) : (
                            <Clock size={13} />
                          )}

                          {slot.status || "UNKNOWN"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 bg-gray-50 px-5 py-3 text-xs text-gray-500">
            <span>
              Showing {slots.length} parking slot
              {slots.length === 1 ? "" : "s"}
            </span>

            <span>Refresh to check the latest status</span>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ title, value, description, icon, iconStyle }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>

          <h3 className="mt-2 text-3xl font-bold text-gray-900">{value}</h3>
        </div>

        <div className={`rounded-xl p-3 ${iconStyle}`}>{icon}</div>
      </div>

      <p className="mt-4 text-sm text-gray-500">{description}</p>
    </div>
  );
}

function ActionCard({ title, description, icon, iconStyle, to, buttonText }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className={`rounded-xl p-3 ${iconStyle}`}>{icon}</div>

        <div className="flex-1">
          <h4 className="font-bold text-gray-900">{title}</h4>

          <p className="mt-1 text-sm leading-6 text-gray-500">{description}</p>

          <Link
            to={to}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
          >
            {buttonText}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
