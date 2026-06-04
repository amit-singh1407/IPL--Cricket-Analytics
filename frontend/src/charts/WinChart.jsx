import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function WinChart({ theme, data = [] }) {
  const isDark = theme === 'dark';

  return (
    <div className={`${isDark ? 'glass-panel border-white/10 bg-slate-950/70 text-white' : 'glass-panel-light border-slate-200/70 bg-white/80 text-slate-900'} rounded-[28px] border p-5 shadow-soft`}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/80">Win trend</p>
          <h3 className="mt-2 text-xl font-semibold">Team win percentage</h3>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="winGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#dbeafe'} opacity={0.45} />
            <XAxis dataKey="name" tick={{ fill: isDark ? '#cbd5e1' : '#334155', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: isDark ? '#cbd5e1' : '#334155', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
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
            <Area type="monotone" dataKey="value" stroke="#22d3ee" fill="url(#winGradient)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
