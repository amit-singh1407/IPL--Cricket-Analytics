import { useState } from 'react';
import { Activity, Sparkles, Target, Trophy, Users, Zap } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';

import { mockDashboardData } from '@/data/mockData';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DashboardSkeleton } from '@/components/LoadingSkeleton';
import ErrorState from '@/components/ErrorState';
import StatCard from '@/components/StatCard';
import FavoriteTeams from '@/components/FavoriteTeams';
import InsightChat from '@/components/InsightChat';
import WinChart from '@/charts/WinChart';
import PlayerChart from '@/charts/PlayerChart';
import TossImpactChart from '@/charts/TossImpactChart';
import VenueChart from '@/charts/VenueChart';

const seasons = ['2025', '2024', '2023'];

export default function DashboardPage() {
  const { theme } = useOutletContext();
  const [season, setSeason] = useState('2025');
  const { loading, error, data } = useDashboardData(season);
  const dashboard = data || mockDashboardData;

  return (
    <div className="space-y-6 animate-fadeUp">
      <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-cyan-500 via-sky-500 to-slate-950 p-6 shadow-glow lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.2),transparent_32%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.45fr,0.85fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.34em] text-cyan-50">
              <Sparkles className="h-3.5 w-3.5" />
              IPL analytics command center
            </span>
            <h2 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-white md:text-5xl">
              Turn raw IPL data into tactical match intelligence, player form signals, and prediction-ready features.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-cyan-50/85 md:text-lg">
              A modern full-stack cricket dashboard built for scouting, analytics, and portfolio-grade presentation.
              Track season trends, compare teams, inspect players, and surface model-driven match insights.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/analytics"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-50"
              >
                <Activity className="h-4 w-4" />
                View analytics
              </Link>
              <Link
                to="/compare"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <Target className="h-4 w-4" />
                Compare players
              </Link>

            </div>
          </div>

          <div className="grid gap-3 self-start rounded-[30px] border border-white/15 bg-white/10 p-4 backdrop-blur-xl">
            <div className="rounded-[24px] border border-white/10 bg-slate-950/35 p-4 text-white">
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/80">Current season</p>
              <div className="mt-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-2xl font-bold">{season}</p>
                  <p className="mt-1 text-sm text-cyan-50/80">Modeling and visualization context</p>
                </div>
                <div className="flex gap-2">
                  {seasons.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSeason(option)}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        season === option ? 'bg-white text-slate-950' : 'bg-white/10 text-white hover:bg-white/15'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-white">
              <div className="rounded-[22px] border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/80">Live match feed</p>
                <p className="mt-3 text-3xl font-bold">{dashboard.liveScores.length}</p>
                <p className="mt-1 text-sm text-cyan-50/80">Recent score snapshots</p>
              </div>
              <div className="rounded-[22px] border border-white/10 bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/80">Confidence</p>
                <p className="mt-3 text-3xl font-bold">94%</p>
                <p className="mt-1 text-sm text-cyan-50/80">Ready for prediction layer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading ? <DashboardSkeleton /> : null}
      {error ? <ErrorState title="Using sample data" message={error} /> : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboard.summaryCards.map((card, index) => {
          const iconMap = [Trophy, Users, Activity, Zap];
          return (
            <StatCard
              key={card.label}
              theme={theme}
              label={card.label}
              value={card.value}
              description={card.description}
              trend={card.trend}
              icon={iconMap[index]}
              accent={index % 2 === 0 ? 'from-cyan-400 to-emerald-400' : 'from-amber-300 to-orange-400'}
            />
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <WinChart theme={theme} data={dashboard.charts.winPercentage} />
        <PlayerChart theme={theme} data={dashboard.charts.battingAverage} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr,1.1fr]">
        <TossImpactChart theme={theme} data={dashboard.charts.tossImpact} />
        <VenueChart theme={theme} data={dashboard.charts.venuePerformance} />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <div className="glass-panel rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-soft xl:col-span-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/80">Recent results</p>
              <h3 className="mt-2 text-xl font-semibold">Latest match insights</h3>
            </div>
            <Link to="/matches" className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200">
              Open matches
            </Link>
          </div>
          <div className="mt-5 overflow-hidden rounded-[24px] border border-white/10">
            <table className="min-w-full divide-y divide-white/10 text-sm">
              <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.28em] text-slate-400">
                <tr>
                  <th className="px-4 py-3">Match</th>
                  <th className="px-4 py-3">Venue</th>
                  <th className="px-4 py-3">Winner</th>
                  <th className="px-4 py-3">Margin</th>
                  <th className="px-4 py-3">Season</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {dashboard.recentMatches.map((match) => (
                  <tr key={match.id} className="text-slate-300">
                    <td className="px-4 py-3 font-medium text-white">{match.team1} vs {match.team2}</td>
                    <td className="px-4 py-3">{match.venue}</td>
                    <td className="px-4 py-3 text-cyan-200">{match.winner}</td>
                    <td className="px-4 py-3">{match.margin}</td>
                    <td className="px-4 py-3">{match.season}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <FavoriteTeams theme={theme} teams={dashboard.topTeams.slice(0, 4).map((team) => team.name || team.shortName)} />
          <div className="glass-panel rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-soft">
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/80">Top players</p>
            <div className="mt-4 space-y-3">
              {dashboard.topPlayers.slice(0, 4).map((player) => (
                <div key={player.id || player.playerId || player.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-white">{player.name}</h4>
                      <p className="text-sm text-slate-400">{player.team || player.teamName || 'Team'} {player.role ? `· ${player.role}` : ''}</p>
                    </div>
                    <span className="rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-medium text-cyan-200">
                      {player.runs ?? player.battingRuns ?? 0} runs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr,1fr]">
        <InsightChat theme={theme} insights={dashboard.insights} />
        <div className="glass-panel rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-soft">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/80">Season intelligence</p>
              <h3 className="mt-2 text-xl font-semibold">Key notes for analysts</h3>
            </div>
            <Link to="/analytics" className="text-sm font-medium text-cyan-300 transition hover:text-cyan-200">
              Open analytics
            </Link>
          </div>
          <div className="mt-5 grid gap-3">
            {dashboard.insights.map((insight) => (
              <div key={insight} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-6 text-slate-300">
                {insight}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {dashboard.liveScores.map((score) => (
          <article key={score.match} className="glass-panel rounded-[26px] border border-white/10 bg-white/5 p-5 shadow-soft">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/80">Live feed</p>
            <h4 className="mt-3 text-lg font-semibold text-white">{score.match}</h4>
            <p className="mt-2 text-3xl font-bold text-cyan-200">{score.score}</p>
            <div className="mt-3 flex items-center justify-between text-sm text-slate-400">
              <span>{score.overs}</span>
              <span>{score.status}</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
