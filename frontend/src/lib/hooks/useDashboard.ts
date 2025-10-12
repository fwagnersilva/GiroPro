import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard/api';
import type { DashboardFilters } from '@/api/dashboard/types';

const DASHBOARD_KEY = 'dashboard';

export const useDashboard = (filters?: DashboardFilters) => {
  return useQuery({
    queryKey: [DASHBOARD_KEY, filters],
    queryFn: () => dashboardApi.getData(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
