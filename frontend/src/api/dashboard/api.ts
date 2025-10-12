import { client } from '../common/client';
import type { DashboardData, DashboardFilters } from './types';

const DASHBOARD_URL = '/dashboard';

export const dashboardApi = {
  getData: (filters?: DashboardFilters) => 
    client.get<DashboardData>(DASHBOARD_URL, { params: filters }).then((res) => res.data),
};
