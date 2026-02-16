import { Navigate, useRoutes } from 'react-router-dom';

import { RequireAdmin, RequireAuth } from '../auth';
import { AdminLayout, PublicLayout, UserLayout } from '../layouts';
import {
  AdminContestsPage,
  AdminDashboardPage,
  AdminProblemsPage,
  AdminReportsPage,
  AdminUsersPage,
  ContestDetailsPage,
  ContestsPage,
  HomePage,
  LeaderboardPage,
  LoginPage,
  NotFoundPage,
  ProblemDetailsPage,
  ProfilePage,
  RegisterPage,
  ResetPasswordPage,
  UserDashboardPage,
} from '../pages';

export function AppRoutes() {
  return useRoutes([
    {
      element: <PublicLayout />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/autentificare', element: <LoginPage /> },
        { path: '/inregistrare', element: <RegisterPage /> },
        { path: '/resetare-parola', element: <ResetPasswordPage /> },
        { path: '/concursuri', element: <ContestsPage /> },
        { path: '/concursuri/:contestId', element: <ContestDetailsPage /> },
        { path: '/clasament', element: <LeaderboardPage /> },
      ],
    },
    {
      element: <RequireAuth />,
      children: [
        {
          element: <UserLayout />,
          children: [
            { path: '/panou', element: <UserDashboardPage /> },
            { path: '/profil', element: <ProfilePage /> },
            { path: '/probleme/:problemId', element: <ProblemDetailsPage /> },
          ],
        },
        {
          element: <RequireAdmin />,
          children: [
            {
              element: <AdminLayout />,
              children: [
                { path: '/admin', element: <AdminDashboardPage /> },
                { path: '/admin/utilizatori', element: <AdminUsersPage /> },
                { path: '/admin/concursuri', element: <AdminContestsPage /> },
                { path: '/admin/probleme', element: <AdminProblemsPage /> },
                { path: '/admin/raportari', element: <AdminReportsPage /> },
              ],
            },
          ],
        },
      ],
    },
    { path: '/404', element: <NotFoundPage /> },
    { path: '*', element: <Navigate to='/404' replace /> },
  ]);
}
