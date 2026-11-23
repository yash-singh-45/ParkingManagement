
import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import {
  RefreshCw,
  Search,
  CarFront,
  AlertCircle,
  ParkingSquare,
} from "lucide-react";

export default function OccupiedSlots() {
  const [slots, setSlots] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOccupiedSlots = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/admin/occupied-slots");
      setSlots(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load occupied slots.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOccupiedSlots();
  }, [fetchOccupiedSlots]);

  const filteredSlots = slots.filter((slot) => {
    const query = search.toLowerCase();

    return (
      slot.slotNumber?.toLowerCase().includes(query) ||
      slot.vehicleNumber?.toLowerCase().includes(query) ||
      slot.ticketUid?.toLowerCase().includes(query) ||
      slot.zone?.toLowerCase().includes(query) ||
      String(slot.floor ?? "").includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-medium text-cyan-400">
              ADMINISTRATION
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Occupied Slots
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Monitor currently occupied parking spaces and active tickets.
            </p>
          </div>

          <button
            onClick={fetchOccupiedSlots}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium transition hover:border-cyan-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Summary */}
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Currently Occupied
                </p>
                <p className="mt-2 text-3xl font-bold">{slots.length}</p>
              </div>
              <div className="rounded-xl bg-orange-500/10 p-3 text-orange-400">
                <ParkingSquare size={25} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Tickets</p>
                <p className="mt-2 text-3xl font-bold">{slots.length}</p>
              </div>
              <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
                <CarFront size={25} />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search slot, vehicle, ticket, zone..."
              className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-500 focus:border-cyan-500"
            />
          </div>

          <p className="text-sm text-slate-400">
            Showing{" "}
            <span className="font-semibold text-slate-200">
              {filteredSlots.length}
            </span>{" "}
            of {slots.length} slots
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
            <AlertCircle size={20} className="mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="font-medium">Unable to load occupied slots</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
            <button
              onClick={fetchOccupiedSlots}
              className="text-sm font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="font-semibold">Occupied Parking Spaces</h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw
                size={28}
                className="animate-spin text-cyan-400"
              />
              <p className="mt-4 text-sm text-slate-400">
                Loading occupied slots...
              </p>
            </div>
          ) : error && slots.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">
              Could not retrieve parking data.
            </div>
          ) : filteredSlots.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
              <ParkingSquare size={36} className="text-slate-600" />
              <p className="mt-4 font-medium">
                {search ? "No matching slots found" : "No occupied slots"}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {search
                  ? "Try a different search term."
                  : "All parking spaces are currently free."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left text-sm">
                <thead className="bg-slate-800/60 text-xs uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Slot</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Vehicle</th>
                    <th className="px-5 py-4">Ticket UID</th>
                    <th className="px-5 py-4">Entry Time</th>
                    <th className="px-5 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {filteredSlots.map((slot) => (
                    <tr
                      key={slot.slotId}
                      className="transition hover:bg-slate-800/40"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-100">
                          {slot.slotNumber}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {slot.slotType}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        <div>Floor {slot.floor ?? "—"}</div>
                        <div className="mt-1 text-xs text-slate-500">
                          Zone {slot.zone || "—"}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-200">
                          {slot.vehicleNumber}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {slot.vehicleType}
                        </div>
                      </td>

                      <td className="px-5 py-4 font-mono text-xs text-slate-300">
                        {slot.ticketUid}
                      </td>

                      <td className="px-5 py-4 text-slate-300">
                        {slot.entryTime
                          ? new Date(slot.entryTime).toLocaleString()
                          : "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                          Occupied
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}