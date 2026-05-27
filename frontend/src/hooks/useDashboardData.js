import { useEffect, useState } from 'react';

import { fetchMatches, fetchPlayerAnalytics, fetchTeamAnalytics } from '@/services/api';
import { mockDashboardData } from '@/data/mockData';

function safeNumber(value, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function firstValid(items, key) {
  for (const item of items) {
    if (item && item[key] !== undefined && item[key] !== null) {
      return item[key];
    }
  }
  return null;
}

function composeDashboardData(teamAnalytics, playerAnalytics, matches) {
  const teamSummary = teamAnalytics?.summary || {};
  const playerSummary = playerAnalytics?.summary || {};
  const teamCharts = teamAnalytics?.charts || {};
  const playerCharts = playerAnalytics?.charts || {};
  const recentMatches = matches?.items || matches || [];

  return {
    summaryCards: [
      {
        label: 'Teams',
        value: safeNumber(teamSummary.totalTeams, mockDashboardData.summaryCards[0].value),
        description: 'Tracked franchises across seasons',
        trend: `${safeNumber(teamSummary.averageWinPercentage, 0).toFixed(1)}% avg win rate`,
      },
      {
        label: 'Players',
        value: safeNumber(playerSummary.totalPlayers, mockDashboardData.summaryCards[1].value),
        description: 'Batters, bowlers and all-rounders',
        trend: `${safeNumber(playerSummary.averageBattingAverage, 0).toFixed(1)} avg batting`,
      },
      {
        label: 'Matches',
        value: safeNumber(firstValid([matches], 'total') ?? recentMatches.length, mockDashboardData.summaryCards[2].value),
        description: 'Match records loaded in MongoDB',
        trend: `${recentMatches.length} recent fixtures`,
      },
      {
        label: 'Power Metric',
        value: `${safeNumber(playerSummary.averageStrikeRate, 0).toFixed(1)} SR`,
        description: 'Mean strike rate across players',
        trend: 'Model-ready batting profile',
      },
    ],
    charts: {
      winPercentage: teamCharts.winPercentage?.length ? teamCharts.winPercentage : mockDashboardData.charts.winPercentage,
      battingAverage: playerCharts.battingAverage?.length ? playerCharts.battingAverage : mockDashboardData.charts.battingAverage,
      strikeRate: playerCharts.strikeRate?.length ? playerCharts.strikeRate : mockDashboardData.charts.strikeRate,
      tossImpact: teamCharts.tossImpact?.length ? teamCharts.tossImpact : mockDashboardData.charts.tossImpact,
      venuePerformance: teamCharts.venuePerformance?.length ? teamCharts.venuePerformance : mockDashboardData.charts.venuePerformance,
    },
    recentMatches: recentMatches.slice(0, 6),
    topPlayers: playerSummary.topScorers?.length ? playerSummary.topScorers : mockDashboardData.topPlayers,
    topTeams: teamAnalytics?.table?.length ? teamAnalytics.table.slice(0, 6) : mockDashboardData.topTeams,
    insights: [
      ...(teamSummary.bestWinTeam ? [`${teamSummary.bestWinTeam.name} currently leads the win-rate charts.`] : []),
      ...(playerSummary.topScorers?.[0] ? [`${playerSummary.topScorers[0].name} is the leading run accumulator.`] : []),
      ...(teamSummary.bestTossImpact ? [`${teamSummary.bestTossImpact.name} gains the most from toss advantage.`] : []),
      ...mockDashboardData.insights,
    ].slice(0, 4),
    liveScores: mockDashboardData.liveScores,
  };
}

export function useDashboardData(season = '2025') {
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: mockDashboardData,
  });

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setState((currentState) => ({ ...currentState, loading: true, error: null }));
      try {
        const [teamAnalytics, playerAnalytics, matches] = await Promise.all([
          fetchTeamAnalytics({ season }),
          fetchPlayerAnalytics({ season }),
          fetchMatches({ season, limit: 6 }),
        ]);

        if (!active) {
          return;
        }

        setState({
          loading: false,
          error: null,
          data: composeDashboardData(teamAnalytics, playerAnalytics, matches),
        });
      } catch (error) {
        if (!active) {
          return;
        }

        setState({
          loading: false,
          error: error?.message || 'Dashboard API unavailable. Using sample data.',
          data: mockDashboardData,
        });
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, [season]);

  return state;
}
