export default function EmptyState({ icon = '🔍', message }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-5xl mb-4">{icon}</span>
      <p className="text-gray-500 text-sm max-w-xs leading-relaxed">{message}</p>
    </div>
  )
}
