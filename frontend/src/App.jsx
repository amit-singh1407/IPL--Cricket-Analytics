import { Navigate, Route, Routes } from 'react-router-dom';

import { useTheme } from '@/hooks/useTheme';
import AppLayout from '@/layouts/AppLayout';
import DashboardPage from '@/pages/DashboardPage';
import TeamsPage from '@/pages/TeamsPage';
import PlayersPage from '@/pages/PlayersPage';
import MatchPage from '@/pages/MatchPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import ComparePage from '@/pages/ComparePage';
import ChatbotPage from '@/pages/ChatbotPage';
import NotFoundPage from '@/pages/NotFoundPage';

export default function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Routes>
      <Route element={<AppLayout theme={theme} onToggleTheme={toggleTheme} />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/matches/:matchId?" element={<MatchPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/compare" element={<ComparePage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
