import api from '../services/api';
import { AUTH_REGISTER_URL } from '../services/endpoints';

export async function registerUser({ name, email, password }: { name: string; email: string; password: string }) {
  return api.post(AUTH_REGISTER_URL, { name, email, password });
}
