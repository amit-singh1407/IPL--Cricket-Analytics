import { ArrowUpRight } from 'lucide-react';

export default function StatCard({ theme, label, value, description, trend, icon: Icon, accent = 'from-cyan-400 to-emerald-400' }) {
  const isDark = theme === 'dark';
  const shellClass = isDark
    ? 'border-white/10 bg-slate-950/70 text-white'
    : 'border-slate-200/70 bg-white/80 text-slate-900';

  return (
    <article className={`${shellClass} glass-panel group relative overflow-hidden rounded-[26px] border p-5 shadow-soft transition duration-300 hover:-translate-y-1`}>
      <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`} />
      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-cyan-300/80">{label}</p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight">{value}</h3>
          <p className={`mt-2 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{description}</p>
        </div>
        {Icon ? (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-cyan-300 ring-1 ring-white/10">
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      <div className={`mt-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${isDark ? 'bg-white/5 text-cyan-200' : 'bg-cyan-50 text-cyan-700'}`}>
        <ArrowUpRight className="h-3.5 w-3.5" />
        {trend}
      </div>
    </article>
  );
}
