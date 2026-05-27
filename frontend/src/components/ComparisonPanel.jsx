import { ArrowRightLeft } from 'lucide-react';

function MetricBar({ label, left, right, max = 100, theme }) {
  const isDark = theme === 'dark';
  const leftWidth = Math.max(Math.min((left / max) * 100, 100), 0);
  const rightWidth = Math.max(Math.min((right / max) * 100, 100), 0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-slate-400">
        <span>{label}</span>
        <span>{Math.abs(left - right).toFixed(1)}</span>
      </div>
      <div className={`grid grid-cols-2 overflow-hidden rounded-full ${isDark ? 'bg-white/5' : 'bg-slate-100'}`}>
        <div className="h-3 rounded-full bg-cyan-400/80" style={{ width: `${leftWidth}%` }} />
        <div className="h-3 rounded-full bg-emerald-400/80" style={{ width: `${rightWidth}%` }} />
      </div>
    </div>
  );
}

export default function ComparisonPanel({ theme, left, right, title = 'Head-to-head comparison', subtitle = 'A clean side-by-side view of key metrics.' }) {
  const isDark = theme === 'dark';
  const panelClass = isDark ? 'glass-panel border-white/10 bg-slate-950/70 text-white' : 'glass-panel-light border-slate-200/70 bg-white/80 text-slate-900';

  if (!left || !right) {
    return (
      <section className={`${panelClass} rounded-[28px] border p-5 shadow-soft`}>
        <div className="flex items-center gap-3 text-cyan-300">
          <ArrowRightLeft className="h-5 w-5" />
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <p className="mt-3 text-sm text-slate-400">{subtitle}</p>
      </section>
    );
  }

  const metrics = [
    { label: 'Win %', left: left.winPercentage || left.battingAverage || 0, right: right.winPercentage || right.battingAverage || 0 },
    { label: 'Runs', left: left.runs || left.played || 0, right: right.runs || right.played || 0 },
    { label: 'Strike Rate', left: left.strikeRate || left.tossImpact || 0, right: right.strikeRate || right.tossImpact || 0 },
    { label: 'Consistency', left: left.consistency || 0, right: right.consistency || 0 },
  ];

  return (
    <section className={`${panelClass} rounded-[28px] border p-5 shadow-soft`}>
      <div className="flex items-center gap-3 text-cyan-300">
        <ArrowRightLeft className="h-5 w-5" />
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-slate-400">{subtitle}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <article className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/80">Left</p>
          <h4 className="mt-2 text-2xl font-semibold">{left.name || left.team || 'Selection A'}</h4>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
            {Object.entries(left).slice(0, 4).map(([key, value]) => (
              <div key={key}>
                <dt className="text-slate-400">{key}</dt>
                <dd className="font-medium text-white">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </article>
        <article className="rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 p-4">
          <p className="text-xs uppercase tracking-[0.32em] text-emerald-200/80">Right</p>
          <h4 className="mt-2 text-2xl font-semibold">{right.name || right.team || 'Selection B'}</h4>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-300">
            {Object.entries(right).slice(0, 4).map(([key, value]) => (
              <div key={key}>
                <dt className="text-slate-400">{key}</dt>
                <dd className="font-medium text-white">{String(value)}</dd>
              </div>
            ))}
          </dl>
        </article>
      </div>

      <div className="mt-6 space-y-4">
        {metrics.map((metric) => (
          <MetricBar key={metric.label} label={metric.label} left={metric.left} right={metric.right} theme={theme} />
        ))}
      </div>
    </section>
  );
}
