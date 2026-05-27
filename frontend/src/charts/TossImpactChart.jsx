import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts';

const COLORS = ['#22d3ee', '#34d399', '#f59e0b', '#ef4444'];

export default function TossImpactChart({ theme, data = [] }) {
  const isDark = theme === 'dark';

  return (
    <div className={`${isDark ? 'glass-panel border-white/10 bg-slate-950/70 text-white' : 'glass-panel-light border-slate-200/70 bg-white/80 text-slate-900'} rounded-[28px] border p-5 shadow-soft`}>
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/80">Toss impact</p>
        <h3 className="mt-2 text-xl font-semibold">Decision split</h3>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: isDark ? '#020617' : '#ffffff',
                border: isDark ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '16px',
                color: isDark ? '#fff' : '#0f172a',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
