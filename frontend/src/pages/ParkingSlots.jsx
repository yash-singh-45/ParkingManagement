
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Search,
  RefreshCw,
  ParkingSquare,
  AlertCircle,
} from 'lucide-react'
import { apiFetch } from '../api/api'

function ParkingSlots() {
  const navigate = useNavigate()

  const [slots, setSlots] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchSlots() {
    setLoading(true)
    setError('')

    try {
      const data = await apiFetch('/slots')
      const list = Array.isArray(data) ? data : data?.content

      if (!Array.isArray(list)) {
        throw new Error('Unexpected response from the slots API.')
      }

      setSlots(list)
    } catch (err) {
      setError(err.message || 'Unable to load parking slots.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlots()
  }, [])

  const vehicleTypes = useMemo(
    () => [...new Set(slots.map((slot) => slot.slotType).filter(Boolean))],
    [slots],
  )

  const filteredSlots = slots.filter((slot) => {
    const matchesSearch = (slot.slotNumber ?? '')
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'ALL' || slot.status === statusFilter

    const matchesType =
      typeFilter === 'ALL' || slot.slotType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const statusStyle = (status) => {
    if (status === 'AVAILABLE') {
      return 'bg-emerald-500/10 text-emerald-400'
    }

    if (status === 'OCCUPIED') {
      return 'bg-amber-500/10 text-amber-400'
    }

    return 'bg-slate-700 text-slate-300'
  }

  return (
    <div className="min-h-screen bg-slate-950 p-5 text-white sm:p-8">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          Back to dashboard
        </button>

        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-500/15 p-3 text-blue-400">
                <ParkingSquare size={25} />
              </div>
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">
                  Parking Slots
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Browse and filter your parking spaces.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={fetchSlots}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm transition hover:bg-slate-800 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? 'animate-spin' : ''}
            />
            Refresh
          </button>
        </header>

        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-400">Total Slots</p>
            <p className="mt-3 text-3xl font-bold">{slots.length}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-400">Available</p>
            <p className="mt-3 text-3xl font-bold text-emerald-400">
              {slots.filter((slot) => slot.status === 'AVAILABLE').length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
            <p className="text-sm text-slate-400">Occupied</p>
            <p className="mt-3 text-3xl font-bold text-amber-400">
              {slots.filter((slot) => slot.status === 'OCCUPIED').length}
            </p>
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
          <div className="flex flex-col gap-4 border-b border-slate-800 p-5 lg:flex-row lg:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search slot number..."
                className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-sm outline-none placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="ALL">All statuses</option>
              <option value="AVAILABLE">Available</option>
              <option value="OCCUPIED">Occupied</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-blue-500"
            >
              <option value="ALL">All vehicle types</option>
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="m-5 flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
              <AlertCircle size={19} />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-slate-400">
              Loading parking slots...
            </div>
          ) : !error && filteredSlots.length === 0 ? (
            <div className="p-12 text-center">
              <ParkingSquare
                size={34}
                className="mx-auto text-slate-600"
              />
              <p className="mt-3 font-medium">No matching slots</p>
              <p className="mt-1 text-sm text-slate-400">
                Try changing your search or filters.
              </p>
            </div>
          ) : !error ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-800/50 text-slate-400">
                  <tr>
                    <th className="px-5 py-4 font-medium">Slot</th>
                    <th className="px-5 py-4 font-medium">Vehicle Type</th>
                    <th className="px-5 py-4 font-medium">Floor</th>
                    <th className="px-5 py-4 font-medium">Zone</th>
                    <th className="px-5 py-4 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {filteredSlots.map((slot) => (
                    <tr
                      key={slot.id ?? slot.slotNumber}
                      className="transition hover:bg-slate-800/30"
                    >
                      <td className="whitespace-nowrap px-5 py-4 font-semibold">
                        {slot.slotNumber ?? `#${slot.id}`}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-300">
                        {slot.slotType ?? '—'}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-300">
                        {slot.floor ?? '—'}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-300">
                        {slot.zone ?? '—'}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle(slot.status)}`}
                        >
                          {slot.status ?? 'UNKNOWN'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}

          {!loading && !error && (
            <div className="border-t border-slate-800 px-5 py-4 text-xs text-slate-500">
              Showing {filteredSlots.length} of {slots.length} slots
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default ParkingSlots
