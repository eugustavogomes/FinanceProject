import api from '../services/api';
import { USER_CHANGE_PASSWORD_URL } from '../services/endpoints';

export async function changePassword({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) {
  return api.post(USER_CHANGE_PASSWORD_URL, { currentPassword, newPassword });
}
