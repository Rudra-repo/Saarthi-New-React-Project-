const STATUS_MAP = {
  saved: { label: 'Saved', bg: 'bg-gray-100', text: 'text-gray-700' },
  applied: { label: 'Applied', bg: 'bg-blue-100', text: 'text-blue-700' },
  pending: { label: 'Pending', bg: 'bg-amber-100', text: 'text-amber-700' },
  received: { label: 'Received', bg: 'bg-green-100', text: 'text-green-700' },
}

export default function StatusBadge({ status }) {
  const state = STATUS_MAP[status] || STATUS_MAP.saved

  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${state.bg} ${state.text}`}>
      {state.label}
    </span>
  )
}
