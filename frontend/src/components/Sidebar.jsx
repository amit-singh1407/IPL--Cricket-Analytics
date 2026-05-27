import { BarChart3, ClipboardList, Github, Home, Trophy, Users, WandSparkles, UserRoundSearch, MessageSquare } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Home },
  { to: '/teams', label: 'Teams', icon: Trophy },
  { to: '/players', label: 'Players', icon: Users },
  { to: '/matches', label: 'Matches', icon: ClipboardList },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/compare', label: 'Compare', icon: UserRoundSearch },
  { to: '/chatbot', label: 'Chatbot', icon: MessageSquare },
];

export default function Sidebar({ theme, mobileOpen, onClose }) {
  const panelClass = theme === 'light' ? 'glass-panel-light text-slate-900' : 'glass-panel text-slate-100';

  return (
    <>
      <aside
        className={`${panelClass} fixed inset-y-0 left-0 z-40 hidden w-80 flex-col border-r border-white/10 bg-opacity-90 p-5 lg:flex`}
      >
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 text-xl font-bold text-slate-950 shadow-glow">
            IA
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">IPL Analytics</p>
            <h1 className="text-2xl font-semibold">Match Insights</h1>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
          <p className="font-semibold text-white">Professional cricket intelligence.</p>
          <p className="mt-1 text-slate-400">Explore player form, toss impact, and venue trends from a clean, portfolio-ready dashboard.</p>
        </div>

        <nav className="flex flex-1 flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-cyan-400/15 text-cyan-200 shadow-glow'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white',
                ].join(' ')
              }
              onClick={onClose}
            >
              {({ isActive }) => {
                const Icon = item.icon;
                return (
                  <>
                    <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-300'}`} />
                    <span>{item.label}</span>
                  </>
                );
              }}
            </NavLink>
          ))}
        </nav>

        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-500/15 to-emerald-500/15 px-4 py-4 text-sm text-slate-300 transition hover:border-cyan-400/40 hover:text-white"
        >
          <span className="flex items-center gap-2">
            <Github className="h-4 w-4" />
            GitHub-ready codebase
          </span>
          <WandSparkles className="h-4 w-4 text-cyan-300" />
        </a>
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden" onClick={onClose}>
          <aside
            className={`${panelClass} absolute left-0 top-0 flex h-full w-80 flex-col border-r border-white/10 p-5`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 text-xl font-bold text-slate-950 shadow-glow">
                IA
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">IPL Analytics</p>
                <h1 className="text-2xl font-semibold">Match Insights</h1>
              </div>
            </div>
            <nav className="flex flex-1 flex-col gap-2">{navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-cyan-400/15 text-cyan-200 shadow-glow'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white',
                  ].join(' ')
                }
                onClick={onClose}
              >
                {({ isActive }) => {
                  const Icon = item.icon;
                  return (
                    <>
                      <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-300' : 'text-slate-400 group-hover:text-cyan-300'}`} />
                      <span>{item.label}</span>
                    </>
                  );
                }}
              </NavLink>
            ))}</nav>
          </aside>
        </div>
      ) : null}
    </>
  );
}
