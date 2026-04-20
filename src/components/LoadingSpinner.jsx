export default function LoadingSpinner({ fullPage = false }) {
  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    </div>
  )

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        {spinner}
      </div>
    )
  }

  return <div className="flex justify-center py-12">{spinner}</div>
}
