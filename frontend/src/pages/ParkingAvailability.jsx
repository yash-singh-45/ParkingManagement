
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    CarFront,
    Bike,
    Truck,
    RefreshCw,
    ParkingSquare,
    MapPin,
    Clock,
    Activity
} from "lucide-react";

import { apiFetch } from "../api/api";

export default function ParkingAvailability() {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);

    const [floorFilter, setFloorFilter] = useState("ALL");
    const [zoneFilter, setZoneFilter] = useState("ALL");
    const [typeFilter, setTypeFilter] = useState("ALL");

    const fetchAvailability = useCallback(async (showLoader = false) => {
        try {
            if (showLoader) setLoading(true);

            const response = await apiFetch("/slots/availability");

            setData(response);
            setLastUpdated(new Date());

        } catch (error) {
            toast.error(error.message || "Failed to fetch parking availability");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAvailability(true);

        const interval = setInterval(() => {
            fetchAvailability(false);
        }, 10000);

        return () => clearInterval(interval);
    }, [fetchAvailability]);

    const slots = data?.slots || [];

    const floors = [...new Set(slots.map(slot => slot.floor))];
    const zones = [...new Set(slots.map(slot => slot.zone))];

    const filteredSlots = slots.filter(slot => {
        return (
            (floorFilter === "ALL" || slot.floor === floorFilter) &&
            (zoneFilter === "ALL" || slot.zone === zoneFilter) &&
            (typeFilter === "ALL" || slot.slotType === typeFilter)
        );
    });

    const getVehicleIcon = (type) => {
        switch (type) {
            case "CAR":
                return CarFront;
            case "BIKE":
                return Bike;
            case "TRUCK":
                return Truck;
            default:
                return ParkingSquare;
        }
    };

    const formatTime = (date) => {
        if (!date) return "Not updated";

        return date.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>
                        <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                            Live Parking Availability
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Monitor parking occupancy across all floors and zones.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
                            Auto refresh: 10 sec
                        </div>

                        <button
                            onClick={() => fetchAvailability(true)}
                            disabled={loading}
                            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                        >
                            <RefreshCw
                                size={16}
                                className={loading ? "animate-spin" : ""}
                            />
                            Refresh
                        </button>

                    </div>
                </div>

                {/* Summary Cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <StatCard
                        title="Total Slots"
                        value={data?.totalSlots ?? 0}
                        icon={ParkingSquare}
                        color="blue"
                    />

                    <StatCard
                        title="Available Slots"
                        value={data?.availableSlots ?? 0}
                        icon={Activity}
                        color="green"
                    />

                    <StatCard
                        title="Occupied Slots"
                        value={data?.occupiedSlots ?? 0}
                        icon={CarFront}
                        color="red"
                    />

                    <StatCard
                        title="Occupancy"
                        value={`${data?.occupancyPercentage ?? 0}%`}
                        icon={Activity}
                        color="purple"
                    />

                </div>

                {/* Occupancy Progress */}
                <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="font-semibold text-slate-800">
                            Overall Occupancy
                        </h2>

                        <span className="font-bold text-slate-800">
                            {data?.occupancyPercentage ?? 0}%
                        </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-blue-600 transition-all duration-500"
                            style={{
                                width: `${Math.min(data?.occupancyPercentage ?? 0, 100)}%`
                            }}
                        />
                    </div>

                    <div className="mt-3 flex justify-between text-xs text-slate-500">
                        <span>{data?.occupiedSlots ?? 0} Occupied</span>
                        <span>{data?.availableSlots ?? 0} Available</span>
                    </div>

                </div>

                {/* Filters */}
                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="mb-4 flex items-center gap-2">
                        <Activity size={18} className="text-slate-500" />
                        <h2 className="font-semibold text-slate-800">
                            Filter Parking Slots
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                        <FilterSelect
                            label="Floor"
                            value={floorFilter}
                            onChange={setFloorFilter}
                            options={floors}
                        />

                        <FilterSelect
                            label="Zone"
                            value={zoneFilter}
                            onChange={setZoneFilter}
                            options={zones}
                        />

                        <FilterSelect
                            label="Vehicle Type"
                            value={typeFilter}
                            onChange={setTypeFilter}
                            options={["CAR", "BIKE", "TRUCK"]}
                        />

                    </div>
                </div>

                {/* Slot Layout */}
                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">
                                Parking Slot Layout
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Showing {filteredSlots.length} of {slots.length} slots
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4 text-xs">

                            <span className="flex items-center gap-2 text-slate-600">
                                <span className="h-3 w-3 rounded bg-green-500" />
                                Available
                            </span>

                            <span className="flex items-center gap-2 text-slate-600">
                                <span className="h-3 w-3 rounded bg-red-500" />
                                Occupied
                            </span>

                        </div>
                    </div>

                    {loading && !data ? (

                        <div className="py-16 text-center text-slate-500">
                            Loading parking slots...
                        </div>

                    ) : filteredSlots.length === 0 ? (

                        <div className="py-16 text-center text-slate-500">
                            No parking slots found for the selected filters.
                        </div>

                    ) : (

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">

                            {filteredSlots.map(slot => {

                                const VehicleIcon = getVehicleIcon(slot.slotType);

                                const occupied = slot.status === "OCCUPIED";

                                return (
                                    <div
                                        key={slot.slotNumber}
                                        className={`rounded-xl border p-4 transition hover:shadow-md ${
                                            occupied
                                                ? "border-red-200 bg-red-50"
                                                : "border-green-200 bg-green-50"
                                        }`}
                                    >

                                        <div className="mb-3 flex items-center justify-between">

                                            <VehicleIcon
                                                size={22}
                                                className={
                                                    occupied
                                                        ? "text-red-600"
                                                        : "text-green-600"
                                                }
                                            />

                                            <span
                                                className={`h-2.5 w-2.5 rounded-full ${
                                                    occupied
                                                        ? "bg-red-500"
                                                        : "bg-green-500"
                                                }`}
                                            />

                                        </div>

                                        <h3 className="font-bold text-slate-800">
                                            {slot.slotNumber}
                                        </h3>

                                        <p className="mt-1 text-xs text-slate-500">
                                            {slot.slotType}
                                        </p>

                                        <div className="mt-3 border-t border-slate-200 pt-2">

                                            <p className="text-xs text-slate-500">
                                                {slot.floor} Floor
                                            </p>

                                            <p
                                                className={`mt-1 text-xs font-semibold ${
                                                    occupied
                                                        ? "text-red-600"
                                                        : "text-green-600"
                                                }`}
                                            >
                                                {occupied ? "Occupied" : "Available"}
                                            </p>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>
                    )}

                </div>

                {/* Last Updated */}
                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
                    <Clock size={14} />
                    Last updated: {formatTime(lastUpdated)}
                </div>

            </div>
        </div>
    );
}


/* Summary Card */
function StatCard({ title, value, icon: Icon, color }) {

    const colors = {
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        red: "bg-red-100 text-red-600",
        purple: "bg-purple-100 text-purple-600"
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex items-center justify-between">

                <div>
                    <p className="text-sm text-slate-500">{title}</p>

                    <h2 className="mt-2 text-3xl font-bold text-slate-800">
                        {value}
                    </h2>
                </div>

                <div className={`rounded-xl p-3 ${colors[color]}`}>
                    <Icon size={24} />
                </div>

            </div>

        </div>
    );
}


/* Filter Dropdown */
function FilterSelect({ label, value, onChange, options }) {

    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-600">
                {label}
            </label>

            <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >

                <option value="ALL">All {label}s</option>

                {options.map(option => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}

            </select>
        </div>
    );
}