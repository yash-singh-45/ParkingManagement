
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  CarFront,
  CheckCircle,
  Clock,
  LogOut,
  ParkingCircle,
  RefreshCw,
  Ticket,
  IndianRupee,
} from "lucide-react";

import { apiFetch } from "../api/api";

function MyTickets() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestingTicketUid, setRequestingTicketUid] = useState(null);

  const username = localStorage.getItem("username") || "User";

  // Fetch user's tickets
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);

      const data = await apiFetch("/parking/my-tickets");

      const ticketList = Array.isArray(data)
        ? data
        : Array.isArray(data?.content)
          ? data.content
          : [];

      setTickets(ticketList);
    } catch (error) {
      toast.error(error.message || "Failed to load your tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    navigate("/login", { replace: true });
  };

  // User requests vehicle exit
  const handleRequestExit = async (ticket) => {
    const confirmed = window.confirm(
      `Are you sure you want to request exit for vehicle ${ticket.vehicleNumber}?`
    );

    if (!confirmed) return;

    try {
      setRequestingTicketUid(ticket.ticketUid);

      await apiFetch(
        `/parking/exit-request/${encodeURIComponent(ticket.ticketUid)}`,
        {
          method: "POST",
        }
      );

      // Update local state immediately
      setTickets((prev) =>
        prev.map((t) =>
          t.ticketUid === ticket.ticketUid
            ? { ...t, exitRequestStatus: "PENDING" }
            : t
        )
      );

      toast.success("Exit request submitted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to submit exit request");
    } finally {
      setRequestingTicketUid(null);
    }
  };

  // Separate active and closed tickets
  const activeTickets = tickets.filter(
    (ticket) => ticket.status === "ACTIVE"
  );

  const closedTickets = tickets.filter(
    (ticket) => ticket.status === "CLOSED"
  );

  // Date formatting
  const formatDate = (dateTime) => {
    if (!dateTime) return "—";

    const date = new Date(dateTime);

    if (Number.isNaN(date.getTime())) return dateTime;

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Amount formatting
  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return "Pending";

    return `₹${Number(amount).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
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
              <h1 className="text-xl font-bold text-gray-900">
                ParkSmart
              </h1>
              <p className="text-xs text-gray-500">
                Parking Management System
              </p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Page Heading */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <Link
              to="/dashboard"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </Link>

            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              My Tickets
            </h2>

            <p className="mt-2 text-gray-600">
              Welcome, {username}. Manage your parking sessions and view
              previous tickets.
            </p>
          </div>

          <button
            onClick={fetchTickets}
            disabled={loading}
            className="flex items-center justify-center gap-2 self-start rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-60 sm:self-auto"
          >
            <RefreshCw
              size={16}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>

        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">

          <SummaryCard
            title="Total Tickets"
            value={loading ? "..." : tickets.length}
            icon={<Ticket size={23} />}
            iconStyle="bg-blue-100 text-blue-600"
          />

          <SummaryCard
            title="Active Tickets"
            value={loading ? "..." : activeTickets.length}
            icon={<Clock size={23} />}
            iconStyle="bg-green-100 text-green-600"
          />

          <SummaryCard
            title="Completed Sessions"
            value={loading ? "..." : closedTickets.length}
            icon={<CheckCircle size={23} />}
            iconStyle="bg-purple-100 text-purple-600"
          />

        </div>

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center">
            <RefreshCw
              size={30}
              className="mx-auto animate-spin text-blue-600"
            />

            <p className="mt-3 text-sm text-gray-500">
              Loading your tickets...
            </p>
          </div>
        ) : tickets.length === 0 ? (

          /* Empty State */
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center">

            <Ticket size={44} className="mx-auto text-gray-300" />

            <h3 className="mt-4 text-lg font-bold text-gray-900">
              No tickets yet
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Your parking tickets will appear here after you register a
              vehicle.
            </p>

            <Link
              to="/vehicle-entry"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <CarFront size={18} />
              Register Vehicle
            </Link>

          </div>
        ) : (

          <div className="space-y-8">

            {/* Active Tickets */}
            <section>

              <div className="mb-4 flex items-center gap-2">
                <Clock size={21} className="text-green-600" />

                <h3 className="text-xl font-bold text-gray-900">
                  Active Tickets
                </h3>

                <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                  {activeTickets.length}
                </span>
              </div>

              {activeTickets.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
                  You don't have any active parking sessions.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                  {activeTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.ticketUid}
                      ticket={ticket}
                      formatDate={formatDate}
                      formatAmount={formatAmount}
                      onRequestExit={handleRequestExit}
                      requesting={
                        requestingTicketUid === ticket.ticketUid
                      }
                    />
                  ))}

                </div>
              )}

            </section>

            {/* Closed Tickets */}
            <section>

              <div className="mb-4 flex items-center gap-2">
                <CheckCircle size={21} className="text-purple-600" />

                <h3 className="text-xl font-bold text-gray-900">
                  Parking History
                </h3>

                <span className="rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                  {closedTickets.length}
                </span>
              </div>

              {closedTickets.length === 0 ? (
                <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">
                  Your completed parking sessions will appear here.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                  {closedTickets.map((ticket) => (
                    <TicketCard
                      key={ticket.ticketUid}
                      ticket={ticket}
                      formatDate={formatDate}
                      formatAmount={formatAmount}
                    />
                  ))}

                </div>
              )}

            </section>

          </div>
        )}

      </main>
    </div>
  );
}


// Summary Card
function SummaryCard({ title, value, icon, iconStyle }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            {value}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${iconStyle}`}>
          {icon}
        </div>

      </div>

    </div>
  );
}


// Ticket Card
function TicketCard({
  ticket,
  formatDate,
  formatAmount,
  onRequestExit,
  requesting,
}) {
  const navigate = useNavigate();

  const isActive = ticket.status === "ACTIVE";

  const requestStatus = ticket.exitRequestStatus;

  const isPending = requestStatus === "PENDING";

  const isRejected = requestStatus === "REJECTED";

  const viewTicket = () => {
    navigate(`/ticket/${encodeURIComponent(ticket.ticketUid)}`, {
      state: { ticket },
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-5">

        <div className="flex items-start gap-3">

          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <CarFront size={24} />
          </div>

          <div>
            <h4 className="font-bold text-gray-900">
              {ticket.vehicleNumber || "Unknown Vehicle"}
            </h4>

            <p className="mt-1 text-sm text-gray-500">
              {ticket.vehicleType || "Vehicle"}
            </p>

            <p className="mt-2 break-all text-xs text-gray-500">
              Ticket: {ticket.ticketUid}
            </p>
          </div>

        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            isActive
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {ticket.status}
        </span>

      </div>

      {/* Ticket Details */}
      <div className="grid grid-cols-2 gap-5 p-5">

        <Detail
          label="Slot Number"
          value={ticket.slotNumber || "N/A"}
        />

        <Detail
          label="Floor / Zone"
          value={`${ticket.floor ?? "N/A"} / ${ticket.zone || "N/A"}`}
        />

        <Detail
          label="Entry Time"
          value={formatDate(ticket.entryTime)}
        />

        <Detail
          label="Exit Time"
          value={formatDate(ticket.exitTime)}
        />

        {/* Parking Fee */}
        <div className="col-span-2 rounded-xl bg-gray-50 p-4">

          <p className="text-xs font-medium text-gray-500">
            {isActive ? "Parking Fee" : "Final Parking Fee"}
          </p>

          <p className="mt-1 flex items-center gap-1 text-xl font-bold text-gray-900">

            {isActive ? (
              <span className="text-sm font-medium text-gray-500">
                Calculated at exit
              </span>
            ) : (
              <>
                <IndianRupee size={19} />
                {formatAmount(ticket.amount).replace("₹", "")}
              </>
            )}

          </p>

        </div>

        {/* View Ticket */}
        <div className="col-span-2">

          <button
            onClick={viewTicket}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-blue-600 px-4 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            View Ticket
          </button>

        </div>

      </div>

      {/* Exit Request - Active Tickets Only */}
      {isActive && (
        <div className="border-t border-gray-100 p-5">

          {isPending ? (

            <button
              disabled
              className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-yellow-100 px-4 py-3 font-semibold text-yellow-700"
            >
              <Clock size={18} />
              Exit Request Pending
            </button>

          ) : (

            <button
              onClick={() => onRequestExit(ticket)}
              disabled={requesting}
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                isRejected
                  ? "bg-orange-600 hover:bg-orange-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              <LogOut size={18} />

              {requesting
                ? "Submitting Request..."
                : isRejected
                  ? "Request Exit Again"
                  : "Request Exit"}
            </button>

          )}

          {isRejected && (
            <p className="mt-2 text-center text-xs text-red-600">
              Your previous exit request was rejected. You can submit another request.
            </p>
          )}

        </div>
      )}

    </div>
  );
}


// Ticket Detail
function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-gray-800">
        {value}
      </p>
    </div>
  );
}

export default MyTickets;
