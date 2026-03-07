import api from '../services/api';
import { DASHBOARD_SUMMARY_URL } from '../services/endpoints';

export async function fetchDashboardSummary() {
  return api.get(DASHBOARD_SUMMARY_URL);
}
