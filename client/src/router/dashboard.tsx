import { createRoute, redirect } from '@tanstack/react-router';
import { rootRoute } from './root';
import DashboardLayout from '../pages/DashboardLayout';

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardLayout,
  beforeLoad: () => {
    const sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      throw redirect({ to: '/login' });
    }
  },
});
