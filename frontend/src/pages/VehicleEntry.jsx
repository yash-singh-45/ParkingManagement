
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  CarFront,
  Bike,
  Truck,
  ParkingCircle,
  LogOut,
} from "lucide-react";

import { apiFetch } from "../api/api";
const VEHICLE_TYPES = ["CAR", "BIKE", "TRUCK"];

function VehicleEntry() {
  const navigate = useNavigate();

  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("CAR");
  const [submitting, setSubmitting] = useState(false);

  const username = localStorage.getItem("username") || "User";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    navigate("/login", { replace: true });
  };

  const handleEntry = async (event) => {
    event.preventDefault();

    const formattedNumber = vehicleNumber.trim().toUpperCase();

    if (!formattedNumber) {
      toast.error("Please enter your vehicle number");
      return;
    }

    try {
      setSubmitting(true);

      const response = await apiFetch("/parking/entry", {
        method: "POST",
        body: JSON.stringify({
          vehicleNumber: formattedNumber,
          vehicleType,
        }),
      });

      console.log("Response");
      console.log(response);
      
      
      toast.success("Vehicle entry registered successfully");

      navigate(`/ticket/${encodeURIComponent(response.ticketUid)}`);
    } catch (error) {
      toast.error(error.message || "Vehicle entry failed");
    } finally {
      setSubmitting(false);
    }
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

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-blue-600 px-6 py-7 text-white sm:px-8">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white/15 p-3">
                <CarFront size={28} />
              </div>

              <div>
                <h2 className="text-2xl font-bold">Vehicle Entry</h2>
                <p className="mt-1 text-sm text-blue-100">
                  Welcome, {username}. Register your vehicle to get started.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleEntry} className="space-y-6 p-6 sm:p-8">
            {/* Vehicle Number */}
            <div>
              <label
                htmlFor="vehicleNumber"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Vehicle Registration Number
              </label>

              <input
                id="vehicleNumber"
                type="text"
                value={vehicleNumber}
                onChange={(event) =>
                  setVehicleNumber(event.target.value.toUpperCase())
                }
                placeholder="e.g. UP16AB1234"
                maxLength={15}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 uppercase outline-none transition placeholder:normal-case focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-2 text-xs text-gray-500">
                Enter your vehicle number as shown on its registration plate.
              </p>
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Vehicle Type
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {VEHICLE_TYPES.map((type) => {
                  const Icon =
                    type === "CAR"
                      ? CarFront
                      : type === "BIKE"
                        ? Bike
                        : Truck;

                  const selected = vehicleType === type;

                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setVehicleType(type)}
                      className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-4 font-medium transition ${
                        selected
                          ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                          : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={22} />
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CarFront size={20} />
              {submitting ? "Registering Vehicle..." : "Register Vehicle"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-gray-500">
          Already parked your vehicle?{" "}
          <Link
            to="/my-tickets"
            className="font-semibold text-blue-600 hover:text-blue-700"
          >
            View My Tickets
          </Link>
        </p>
      </main>
    </div>
  );
}

export default VehicleEntry;
