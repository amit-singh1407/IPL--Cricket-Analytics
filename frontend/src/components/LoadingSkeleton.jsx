export function DashboardSkeleton() {
  return (
    <div className="grid gap-4 animate-pulse">
      <div className="glass-panel h-56 rounded-[30px] border border-white/10 bg-white/5" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="glass-panel h-40 rounded-[26px] border border-white/10 bg-white/5" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="glass-panel h-80 rounded-[28px] border border-white/10 bg-white/5" />
        <div className="glass-panel h-80 rounded-[28px] border border-white/10 bg-white/5" />
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="glass-panel space-y-3 rounded-[28px] border border-white/10 bg-white/5 p-5 animate-pulse">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-4 rounded-full bg-white/10" />
      ))}
    </div>
  );
}
