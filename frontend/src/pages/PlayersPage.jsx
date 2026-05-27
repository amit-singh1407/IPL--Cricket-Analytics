import { useEffect, useMemo, useState } from 'react';
import { Flame, Gauge, Medal } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

import { fetchPlayers } from '@/services/api';
import { mockPlayers } from '@/data/mockData';
import SearchBar from '@/components/SearchBar';
import StatCard from '@/components/StatCard';
import ComparisonPanel from '@/components/ComparisonPanel';

const roleFilters = [
  { label: 'All', value: 'all' },
  { label: 'Batter', value: 'Batter' },
  { label: 'Bowler', value: 'Bowler' },
  { label: 'All-rounder', value: 'All-rounder' },
];

const seasonFilters = [
  { label: '2025', value: '2025' },
  { label: '2024', value: '2024' },
  { label: '2023', value: '2023' },
  { label: 'All', value: 'all' },
];

export default function PlayersPage() {
  const { theme } = useOutletContext();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('all');
  const [season, setSeason] = useState('2025');
  const [players, setPlayers] = useState(mockPlayers);

  useEffect(() => {
    let active = true;

    async function loadPlayers() {
      try {
        const response = await fetchPlayers({ season: season === 'all' ? undefined : season, role: role === 'all' ? undefined : role, limit: 50 });
        const loadedPlayers = response?.items || response || mockPlayers;
        if (active && Array.isArray(loadedPlayers) && loadedPlayers.length) {
          setPlayers(loadedPlayers);
        }
      } catch (error) {
        if (active) {
          setPlayers(mockPlayers);
        }
      }
    }

    loadPlayers();

    return () => {
      active = false;
    };
  }, [role, season]);

  const filteredPlayers = useMemo(
    () =>
      players.filter((player) => {
        const haystack = `${player.name} ${player.teamName || player.teamId || ''} ${player.role || ''}`.toLowerCase();
        const matchesSearch = haystack.includes(search.toLowerCase());
        const matchesRole = role === 'all' || (player.role || '').toLowerCase() === role.toLowerCase();
        return matchesSearch && matchesRole;
      }),
    [players, search, role],
  );

  const topStrikeRate = filteredPlayers.length
    ? Math.max(...filteredPlayers.map((player) => Number(player.strikeRate || 0)))
    : 0;

  const topPlayers = [...filteredPlayers].sort((left, right) => Number(right.runs || right.battingRuns || 0) - Number(left.runs || left.battingRuns || 0));
  const firstPlayer = topPlayers[0] || mockPlayers[0];
  const secondPlayer = topPlayers[1] || mockPlayers[1];

  return (
    <div className="space-y-6 animate-fadeUp">
      <section className="glass-panel rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/80">Player analytics</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Player form, efficiency, and consistency metrics</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Search across batting, bowling, and all-round profiles. The UI is tuned for quick scouting and clean comparison workflows.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-3">
            <StatCard theme={theme} label="Players" value={filteredPlayers.length} description="Results in view" trend="dynamic filter" icon={Medal} />
            <StatCard theme={theme} label="Best runs" value={Number(topPlayers[0]?.runs || topPlayers[0]?.battingRuns || 0)} description="Highest run tally" trend="current roster" icon={Flame} />
            <StatCard theme={theme} label="Top strike rate" value={topStrikeRate.toFixed(1)} description="Explosive scoring" trend="form based" icon={Gauge} />
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.3fr,0.7fr]">
        <SearchBar
          theme={theme}
          value={search}
          onChange={setSearch}
          placeholder="Search by player name, team, or role"
          filters={roleFilters}
          activeFilter={role}
          onFilterChange={setRole}
        />
        <div className="glass-panel flex items-center gap-2 rounded-[26px] border border-white/10 bg-white/5 p-4 shadow-soft">
          {seasonFilters.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSeason(option.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                season === option.value
                  ? 'bg-cyan-400/15 text-cyan-200'
                  : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredPlayers.map((player) => (
          <article key={player.id || player.playerId} className="glass-panel rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-soft transition hover:-translate-y-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">{player.role || 'Player'}</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{player.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{player.teamName || player.teamId || 'Independent'}</p>
              </div>
              <div className="rounded-2xl bg-emerald-400/15 px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.28em] text-emerald-200/80">Consistency</p>
                <p className="text-2xl font-bold text-emerald-100">{Number(player.consistency || 0).toFixed(0)}</p>
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <dt className="text-slate-400">Batting avg</dt>
                <dd className="mt-1 text-lg font-semibold text-white">{Number(player.battingAverage || 0).toFixed(1)}</dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <dt className="text-slate-400">Strike rate</dt>
                <dd className="mt-1 text-lg font-semibold text-white">{Number(player.strikeRate || 0).toFixed(1)}</dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <dt className="text-slate-400">Runs</dt>
                <dd className="mt-1 text-lg font-semibold text-white">{Number(player.runs || player.battingRuns || 0)}</dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <dt className="text-slate-400">Economy</dt>
                <dd className="mt-1 text-lg font-semibold text-white">{Number(player.economyRate || 0).toFixed(1)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>

      <ComparisonPanel theme={theme} left={firstPlayer} right={secondPlayer} title="Player comparison" subtitle="A quick view for batting output, strike rate, and consistency." />
    </div>
  );
}
