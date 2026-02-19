import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import PublicLayout from '../layouts/PublicLayout';
import { AuthGuard, AdminGuard, GuestGuard } from '../auth/guards/auth-guard';

import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ExercisesPage from '../pages/ExercisesPage';
import ExerciseDetailPage from '../pages/ExerciseDetailPage';
import ProfilePage from '../pages/ProfilePage';
import LeaderboardPage from '../pages/LeaderboardPage';
import NewsPage from '../pages/NewsPage';
import ContactPage from '../pages/ContactPage';
import ClansPage from '../pages/ClansPage';
import AchievementsPage from '../pages/AchievementsPage';

import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminChallenges from '../pages/admin/AdminChallenges';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminClans from '../pages/admin/AdminClans';
import AdminAchievements from '../pages/admin/AdminAchievements';
import AdminNews from '../pages/admin/AdminNews';
import AdminMessages from '../pages/admin/AdminMessages';

import NotFoundPage from '../pages/NotFoundPage';
import ServerErrorPage from '../pages/ServerErrorPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/500" element={<ServerErrorPage />} />

        <Route path="/login" element={<GuestGuard><LoginPage /></GuestGuard>} />
        <Route path="/register" element={<GuestGuard><RegisterPage /></GuestGuard>} />
      </Route>

      <Route element={<AuthGuard><MainLayout /></AuthGuard>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/exercises" element={<ExercisesPage />} />
        <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/clans" element={<ClansPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
      </Route>

      <Route element={<AdminGuard><MainLayout /></AdminGuard>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/challenges" element={<AdminChallenges />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/clans" element={<AdminClans />} />
        <Route path="/admin/achievements" element={<AdminAchievements />} />
        <Route path="/admin/news" element={<AdminNews />} />
        <Route path="/admin/messages" element={<AdminMessages />} />
      </Route>

      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
