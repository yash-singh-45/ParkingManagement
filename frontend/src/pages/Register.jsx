
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CarFront, UserRound, LockKeyhole, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { registerUser } from '../api/authApi'

function Register() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      await registerUser({ username, password })

      toast.success('Account created successfully!')
      navigate('/login')
    } catch (error) {
      toast.error(error.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-slate-700 bg-slate-900 py-3.5 pl-12 pr-12 text-white outline-none placeholder:text-slate-500 focus:border-blue-500'

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* Left panel */}
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
              Get started today
            </p>

            <h1 className="text-5xl font-bold leading-tight">
              Your parking, organized.
            </h1>

            <p className="mt-6 text-lg leading-8 text-blue-100">
              Create your account to access a smarter way to manage
              parking slots, vehicle entry, exit, and payments.
            </p>
          </div>

          <p className="relative text-sm text-blue-100">
            Parking Management System
          </p>
        </div>

        {/* Registration form */}
        <div className="flex items-center justify-center px-6 py-12 sm:px-12">
          <div className="w-full max-w-md">

            <div className="mb-8 flex items-center gap-3 lg:hidden">
              <div className="rounded-xl bg-blue-500/15 p-3 text-blue-400">
                <CarFront size={28} />
              </div>
              <span className="text-xl font-bold">ParkSmart</span>
            </div>

            <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
              Join ParkSmart
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Create your account
            </h2>

            <p className="mt-3 text-slate-400">
              Enter your details to get started.
            </p>

            <form onSubmit={handleRegister} className="mt-8 space-y-5">
              {/* Username */}
              <div>
                <label htmlFor="username" className="mb-2 block text-sm font-medium text-slate-300">
                  Username
                </label>

                <div className="relative">
                  <UserRound
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Choose a username"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputClass}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-slate-300">
                  Confirm password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Enter your password again"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={inputClass}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-blue-400 hover:text-blue-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
