import { useState } from 'react';
import { Download, BarChart3, TrendingUp, Target } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

import { mockDashboardData } from '@/data/mockData';
import StatCard from '@/components/StatCard';
import WinChart from '@/charts/WinChart';
import PlayerChart from '@/charts/PlayerChart';
import TossImpactChart from '@/charts/TossImpactChart';
import VenueChart from '@/charts/VenueChart';
import ComparisonPanel from '@/components/ComparisonPanel';

const seasons = ['2025', '2024', '2023'];

export default function AnalyticsPage() {
  const { theme } = useOutletContext();
  const [season, setSeason] = useState('2025');

  const topTeam = mockDashboardData.topTeams[0];
  const topPlayer = mockDashboardData.topPlayers[0];

  return (
    <div className="space-y-6 animate-fadeUp">
      <section className="glass-panel rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/80">Advanced analytics</p>
            <h2 className="mt-2 text-3xl font-bold text-white">Statistical views for batting, bowling, venue, and toss impact</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              This page packages the core analytics surfaces into one reporting view, suitable for presentation to recruiters or internal stakeholders.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {seasons.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSeason(option)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  season === option ? 'bg-cyan-400/15 text-cyan-200' : 'border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {option}
              </button>
            ))}
            <button type="button" className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2.5 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/15">
              <Download className="h-4 w-4" />
              Download report
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard theme={theme} label="Win rate" value={`${topTeam.winPercentage}%`} description="Top team in the dataset" trend="model aligned" icon={TrendingUp} />
        <StatCard theme={theme} label="Top scorer" value={topPlayer.runs} description={topPlayer.name} trend="batting leader" icon={BarChart3} />
        <StatCard theme={theme} label="Strike rate" value={`${topPlayer.strikeRate}%`} description="Explosive scoring rate" trend="high tempo" icon={Target} />
        <StatCard theme={theme} label="Toss edge" value={`${mockDashboardData.charts.tossImpact[0].value}%`} description="Chasing advantage" trend="venue aware" icon={Target} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <WinChart theme={theme} data={mockDashboardData.charts.winPercentage} />
        <PlayerChart theme={theme} data={mockDashboardData.charts.battingAverage} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <TossImpactChart theme={theme} data={mockDashboardData.charts.tossImpact} />
        <VenueChart theme={theme} data={mockDashboardData.charts.venuePerformance} />
      </section>

      <ComparisonPanel
        theme={theme}
        left={topPlayer}
        right={mockDashboardData.topPlayers[1]}
        title="Top-player comparison"
        subtitle="Use this section to contrast top scorers by batting average, strike rate, and consistency output."
      />
    </div>
  );
}
