import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  User,
  ShieldBan,
  ShieldCheck,
  Car,
  Clock,
  IndianRupee,
  RefreshCw,
} from "lucide-react";

import { apiFetch } from "../api/api";

function UserProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [blacklisted, setBlacklisted] = useState(false);
  const [blacklistReason, setBlacklistReason] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  
  const fetchProfile = async () => {
    try {
      setLoading(true);

      const [userData, historyData, blacklistData] = await Promise.all([
        apiFetch(`/admin/users/${userId}`),
        apiFetch(`/admin/user/${userId}/history`),
        apiFetch("/admin/blacklisted-users"),
      ]);

      setUser(userData);
      setHistory(Array.isArray(historyData) ? historyData : []);

      const blacklistRecord = Array.isArray(blacklistData)
        ? blacklistData.find(
            (item) => Number(item.userId) === Number(userId)
          )
        : null;

      setBlacklisted(!!blacklistRecord);
      setBlacklistReason(blacklistRecord?.reason || "");
    } catch (error) {
      toast.error(error.message || "Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const handleBlacklist = async () => {
    if (!reason.trim()) {
      toast.error("Please enter a reason");
      return;
    }

    try {
      setActionLoading(true);

      await apiFetch("/admin/blacklisted-users", {
        method: "POST",
        body: JSON.stringify({
          userId: Number(userId),
          reason: reason.trim(),
        }),
      });

      toast.success("User blacklisted successfully");
      setReason("");
      await fetchProfile();
    } catch (error) {
      toast.error(error.message || "Failed to blacklist user");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnblacklist = async () => {
    if (!window.confirm("Are you sure you want to remove this user from the blacklist?")) {
      return;
    }

    try {
      setActionLoading(true);

      await apiFetch(`/admin/blacklisted-users/${userId}`, {
        method: "DELETE",
      });

      toast.success("User removed from blacklist");
      await fetchProfile();
    } catch (error) {
      toast.error(error.message || "Failed to remove user from blacklist");
    } finally {
      setActionLoading(false);
    }
  };

  const totalAmount = history.reduce(
    (sum, ticket) => sum + Number(ticket.amount || 0),
    0
  );

  const activeTickets = history.filter(
    (ticket) => ticket.status === "ACTIVE"
  ).length;

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const statusStyle = (status) => {
    return status === "ACTIVE"
      ? "bg-blue-100 text-blue-700"
      : "bg-green-100 text-green-700";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading user profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4">
        <p className="text-gray-600">User not found.</p>
        <button
          onClick={() => navigate("/admin/users")}
          className="text-teal-700 font-semibold"
        >
          Back to users
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <button
          onClick={() => navigate("/admin/users")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-teal-700"
        >
          <ArrowLeft size={18} />
          Back to Users
        </button>

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Profile
            </h1>
            <p className="text-gray-500 mt-2">
              View account details and complete parking history.
            </p>
          </div>

          <button
            onClick={fetchProfile}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border bg-white hover:bg-gray-50"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* User Details */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
              <User size={30} className="text-teal-700" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {user.username}
              </h2>
              <p className="text-gray-500 text-sm">
                User ID: {user.id}
              </p>
              <span className="inline-block mt-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3 text-gray-500">
              <Car size={22} className="text-teal-600" />
              Total Visits
            </div>
            <p className="text-3xl font-bold mt-3">{history.length}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3 text-gray-500">
              <IndianRupee size={22} className="text-green-600" />
              Total Amount
            </div>
            <p className="text-3xl font-bold mt-3">
              ₹{totalAmount.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3 text-gray-500">
              <Clock size={22} className="text-blue-600" />
              Currently Parked
            </div>
            <p className="text-3xl font-bold mt-3">{activeTickets}</p>
          </div>
        </div>

        {/* Parking History */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-5 border-b">
            <h2 className="text-xl font-bold text-gray-900">
              Parking History
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              All parking records associated with this user.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-sm text-gray-600">
                <tr>
                  <th className="px-5 py-4">Ticket ID</th>
                  <th className="px-5 py-4">Vehicle</th>
                  <th className="px-5 py-4">Slot</th>
                  <th className="px-5 py-4">Entry</th>
                  <th className="px-5 py-4">Exit</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {history.map((ticket) => (
                  <tr key={ticket.ticketUid} className="hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm font-medium">
                      {ticket.ticketUid}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium">{ticket.vehicleNumber}</p>
                      <p className="text-xs text-gray-500">
                        {ticket.vehicleType}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {ticket.slotNumber}
                      <p className="text-xs text-gray-500">
                        Floor {ticket.floor}, Zone {ticket.zone}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {formatDate(ticket.entryTime)}
                    </td>

                    <td className="px-5 py-4 text-sm">
                      {formatDate(ticket.exitTime)}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium">
                      ₹{Number(ticket.amount || 0).toFixed(2)}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {history.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-5 py-10 text-center text-gray-500">
                      No parking history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Blacklist Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Account Management
          </h2>

          {blacklisted ? (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <ShieldBan className="text-red-600" size={24} />
                <div>
                  <p className="font-semibold text-red-700">
                    This user is blacklisted.
                  </p>
                  <p className="text-sm text-gray-500">
                    Reason: {blacklistReason}
                  </p>
                </div>
              </div>

              <button
                onClick={handleUnblacklist}
                disabled={actionLoading}
                className="mt-3 flex items-center gap-2 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
              >
                <ShieldCheck size={18} />
                {actionLoading ? "Processing..." : "Remove from Blacklist"}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <ShieldCheck className="text-green-600" size={24} />
                <p className="font-medium text-green-700">
                  This user is not blacklisted.
                </p>
              </div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for blacklisting
              </label>

              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder="Enter the reason for blacklisting this user..."
                className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
              />

              <button
                onClick={handleBlacklist}
                disabled={actionLoading || !reason.trim()}
                className="mt-4 flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                <ShieldBan size={18} />
                {actionLoading ? "Processing..." : "Blacklist User"}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default UserProfile;