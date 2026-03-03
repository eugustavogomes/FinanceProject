import api from '../services/api';
import { AUTH_LOGIN_URL } from '../services/endpoints';

export async function loginUser({ email, password }: { email: string; password: string }) {
  return api.post(AUTH_LOGIN_URL, { email, password });
}
