import { Star } from 'lucide-react';

export default function FavoriteTeams({ theme, teams = [] }) {
  const isDark = theme === 'dark';

  return (
    <section className={`${isDark ? 'glass-panel border-white/10 bg-slate-950/70 text-white' : 'glass-panel-light border-slate-200/70 bg-white/80 text-slate-900'} rounded-[28px] border p-5 shadow-soft`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/80">Favorites</p>
          <h3 className="mt-2 text-xl font-semibold">Preferred teams</h3>
        </div>
        <Star className="h-5 w-5 text-amber-300" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {teams.map((team) => (
          <span key={team} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
            {team}
          </span>
        ))}
      </div>
    </section>
  );
}
