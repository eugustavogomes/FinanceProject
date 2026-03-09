import api from '../services/api';
import { AUTH_REGISTER_URL } from '../services/endpoints';

export async function registerUser({
  username,
  name,
  email,
  password,
}: {
  username: string;
  name: string;
  email: string;
  password: string;
}) {
  return api.post(AUTH_REGISTER_URL, { username, name, email, password });
}
