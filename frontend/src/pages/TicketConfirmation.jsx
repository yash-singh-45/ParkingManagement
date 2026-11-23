import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CarFront,
  CheckCircle,
  Clock,
  MapPin,
  ParkingCircle,
  Ticket,
} from "lucide-react";

import { QRCodeSVG } from "qrcode.react";

import { apiFetch } from "../api/api";

function TicketConfirmation() {
  const { ticketUid } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchTicket() {
      try {
        setLoading(true);
        setError("");
        setTicket(null);

        const data = await apiFetch(`/tickets/${ticketUid}`);

        console.log("Fetched ticket:", data);

        if (!cancelled) {
          setTicket(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to fetch ticket details.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (ticketUid) {
      fetchTicket();
    } else {
      setError("Ticket UID is missing from the URL.");
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [ticketUid]);

  const formatDate = (dateTime) => {
    if (!dateTime) return "—";

    const date = new Date(dateTime);

    if (Number.isNaN(date.getTime())) {
      return dateTime;
    }

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white print:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-2 text-white">
              <ParkingCircle size={25} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900">ParkSmart</h1>
              <p className="text-xs text-gray-500">Parking Management System</p>
            </div>
          </Link>

          <Link
            to="/my-tickets"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            My Tickets
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="mt-4 font-medium text-gray-700">
              Loading ticket details...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <Ticket size={42} className="mx-auto text-red-400" />

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Unable to load ticket
            </h2>

            <p className="mt-2 text-sm text-red-600">{error}</p>

            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() => window.location.reload()}
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Try Again
              </button>

              <Link
                to="/my-tickets"
                className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                View My Tickets
              </Link>
            </div>
          </div>
        )}

        {/* Empty response */}
        {!loading && !error && !ticket && (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <Ticket size={42} className="mx-auto text-gray-300" />

            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Ticket details unavailable
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              The server did not return ticket details.
            </p>

            <Link
              to="/my-tickets"
              className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              View My Tickets
            </Link>
          </div>
        )}

        {/* Ticket details */}
        {!loading && !error && ticket && (
          <>
            {/* Success message */}
            <div className="mb-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle size={36} />
              </div>

              <h2 className="mt-5 text-2xl font-bold text-gray-900 sm:text-3xl">
                Vehicle Entry Successful!
              </h2>

              <p className="mt-2 text-gray-600">
                Your vehicle has been registered. Keep your ticket UID for exit.
              </p>
            </div>

            {/* Ticket card */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-4 bg-blue-600 px-6 py-5 text-white">
                <div className="flex items-center gap-3">
                  <Ticket size={26} />

                  <div>
                    <h3 className="text-lg font-bold">Parking Ticket</h3>
                    <p className="text-sm text-blue-100">ParkSmart receipt</p>
                  </div>
                </div>

                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  {ticket.status || "ACTIVE"}
                </span>
              </div>

              <div className="p-6 sm:p-8">
                {/* Ticket UID */}
                <div className="mb-7 rounded-xl border border-dashed flex gap-3 flex-col border-blue-300 bg-blue-50 p-5 text-center items-center ">
                  <p className="text-sm font-medium text-blue-700">
                    Your Ticket ID
                  </p>

                  <QRCodeSVG value={JSON.stringify(ticket)} />

                  <p className="mt-2 text-xs text-gray-500">
                    Keep this qr for your parking exit.
                  </p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <TicketField
                    icon={<CarFront size={19} />}
                    label="Vehicle Number"
                    value={ticket.vehicleNumber}
                  />

                  <TicketField
                    icon={<CarFront size={19} />}
                    label="Vehicle Type"
                    value={ticket.vehicleType}
                  />

                  <TicketField
                    icon={<ParkingCircle size={19} />}
                    label="Slot Number"
                    value={ticket.slotNumber}
                  />

                  <TicketField
                    icon={<MapPin size={19} />}
                    label="Floor / Zone"
                    value={`${ticket.floor ?? "N/A"} / ${ticket.zone ?? "N/A"}`}
                  />

                  <TicketField
                    icon={<Clock size={19} />}
                    label="Entry Time"
                    value={formatDate(ticket.entryTime)}
                  />

                  <TicketField
                    icon={<Clock size={19} />}
                    label="Exit Time"
                    value={formatDate(ticket.exitTime)}
                  />
                </div>

                {/* Parking fee */}
                <div className="mt-7 rounded-xl bg-gray-50 p-4">
                  <p className="text-sm text-gray-500">Parking Fee</p>

                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {ticket.amount == null
                      ? "To be calculated at exit"
                      : `₹${Number(ticket.amount).toFixed(2)}`}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 border-t border-gray-100 p-6 sm:flex-row sm:justify-between print:hidden">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <ArrowLeft size={18} />
                  Dashboard
                </button>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handlePrint}
                    className="rounded-xl border border-blue-600 px-5 py-3 font-semibold text-blue-600 hover:bg-blue-50"
                  >
                    Print Ticket
                  </button>

                  <Link
                    to="/my-tickets"
                    className="rounded-xl bg-blue-600 px-5 py-3 text-center font-semibold text-white hover:bg-blue-700"
                  >
                    My Tickets
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function TicketField({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-blue-600">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="mt-1 break-words font-semibold text-gray-900">
          {value ?? "N/A"}
        </p>
      </div>
    </div>
  );
}

export default TicketConfirmation;
