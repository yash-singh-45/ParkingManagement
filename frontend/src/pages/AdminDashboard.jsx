import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  CarFront,
  LayoutDashboard,
  ParkingSquare,
  Users,
  LogOut,
  RefreshCw,
  ArrowRight,
  ChartNoAxesCombined,
} from "lucide-react";
import { apiFetch } from "../api/api";

function AdminDashboard() {
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadSlots() {
    setLoading(true);

    try {
      const data = await apiFetch("/slots");
      setSlots(Array.isArray(data) ? data : (data?.content ?? []));
    } catch (error) {
      toast.error(error.message || "Could not load parking slots");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSlots();
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  }

  const available = slots.filter((s) => s.status === "AVAILABLE").length;
  const occupied = slots.filter((s) => s.status === "OCCUPIED").length;

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside className="w-full border-r border-slate-200 bg-white p-5 md:min-h-screen md:w-64">
        <h2 className="mb-8 text-xl font-bold text-blue-700">
          ParkSmart <span className="text-xs text-slate-500">ADMIN</span>
        </h2>

        <nav className="space-y-2">
          <button
            onClick={() => navigate("/admin")}
            className="flex w-full items-center gap-3 rounded-xl bg-blue-50 px-4 py-3 text-left font-medium text-blue-700"
          >
            <LayoutDashboard size={19} />
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/slots")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-600 hover:bg-slate-100"
          >
            <ParkingSquare size={19} />
            Parking Slots
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-600 hover:bg-slate-100"
          >
            <Users size={19} />
            User Management
          </button>

          <button
            onClick={() => navigate("/admin/occupied-slots")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-600 hover:bg-slate-100"
          >
            <CarFront size={19} />
            Occupied Slots
          </button>

          <button
            onClick={() => navigate("/admin/exit-requests")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-600 hover:bg-slate-100"
          >
            <LogOut size={19} />
            Exit Requests
          </button>

          <button
            onClick={() => navigate("/parking-availability")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-600 hover:bg-slate-100"
          >
            <ParkingSquare size={19} />
            Parking Availability
          </button>

          <button
            onClick={() => navigate("/admin/analytics")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-slate-600 hover:bg-slate-100"
          >
            <ChartNoAxesCombined size={19} />
            Analytics
          </button>
        </nav>

        <button
          onClick={logout}
          className="mt-8 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-red-600 hover:bg-red-50"
        >
          <LogOut size={19} />
          Logout
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-5 md:p-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-600">Administration</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-slate-500">
              Monitor parking capacity and manage your facility.
            </p>
          </div>

          <button
            onClick={loadSlots}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Slots",
              value: loading ? "..." : slots.length,
              icon: ParkingSquare,
              color: "blue",
            },
            {
              label: "Available",
              value: loading ? "..." : available,
              icon: CarFront,
              color: "green",
            },
            {
              label: "Occupied",
              value: loading ? "..." : occupied,
              icon: CarFront,
              color: "orange",
            },
            {
              label: "Other Statuses",
              value: loading ? "..." : slots.length - available - occupied,
              icon: LayoutDashboard,
              color: "purple",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    {item.label}
                  </p>
                  <span className="rounded-xl bg-slate-100 p-3 text-slate-700">
                    <Icon size={21} />
                  </span>
                </div>
                <p className="mt-5 text-3xl font-bold text-slate-900">
                  {item.value}
                </p>
                <p className="mt-2 text-sm text-slate-400">
                  Parking facility overview
                </p>
              </div>
            );
          })}
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Parking Slots
              </h2>
              <p className="mt-1 text-sm text-slate-500">Current slot status</p>
            </div>

            <button
              onClick={() => navigate("/admin/slots")}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              Manage Slots <ArrowRight size={16} />
            </button>
          </div>

          {loading ? (
            <p className="py-8 text-center text-slate-500">
              Loading parking slots...
            </p>
          ) : slots.length === 0 ? (
            <p className="py-8 text-center text-slate-500">
              No parking slots found.
            </p>
          ) : (
            <div className=" max-h-[400px] overflow-y-auto rounded-lg overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="px-3 py-3 font-medium">Slot Number</th>
                    <th className="px-3 py-3 font-medium">Type</th>
                    <th className="px-3 py-3 font-medium">Floor</th>
                    <th className="px-3 py-3 font-medium">Zone</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map((slot) => (
                    <tr
                      key={slot.id ?? slot.slotNumber}
                      className="border-b border-slate-100 last:border-0"
                    >
                      <td className="px-3 py-4 font-semibold text-slate-800">
                        {slot.slotNumber}
                      </td>
                      <td className="px-3 py-4 text-slate-600">
                        {slot.slotType}
                      </td>
                      <td className="px-3 py-4 text-slate-600">{slot.floor}</td>
                      <td className="px-3 py-4 text-slate-600">{slot.zone}</td>
                      <td className="px-3 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            slot.status === "AVAILABLE"
                              ? "bg-green-100 text-green-700"
                              : slot.status === "OCCUPIED"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {slot.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
