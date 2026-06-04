import { Menu, SunMedium, MoonStar, Bell } from 'lucide-react';

export default function Navbar({ theme, onToggleTheme, onMenuToggle }) {
  const isDark = theme === 'dark';
  const shellClass = isDark ? 'glass-panel text-white' : 'glass-panel-light text-slate-900';

  return (
    <header className="sticky top-0 z-30 px-4 pt-4 lg:px-6">
      <div className={`${shellClass} flex flex-col gap-3 rounded-[28px] px-4 py-4 sm:flex-row sm:items-center sm:flex-wrap sm:justify-between`}>
        <button
          type="button"
          onClick={onMenuToggle}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="hidden h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 text-sm font-bold text-slate-950 lg:flex">
            IA
          </div>
          <div className="min-w-0 w-full">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">IPL Analytics & Match Insights Platform</p>
            <h2 className="text-lg font-semibold leading-tight text-inherit sm:text-xl md:text-2xl">
              Advanced cricket dashboard for teams, players, and predictions
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={onToggleTheme}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10"
            aria-label="Toggle theme"
          >
            {isDark ? <SunMedium className="h-5 w-5 text-amber-300" /> : <MoonStar className="h-5 w-5 text-slate-700" />}
          </button>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition hover:bg-white/10"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-cyan-300" />
          </button>
        </div>
      </div>
    </header>
  );
}
