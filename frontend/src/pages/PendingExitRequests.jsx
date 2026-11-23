
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    CarFront,
    Clock,
    CheckCircle,
    XCircle,
    RefreshCw,
    MapPin,
    LogOut
} from "lucide-react";

import { apiFetch } from "../api/api";

export default function PendingExitRequests() {

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);

            const data = await apiFetch("/admin/exit-requests");
            setRequests(data);
        } catch (error) {
            toast.error(error.message || "Failed to fetch exit requests");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const handleAction = async (id, action) => {
        const actionName = action === "approve" ? "approve" : "reject";

        if (!window.confirm(`Are you sure you want to ${actionName} this request?`)) {
            return;
        }

        try {
            setProcessingId(id);

            await apiFetch(`/admin/exit-requests/${id}/${action}`, {
                method: "PUT"
            });

            toast.success(`Exit request ${actionName}d successfully`);
            await fetchRequests();

        } catch (error) {
            toast.error(error.message || `Failed to ${actionName} request`);
        } finally {
            setProcessingId(null);
        }
    };

    const formatDate = (date) => {
        if (!date) return "N/A";

        return new Date(date).toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 p-4 text-slate-100 sm:p-6 lg:p-8">

            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>
                        <h1 className="text-2xl font-bold sm:text-3xl">
                            Exit Requests
                        </h1>

                        <p className="mt-1 text-sm text-slate-400">
                            Review and manage vehicle exit requests.
                        </p>
                    </div>

                    <button
                        onClick={fetchRequests}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm transition hover:bg-slate-800 disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                        Refresh
                    </button>

                </div>

                {/* Request count */}
                <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 p-5">
                    <p className="text-sm text-slate-400">Pending Requests</p>
                    <p className="mt-1 text-3xl font-bold">{requests.length}</p>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="py-20 text-center text-slate-400">
                        Loading exit requests...
                    </div>
                ) : requests.length === 0 ? (

                    /* Empty state */
                    <div className="rounded-xl border border-slate-800 bg-slate-900 py-20 text-center">
                        <LogOut size={42} className="mx-auto mb-4 text-slate-500" />

                        <h2 className="text-lg font-semibold">
                            No Pending Exit Requests
                        </h2>

                        <p className="mt-2 text-sm text-slate-400">
                            New vehicle exit requests will appear here.
                        </p>
                    </div>

                ) : (

                    /* Request cards */
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                        {requests.map((request) => (

                            <div
                                key={request.id}
                                className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg"
                            >

                                <div className="mb-5 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="rounded-lg bg-blue-500/10 p-2 text-blue-400">
                                            <CarFront size={22} />
                                        </div>

                                        <div>
                                            <h3 className="font-semibold">
                                                {request.vehicleNumber}
                                            </h3>
                                            <p className="text-xs text-slate-400">
                                                {request.vehicleType}
                                            </p>
                                        </div>
                                    </div>

                                    <span className="rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                                        PENDING
                                    </span>
                                </div>

                                <div className="space-y-3 text-sm">

                                    <div className="flex justify-between gap-3">
                                        <span className="text-slate-400">Ticket ID</span>
                                        <span className="font-medium">{request.ticketUid}</span>
                                    </div>

                                    <div className="flex justify-between gap-3">
                                        <span className="text-slate-400">Slot</span>
                                        <span>{request.slotNumber}</span>
                                    </div>

                                    <div className="flex justify-between gap-3">
                                        <span className="text-slate-400">Floor / Zone</span>
                                        <span>{request.floor} / {request.zone}</span>
                                    </div>

                                    <div className="flex justify-between gap-3">
                                        <span className="text-slate-400">Entry Time</span>
                                        <span className="text-right">
                                            {formatDate(request.entryTime)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between gap-3">
                                        <span className="text-slate-400">Requested At</span>
                                        <span className="text-right">
                                            {formatDate(request.requestedAt)}
                                        </span>
                                    </div>

                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3">

                                    <button
                                        onClick={() => handleAction(request.id, "approve")}
                                        disabled={processingId !== null}
                                        className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-2.5 text-sm font-medium transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <CheckCircle size={16} />
                                        Approve
                                    </button>

                                    <button
                                        onClick={() => handleAction(request.id, "reject")}
                                        disabled={processingId !== null}
                                        className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-3 py-2.5 text-sm font-medium transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <XCircle size={16} />
                                        Reject
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </div>
        </div>
    );
}