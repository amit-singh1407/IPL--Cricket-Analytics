import { Bot, Sparkles, Wand2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

import InsightChat from '@/components/InsightChat';
import StatCard from '@/components/StatCard';
import { mockDashboardData } from '@/data/mockData';

const capabilityCards = [
  {
    label: 'Toss trends',
    value: 'Instant',
    description: 'Ask how toss impact changes by venue and chasing patterns.',
  },
  {
    label: 'Player form',
    value: 'Live',
    description: 'Surface the hottest batters and bowlers from the current season.',
  },
  {
    label: 'Prediction logic',
    value: 'Explained',
    description: 'Get a readable summary of how the model ranks each match.',
  },
];

export default function ChatbotPage() {
  const { theme } = useOutletContext();

  return (
    <div className="space-y-6 animate-fadeUp">
      <section className="relative overflow-hidden rounded-[34px] border border-white/10 bg-gradient-to-br from-cyan-500 via-sky-500 to-slate-950 p-6 shadow-glow lg:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.18),transparent_30%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.34em] text-cyan-50">
              <Bot className="h-3.5 w-3.5" />
              Cricket chatbot
            </span>
            <h2 className="mt-5 text-4xl font-bold leading-tight md:text-5xl">
              Ask the platform about form, venue edge, toss impact, or match predictions.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-cyan-50/85 md:text-lg">
              This assistant turns the dashboard data into short answers you can act on quickly. Use it to explore the season without digging through multiple charts.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:w-[28rem]">
            {capabilityCards.map((card, index) => (
              <StatCard
                key={card.label}
                theme={theme}
                label={card.label}
                value={card.value}
                description={card.description}
                trend={index === 0 ? 'venue aware' : index === 1 ? 'season ready' : 'model guided'}
                icon={index === 0 ? Sparkles : Wand2}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr,1.1fr]">
        <div className="glass-panel rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-soft">
          <p className="text-xs uppercase tracking-[0.32em] text-cyan-300/80">How to use it</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Ask for a quick tactical read</h3>
          <div className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              Try: “Who is in form this season?”
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              Try: “How important is the toss at Chepauk?”
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              Try: “Best venue for chasing?”
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            The assistant is lightweight and local to this dashboard, so it stays fast and easy to demo.
          </p>
        </div>

        <InsightChat theme={theme} insights={mockDashboardData.insights} />
      </section>
    </div>
  );
}