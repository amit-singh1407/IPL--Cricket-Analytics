import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function PlayerChart({ theme, data = [] }) {
  const isDark = theme === 'dark';

  return (
    <div className={`${isDark ? 'glass-panel border-white/10 bg-slate-950/70 text-white' : 'glass-panel-light border-slate-200/70 bg-white/80 text-slate-900'} rounded-[28px] border p-5 shadow-soft`}>
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/80">Batting profile</p>
        <h3 className="mt-2 text-xl font-semibold">Top batting averages</h3>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#dbeafe'} opacity={0.45} />
            <XAxis dataKey="name" tick={{ fill: isDark ? '#cbd5e1' : '#334155', fontSize: 12 }} axisLine={false} tickLine={false} interval={0} />
            <YAxis tick={{ fill: isDark ? '#cbd5e1' : '#334155', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: isDark ? '#020617' : '#ffffff',
                border: isDark ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '16px',
                color: isDark ? '#fff' : '#0f172a',
              }}
            />
            <Bar dataKey="value" radius={[12, 12, 0, 0]} fill="url(#playerGradient)" />
            <defs>
              <linearGradient id="playerGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
