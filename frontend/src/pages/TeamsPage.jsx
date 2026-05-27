import { useEffect, useMemo, useState } from 'react';
import { Trophy, MapPin, TrendingUp } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

import { fetchTeams } from '@/services/api';
import { mockTeams } from '@/data/mockData';
import SearchBar from '@/components/SearchBar';
import StatCard from '@/components/StatCard';
import ComparisonPanel from '@/components/ComparisonPanel';

const filters = [
  { label: 'All', value: 'all' },
  { label: '2025', value: '2025' },
  { label: '2024', value: '2024' },
  { label: '2023', value: '2023' },
];

export default function TeamsPage() {
  const { theme } = useOutletContext();
  const [search, setSearch] = useState('');
  const [season, setSeason] = useState('2025');
  const [teams, setTeams] = useState(mockTeams);

  useEffect(() => {
    let active = true;

    async function loadTeams() {
      try {
        const response = await fetchTeams({ season: season === 'all' ? undefined : season, limit: 20 });
        const loadedTeams = response?.items || response || mockTeams;
        if (active && Array.isArray(loadedTeams) && loadedTeams.length) {
          setTeams(loadedTeams);
        }
      } catch (error) {
        if (active) {
          setTeams(mockTeams);
        }
      }
    }

    loadTeams();

    return () => {
      active = false;
    };
  }, [season]);

  const filteredTeams = useMemo(
    () =>
      teams.filter((team) => {
        const haystack = `${team.name} ${team.shortName || ''} ${team.city || ''}`.toLowerCase();
        return haystack.includes(search.toLowerCase());
      }),
    [search, teams],
  );

  const topWinPercentage = filteredTeams.length
    ? Math.max(...filteredTeams.map((team) => Number(team.winPercentage || 0)))
    : 0;

  const primaryTeam = filteredTeams[0] || mockTeams[0];
  const secondaryTeam = filteredTeams[1] || mockTeams[1];

  return (
    <div className="space-y-6 animate-fadeUp">
      <section className="glass-panel rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/80">Team statistics</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Franchise performance and venue strength</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Search, filter, and compare teams across seasons. The page is wired for backend data but falls back to a polished sample dataset when the API is unavailable.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard theme={theme} label="Tracked teams" value={filteredTeams.length} description="Current filter results" trend="season aware" icon={Trophy} />
            <StatCard theme={theme} label="Top win %" value={`${topWinPercentage.toFixed(1)}%`} description="Best team in view" trend="sample + API" icon={TrendingUp} />
            <StatCard theme={theme} label="Venue edge" value={primaryTeam.venue || 'N/A'} description="Strongest home ground" trend="home advantage" icon={MapPin} />
            <StatCard theme={theme} label="Season" value={season} description="Active filter" trend="switchable" icon={Trophy} />
          </div>
        </div>
      </section>

      <SearchBar
        theme={theme}
        value={search}
        onChange={setSearch}
        placeholder="Search a team by name, short code, or city"
        filters={filters}
        activeFilter={season}
        onFilterChange={setSeason}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredTeams.map((team) => (
          <article key={team.id || team.teamId} className="glass-panel rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-soft transition hover:-translate-y-1">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">{team.shortName || team.teamId}</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">{team.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{team.city || 'Indian Premier League'}</p>
              </div>
              <div className="rounded-2xl bg-cyan-400/15 px-4 py-3 text-right">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/80">Win %</p>
                <p className="text-2xl font-bold text-cyan-100">{Number(team.winPercentage || 0).toFixed(1)}</p>
              </div>
            </div>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${Math.min(Number(team.winPercentage || 0), 100)}%` }} />
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <dt className="text-slate-400">Played</dt>
                <dd className="mt-1 text-lg font-semibold text-white">{team.played || 0}</dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <dt className="text-slate-400">Won</dt>
                <dd className="mt-1 text-lg font-semibold text-white">{team.won || 0}</dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <dt className="text-slate-400">Lost</dt>
                <dd className="mt-1 text-lg font-semibold text-white">{team.lost || 0}</dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <dt className="text-slate-400">Toss impact</dt>
                <dd className="mt-1 text-lg font-semibold text-white">{Number(team.tossImpact || 0).toFixed(1)}%</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>

      <ComparisonPanel theme={theme} left={primaryTeam} right={secondaryTeam} title="Team comparison" subtitle="Compare form, venue strength, and toss impact side by side." />
    </div>
  );
}
