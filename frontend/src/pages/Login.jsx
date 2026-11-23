import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../api/authApi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CarFront, Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { getDashboardPath } from "../utils/roleRedirect";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginUser({ username, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("role", data.role);

      toast.success("Login successful!");
      navigate(getDashboardPath(data.role));
    } catch (error) {
      toast.error(error.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left section */}
        <div className="relative hidden overflow-hidden bg-blue-600 p-12 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-slate-950/20 blur-3xl" />

          <div className="relative flex items-center gap-3">
            <div className="rounded-xl bg-white/15 p-3">
              <CarFront size={28} />
            </div>
            <span className="text-xl font-bold">ParkSmart</span>
          </div>

          <div className="relative max-w-lg">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">
              Smart parking solutions
            </p>
            <h1 className="text-5xl font-bold leading-tight">
              Parking made simple.
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Manage parking slots, track vehicle entry and exit, and keep
              everything organized from one place.
            </p>
          </div>

          <p className="relative text-sm text-blue-100">
            Parking Management System
          </p>
        </div>

        {/* Login form */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-md">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="rounded-xl bg-blue-500/15 p-3 text-blue-400">
                <CarFront size={28} />
              </div>
              <span className="text-xl font-bold">ParkSmart</span>
            </div>

            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Welcome back
            </p>

            <h2 className="mt-3 text-3xl font-bold">Sign in to your account</h2>

            <p className="mt-3 text-slate-400">
              Enter your credentials to access the parking dashboard.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleLogin}>
              <div>
                <label
                  htmlFor="username"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Username
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 focus-within:border-blue-500">
                  <UserRound size={19} className="text-slate-400" />

                  <input
                    id="username"
                    name="username"
                    value={username}
                    type="text"
                    placeholder="Enter your username"
                    autoComplete="username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full bg-transparent py-3.5 text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-900 px-4 focus-within:border-blue-500">
                  <LockKeyhole size={19} className="text-slate-400" />

                  <input
                    id="password"
                    value={password}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-transparent py-3.5 text-white outline-none placeholder:text-slate-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-white"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold transition hover:bg-blue-500 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-400 hover:text-blue-300"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
