export function isAuthenticated(): boolean {
  console.warn('services/auth is deprecated. Use useAuth() from contexts/AuthContext instead.')
  return false
}

export function saveToken(_token: string) {
  console.warn('services/auth.saveToken is deprecated. Use AuthProvider.login instead.')
}

export function clearToken() {
  console.warn('services/auth.clearToken is deprecated. Use AuthProvider.logout instead.')
}
