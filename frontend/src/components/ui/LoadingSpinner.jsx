export default function LoadingSpinner({ label = "Loading…" }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-12"
      role="status"
      aria-live="polite"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-600 border-t-cyan-400" />
      <span className="text-sm text-slate-400">{label}</span>
    </div>
  );
}

