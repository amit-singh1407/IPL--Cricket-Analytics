import axios from 'axios';

import { mockDashboardData, mockMatches, mockPlayers, mockTeams } from '@/data/mockData';

const baseURL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';
const isGitHubPages = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');
const useMockData = import.meta.env.PROD && isGitHubPages;

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ipl-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const unwrap = (response) => response?.data?.data ?? response?.data ?? null;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function paginate(items, params = {}) {
  const limit = Number(params.limit) > 0 ? Number(params.limit) : items.length;
  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const start = (page - 1) * limit;
  return {
    items: clone(items.slice(start, start + limit)),
    total: items.length,
    page,
    limit,
  };
}

function buildTeamAnalytics() {
  const averageWinPercentage = mockTeams.reduce((sum, team) => sum + Number(team.winPercentage || 0), 0) / mockTeams.length;
  const averageTossImpact = mockTeams.reduce((sum, team) => sum + Number(team.tossImpact || 0), 0) / mockTeams.length;

  return {
    summary: {
      totalTeams: mockTeams.length,
      averageWinPercentage,
      bestWinTeam: mockTeams[0],
      bestTossImpact: mockTeams[0],
    },
    charts: {
      winPercentage: mockDashboardData.charts.winPercentage,
      tossImpact: mockDashboardData.charts.tossImpact,
      venuePerformance: mockDashboardData.charts.venuePerformance,
    },
    table: clone(mockTeams),
    metrics: {
      averageTossImpact,
    },
  };
}

function buildPlayerAnalytics() {
  const averageBattingAverage = mockPlayers.reduce((sum, player) => sum + Number(player.battingAverage || 0), 0) / mockPlayers.length;
  const averageStrikeRate = mockPlayers.reduce((sum, player) => sum + Number(player.strikeRate || 0), 0) / mockPlayers.length;

  return {
    summary: {
      totalPlayers: mockPlayers.length,
      averageBattingAverage,
      averageStrikeRate,
      topScorers: clone(mockDashboardData.topPlayers),
    },
    charts: {
      battingAverage: mockDashboardData.charts.battingAverage,
      strikeRate: mockDashboardData.charts.strikeRate,
    },
  };
}

export async function fetchPlayers(params = {}) {
  if (useMockData) {
    return paginate(mockPlayers, params);
  }

  const response = await apiClient.get('/players', { params });
  return unwrap(response);
}

export async function fetchTeams(params = {}) {
  if (useMockData) {
    return paginate(mockTeams, params);
  }

  const response = await apiClient.get('/teams', { params });
  return unwrap(response);
}

export async function fetchMatches(params = {}) {
  if (useMockData) {
    return paginate(mockMatches, params);
  }

  const response = await apiClient.get('/matches', { params });
  return unwrap(response);
}

export async function fetchPlayer(identifier) {
  if (useMockData) {
    return clone(mockPlayers.find((player) => player.playerId === identifier || player.id === identifier) || mockPlayers[0]);
  }

  const response = await apiClient.get(`/player/${identifier}`);
  return unwrap(response);
}

export async function fetchTeam(identifier) {
  if (useMockData) {
    return clone(mockTeams.find((team) => team.teamId === identifier || team.id === identifier) || mockTeams[0]);
  }

  const response = await apiClient.get(`/team/${identifier}`);
  return unwrap(response);
}

export async function fetchPlayerAnalytics(params = {}) {
  if (useMockData) {
    return buildPlayerAnalytics(params);
  }

  const response = await apiClient.get('/analytics/player', { params });
  return unwrap(response);
}

export async function fetchTeamAnalytics(params = {}) {
  if (useMockData) {
    return buildTeamAnalytics(params);
  }

  const response = await apiClient.get('/analytics/team', { params });
  return unwrap(response);
}

export async function predictMatch(payload) {
  if (useMockData) {
    return {
      success: true,
      message: 'Demo prediction',
      data: {
        winner: mockDashboardData.topTeams[0].shortName,
        confidence: 0.74,
        predictedScore: 171,
        topPlayer: mockDashboardData.topPlayers[0].name,
        input: clone(payload),
      },
    };
  }

  const response = await apiClient.post('/predict', payload);
  return unwrap(response);
}
