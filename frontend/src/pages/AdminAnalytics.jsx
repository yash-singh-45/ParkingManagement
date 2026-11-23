import { useCallback, useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  IndianRupee,
  ParkingSquare,
  CarFront,
  TrendingUp,
  RefreshCw,
  Activity,
  LogOut,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { apiFetch } from "../api/api"; // Adjust this import to your project

const COLORS = ["#10b981", "#ef4444"];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = useCallback(async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      else setRefreshing(true);

      const response = await apiFetch("/admin/analytics");
      setData(response);
    } catch (error) {
      toast.error(error.message || "Failed to load analytics");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();

    const interval = setInterval(() => {
      fetchAnalytics(false);
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  const cards = data
    ? [
        {
          title: "Total Revenue",
          value: formatCurrency(data.totalRevenue),
          subtitle: "From closed tickets",
          icon: IndianRupee,
          color: "text-emerald-600",
          bg: "bg-emerald-50",
        },
        {
          title: "Total Parking Slots",
          value: data.totalSlots,
          subtitle: `${data.availableSlots} currently available`,
          icon: ParkingSquare,
          color: "text-blue-600",
          bg: "bg-blue-50",
        },
        {
          title: "Currently Parked",
          value: data.currentlyParked,
          subtitle: `${data.totalExits} completed exits`,
          icon: CarFront,
          color: "text-orange-600",
          bg: "bg-orange-50",
        },
        {
          title: "Occupancy Rate",
          value: `${data.occupancyPercentage}%`,
          subtitle: `${data.occupiedSlots} slots occupied`,
          icon: Activity,
          color: "text-purple-600",
          bg: "bg-purple-50",
        },
      ]
    : [];

  const floorChartData =
    data?.floorAnalytics?.map((floor) => ({
      floor: floor.floor,
      Available: floor.availableSlots,
      Occupied: floor.occupiedSlots,
    })) || [];

  const revenueChartData =
    data?.dailyRevenue?.map((item) => ({
      date: new Date(`${item.date}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      revenue: Number(item.revenue),
    })) || [];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <RefreshCw className="animate-spin text-blue-600" size={28} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-xl bg-white p-8 text-center shadow-sm">
        <p className="text-gray-600">Unable to load dashboard analytics.</p>
        <button
          onClick={() => fetchAnalytics()}
          className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const pieData = [
    { name: "Available", value: data.availableSlots },
    { name: "Occupied", value: data.occupiedSlots },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your parking facility
          </p>
        </div>

        <button
          onClick={() => fetchAnalytics(false)}
          disabled={refreshing}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-500">
                  {card.title}
                </p>
                <div className={`rounded-lg p-2.5 ${card.bg}`}>
                  <Icon className={card.color} size={21} />
                </div>
              </div>

              <h2 className="mt-4 text-2xl font-bold text-gray-900">
                {card.value}
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                {card.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Revenue Chart */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-6">
            <h2 className="font-bold text-gray-900">Revenue Overview</h2>
            <p className="text-sm text-gray-500">
              Daily revenue from the last 7 days
            </p>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `₹${value}`} />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                />
                <Bar
                  dataKey="revenue"
                  fill="#2563eb"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Floor Chart */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-6">
            <h2 className="font-bold text-gray-900">Floor-wise Occupancy</h2>
            <p className="text-sm text-gray-500">
              Available vs occupied parking slots
            </p>
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={floorChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="floor" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="Available"
                  fill="#10b981"
                  radius={[5, 5, 0, 0]}
                />
                <Bar
                  dataKey="Occupied"
                  fill="#ef4444"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Slot Distribution */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-gray-900">Slot Distribution</h2>
          <p className="mt-1 text-sm text-gray-500">
            Overall parking availability
          </p>

          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={95}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Floor Details */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-gray-900">Floor Details</h2>
          <p className="mt-1 text-sm text-gray-500">
            Parking capacity by floor
          </p>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3">Floor</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Available</th>
                  <th className="px-4 py-3">Occupied</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {data.floorAnalytics.map((floor) => (
                  <tr key={floor.floor} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">
                      {floor.floor}
                    </td>
                    <td className="px-4 py-3">{floor.totalSlots}</td>
                    <td className="px-4 py-3 text-emerald-600">
                      {floor.availableSlots}
                    </td>
                    <td className="px-4 py-3 text-red-600">
                      {floor.occupiedSlots}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}