import { useMemo, useState } from 'react';
import { Trophy, Users } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

import { mockPlayers, mockTeams } from '@/data/mockData';
import ComparisonPanel from '@/components/ComparisonPanel';
import SearchBar from '@/components/SearchBar';
import StatCard from '@/components/StatCard';

export default function ComparePage() {
  const { theme } = useOutletContext();
  const [mode, setMode] = useState('players');
  const [search, setSearch] = useState('');

  const pool = mode === 'players' ? mockPlayers : mockTeams;
  const filteredPool = useMemo(
    () => pool.filter((item) => `${item.name} ${item.teamId || item.shortName || ''}`.toLowerCase().includes(search.toLowerCase())),
    [pool, search],
  );

  const leftItem = filteredPool[0] || pool[0];
  const rightItem = filteredPool[1] || pool[1] || pool[0];

  return (
    <div className="space-y-6 animate-fadeUp">
      <section className="glass-panel rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/80">Comparison tools</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Compare players and teams side by side</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Use this page to inspect batting output, consistency, win percentage, and venue fit for two selected candidates.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-2">
            <StatCard theme={theme} label="Mode" value={mode === 'players' ? 'Players' : 'Teams'} description="Comparison context" trend="switchable" icon={mode === 'players' ? Users : Trophy} />
            <StatCard theme={theme} label="Pool size" value={filteredPool.length} description="Filtered candidates" trend="search ready" icon={Trophy} />
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.4fr,0.6fr]">
        <SearchBar
          theme={theme}
          value={search}
          onChange={setSearch}
          placeholder={mode === 'players' ? 'Search players by name or team' : 'Search teams by name or city'}
        />
        <div className="glass-panel flex items-center gap-2 rounded-[26px] border border-white/10 bg-white/5 p-4 shadow-soft">
          <button
            type="button"
            onClick={() => setMode('players')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${mode === 'players' ? 'bg-cyan-400/15 text-cyan-200' : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'}`}
          >
            Players
          </button>
          <button
            type="button"
            onClick={() => setMode('teams')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${mode === 'teams' ? 'bg-cyan-400/15 text-cyan-200' : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'}`}
          >
            Teams
          </button>
        </div>
      </div>

      <ComparisonPanel theme={theme} left={leftItem} right={rightItem} title={mode === 'players' ? 'Player matchup' : 'Team matchup'} subtitle="Use the comparison panel to spot performance advantages at a glance." />
    </div>
  );
}
