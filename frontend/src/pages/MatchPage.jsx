import { useMemo } from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import { CalendarDays, MapPin, Sparkles, Target } from 'lucide-react';

import { mockMatches, mockTeams } from '@/data/mockData';
import ComparisonPanel from '@/components/ComparisonPanel';
import StatCard from '@/components/StatCard';
import FavoriteTeams from '@/components/FavoriteTeams';

function getSelectedMatch(matchId) {
  if (!matchId) {
    return mockMatches[0];
  }
  return mockMatches.find((match) => match.matchId === matchId || match.id === matchId) || mockMatches[0];
}

export default function MatchPage() {
  const { theme } = useOutletContext();
  const { matchId } = useParams();
  const selectedMatch = useMemo(() => getSelectedMatch(matchId), [matchId]);
  const team1 = mockTeams.find((team) => team.teamId === selectedMatch.team1Id) || mockTeams[0];
  const team2 = mockTeams.find((team) => team.teamId === selectedMatch.team2Id) || mockTeams[1];

  const matchCardRows = [
    { label: 'Winner', value: selectedMatch.winner },
    { label: 'Margin', value: selectedMatch.margin },
    { label: 'Toss', value: `${selectedMatch.tossWinnerId?.toUpperCase() || 'NA'} · ${selectedMatch.tossDecision}` },
    { label: 'Score', value: selectedMatch.score },
  ];

  return (
    <div className="space-y-6 animate-fadeUp">
      <section className="glass-panel rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/80">Match details</p>
            <h2 className="mt-2 text-3xl font-bold text-white">{selectedMatch.team1} vs {selectedMatch.team2}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Match detail pages surface score, venue, toss impact, and contextual team form so analysts can move from overview to execution in one click.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {matchCardRows.map((row, index) => (
              <StatCard
                key={row.label}
                theme={theme}
                label={row.label}
                value={row.value}
                description="Selected match snapshot"
                trend={index % 2 === 0 ? 'high signal' : 'contextual'}
                icon={[Sparkles, CalendarDays, Target, MapPin][index]}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="glass-panel rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/80">Scorecard</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{selectedMatch.score}</h3>
            </div>
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
              {selectedMatch.winner} won
            </span>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <article className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Team one</p>
              <h4 className="mt-2 text-2xl font-semibold text-white">{team1.name}</h4>
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <div className="flex items-center justify-between"><span>Venue</span><span>{selectedMatch.venue}</span></div>
                <div className="flex items-center justify-between"><span>Season</span><span>{selectedMatch.season}</span></div>
                <div className="flex items-center justify-between"><span>Result margin</span><span>{selectedMatch.margin}</span></div>
              </div>
            </article>

            <article className="rounded-[24px] border border-emerald-400/20 bg-emerald-400/10 p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">Team two</p>
              <h4 className="mt-2 text-2xl font-semibold text-white">{team2.name}</h4>
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <div className="flex items-center justify-between"><span>Toss winner</span><span>{selectedMatch.tossWinnerId?.toUpperCase() || 'NA'}</span></div>
                <div className="flex items-center justify-between"><span>Toss decision</span><span>{selectedMatch.tossDecision}</span></div>
                <div className="flex items-center justify-between"><span>Outcome</span><span>{selectedMatch.winner}</span></div>
              </div>
            </article>
          </div>

          <div className="mt-6 overflow-hidden rounded-[24px] border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-sm">
              <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.28em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Field</th>
                  <th className="px-4 py-3">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-slate-300">
                <tr><td className="px-4 py-3">Match ID</td><td className="px-4 py-3">{selectedMatch.matchId}</td></tr>
                <tr><td className="px-4 py-3">Teams</td><td className="px-4 py-3">{selectedMatch.team1} / {selectedMatch.team2}</td></tr>
                <tr><td className="px-4 py-3">Venue</td><td className="px-4 py-3">{selectedMatch.venue}</td></tr>
                <tr><td className="px-4 py-3">Scoreline</td><td className="px-4 py-3">{selectedMatch.score}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <ComparisonPanel theme={theme} left={team1} right={team2} title="Team form snapshot" subtitle="Compare the teams that contested this match by their current season profile." />
          <FavoriteTeams theme={theme} teams={[team1.shortName, team2.shortName]} />
          <div className="glass-panel rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-soft">
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/80">Navigation</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/compare" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10">Compare teams</Link>
              <Link to="/analytics" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10">Open analytics</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
