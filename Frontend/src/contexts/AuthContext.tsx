import { createContext, useContext, useState, type ReactNode } from 'react'

type AuthContextType = {
  token: string | null
  login: (token: string) => void
  logout: () => void
  isAuthenticated: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'))

  function login(newToken: string) {
    setToken(newToken)
    localStorage.setItem('auth_token', newToken)
  }

  function logout() {
    setToken(null)
    localStorage.removeItem('auth_token')
  }

  function isAuthenticated() {
    return Boolean(token)
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
