import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function VenueChart({ theme, data = [] }) {
  const isDark = theme === 'dark';

  return (
    <div className={`${isDark ? 'glass-panel border-white/10 bg-slate-950/70 text-white' : 'glass-panel-light border-slate-200/70 bg-white/80 text-slate-900'} rounded-[28px] border p-5 shadow-soft`}>
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/80">Venue analysis</p>
        <h3 className="mt-2 text-xl font-semibold">Best-performing grounds</h3>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#dbeafe'} opacity={0.45} />
            <XAxis type="number" tick={{ fill: isDark ? '#cbd5e1' : '#334155', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <YAxis type="category" dataKey="name" tick={{ fill: isDark ? '#cbd5e1' : '#334155', fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
            <Tooltip
              contentStyle={{
                background: isDark ? '#020617' : '#ffffff',
                border: isDark ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '16px',
                color: isDark ? '#fff' : '#0f172a',
              }}
              itemStyle={{
                color: isDark ? '#f8fafc' : '#0f172a'
              }}
            />
            <Bar dataKey="value" radius={[0, 12, 12, 0]} fill="#38bdf8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
