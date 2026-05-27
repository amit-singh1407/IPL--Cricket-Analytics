import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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

export async function fetchPlayers(params = {}) {
  const response = await apiClient.get('/players', { params });
  return unwrap(response);
}

export async function fetchTeams(params = {}) {
  const response = await apiClient.get('/teams', { params });
  return unwrap(response);
}

export async function fetchMatches(params = {}) {
  const response = await apiClient.get('/matches', { params });
  return unwrap(response);
}

export async function fetchPlayer(identifier) {
  const response = await apiClient.get(`/player/${identifier}`);
  return unwrap(response);
}

export async function fetchTeam(identifier) {
  const response = await apiClient.get(`/team/${identifier}`);
  return unwrap(response);
}

export async function fetchPlayerAnalytics(params = {}) {
  const response = await apiClient.get('/analytics/player', { params });
  return unwrap(response);
}

export async function fetchTeamAnalytics(params = {}) {
  const response = await apiClient.get('/analytics/team', { params });
  return unwrap(response);
}

export async function predictMatch(payload) {
  const response = await apiClient.post('/predict', payload);
  return unwrap(response);
}
