import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ArrowLeft, Search, Users, RefreshCw } from "lucide-react";
import { apiFetch } from "../api/api";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await apiFetch("/admin/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = user.username
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesRole = selectedRole === "ALL" || user.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [users, search, selectedRole]);

  const roleStyle = (role) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-700";
      case "OPERATOR":
        return "bg-blue-100 text-blue-700";
      case "MANAGER":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/admin"
          className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-teal-700"
        >
          <ArrowLeft size={18} />
          Back to Admin Dashboard
        </Link>

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="mt-2 text-gray-500">
              View and search registered accounts.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <Users className="text-teal-600" size={24} />
              <p className="text-sm text-gray-500">Total Users</p>
            </div>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {users.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Administrators</p>
            <p className="mt-3 text-3xl font-bold text-purple-700">
              {users.filter((user) => user.role === "ADMIN").length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Regular Users</p>
            <p className="mt-3 text-3xl font-bold text-gray-900">
              {users.filter((user) => user.role === "USER").length}
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by username..."
              className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          <select
            value={selectedRole}
            onChange={(event) => setSelectedRole(event.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-teal-500"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="OPERATOR">Operator</option>
            <option value="MANAGER">Manager</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          {loading ? (
            <p className="p-8 text-center text-gray-500">Loading users...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 text-sm text-gray-600">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Username</th>
                    <th className="px-6 py-4">Role</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={() => {
                        console.log("Clicked user:", user.id);
                        navigate(`/admin/users/${user.id}`);
                      }}
                      className="cursor-pointer hover:bg-teal-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-500">{user.id}</td>

                      <td className="px-6 py-4 font-medium text-gray-900">
                        {user.username}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${roleStyle(user.role)}`}
                        >
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserManagement;
