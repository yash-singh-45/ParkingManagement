import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ArrowLeft, Plus, RefreshCw, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../api/api'

const VEHICLE_TYPES = ['CAR', 'BIKE', 'TRUCK']

function CreateSlots() {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const [form, setForm] = useState({
    slotNumber: '',
    floor: '',
    zone: '',
    slotType: 'CAR',
  })

  async function fetchSlots() {
    setLoading(true)

    try {
      const data = await apiFetch('/slots')
      setSlots(Array.isArray(data) ? data : data.content || [])
    } catch (error) {
      toast.error(error.message || 'Failed to load parking slots')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSlots()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    try {
      await apiFetch('/slots', {
        method: 'POST',
        body: JSON.stringify({
          slotNumber: form.slotNumber.trim(),
          floor: form.floor.trim(),
          zone: form.zone.trim(),
          slotType: form.slotType,
        }),
      })

      toast.success('Parking slot created successfully')

      setForm({
        slotNumber: '',
        floor: '',
        zone: '',
        slotType: 'CAR',
      })

      setShowForm(false)
      await fetchSlots()
    } catch (error) {
      toast.error(error.message || 'Failed to create parking slot')
    }
  }

  const filteredSlots = slots.filter((slot) => {
    const matchesSearch =
      slot.slotNumber?.toLowerCase().includes(search.toLowerCase()) ||
      slot.zone?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'ALL' || slot.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="min-h-screen bg-slate-50 p-5 md:p-8">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to Admin Dashboard
        </Link>

        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Parking Slot Management
            </h1>
            <p className="mt-2 text-slate-500">
              View and create parking slots.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchSlots}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-700 hover:bg-slate-100"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Slot
            </button>
          </div>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <h2 className="mb-5 text-xl font-semibold text-slate-900">
              Create Parking Slot
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Slot Number
                </label>
                <input
                  name="slotNumber"
                  value={form.slotNumber}
                  onChange={handleChange}
                  placeholder="e.g. A-001"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Floor
                </label>
                <input
                  name="floor"
                  value={form.floor}
                  onChange={handleChange}
                  placeholder="e.g. Ground"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Zone
                </label>
                <input
                  name="zone"
                  value={form.zone}
                  onChange={handleChange}
                  placeholder="e.g. A"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Vehicle Type
                </label>
                <select
                  name="slotType"
                  value={form.slotType}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
                >
                  {VEHICLE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
              >
                Create Slot
              </button>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-slate-200 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mb-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search slot number or zone..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <h2 className="font-semibold text-slate-900">All Parking Slots</h2>
            <span className="text-sm text-slate-500">
              {filteredSlots.length} slots
            </span>
          </div>

          {loading ? (
            <p className="p-8 text-center text-slate-500">Loading slots...</p>
          ) : filteredSlots.length === 0 ? (
            <p className="p-8 text-center text-slate-500">
              No parking slots found.
            </p>
          ) : (
            <div className="max-h-[400px] overflow-y-auto rounded-lg overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Slot Number</th>
                    <th className="px-6 py-4 font-medium">Vehicle Type</th>
                    <th className="px-6 py-4 font-medium">Floor</th>
                    <th className="px-6 py-4 font-medium">Zone</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredSlots.map((slot) => (
                    <tr key={slot.id ?? slot.slotNumber} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-slate-900">
                        {slot.slotNumber}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {slot.slotType}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {slot.floor}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {slot.zone}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            slot.status === 'AVAILABLE'
                              ? 'bg-emerald-100 text-emerald-700'
                              : slot.status === 'OCCUPIED'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {slot.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateSlots