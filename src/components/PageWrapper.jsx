export default function PageWrapper({ children, className = '' }) {
  return <main className={`max-w-7xl mx-auto px-4 py-6 ${className}`}>{children}</main>
}
