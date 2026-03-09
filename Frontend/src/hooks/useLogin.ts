import api from '../services/api';
import { AUTH_LOGIN_URL } from '../services/endpoints';

export async function loginUser({ identifier, password }: { identifier: string; password: string }) {
  return api.post(AUTH_LOGIN_URL, { email: identifier, username: identifier, password });
}
