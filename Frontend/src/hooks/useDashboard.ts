import api from '../services/api';
import { DASHBOARD_SUMMARY_URL } from '../services/endpoints';

export async function fetchDashboardSummary(month: number | 'all' = 'all') {
  const params: any = {};
  if (month !== 'all') params.month = month;
  else params.period = 'all';
  return api.get(DASHBOARD_SUMMARY_URL, { params });
}
