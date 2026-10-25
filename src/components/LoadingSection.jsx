export default function LoadingSection() {
  return (
    <div className="section py-20 text-center">
      <div className="inline-block w-10 h-10 border-4 border-coral/30 border-t-coral rounded-full animate-spin" role="status" aria-label="載入中" />
      <p className="mt-4 text-muted">載入更多內容…</p>
    </div>
  )
}
