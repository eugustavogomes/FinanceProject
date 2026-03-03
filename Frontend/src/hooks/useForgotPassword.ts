import api from '../services/api';
import { AUTH_FORGOT_PASSWORD_URL } from '../services/endpoints';

export async function forgotPassword({ email }: { email: string }) {
  return api.post(AUTH_FORGOT_PASSWORD_URL, { email });
}
