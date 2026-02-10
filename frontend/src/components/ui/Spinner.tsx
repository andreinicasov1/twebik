export function Spinner({ label = 'Se încarcă...' }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-neon-300 py-6">
      <div className="w-4 h-4 rounded-full border-2 border-neon-400 border-t-transparent animate-spin" />
      <span>{label}</span>
    </div>
  );
}
