import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import api from '../services/api';
import { useTheme } from './ThemeContext';

type UserInfo = {
  id?: string;
  email?: string;
  name?: string;
  preferredTheme?: 'light' | 'dark' | null;
  isSidebarExpanded?: boolean;
} | null;

type AuthContextType = {
  token: string | null
  user: UserInfo
  login: (token: string) => Promise<void>
  logout: () => void
  isAuthenticated: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'))
  const [user, setUser] = useState<UserInfo>(null);
  const { setTheme } = useTheme();

  useEffect(() => {
    const t = localStorage.getItem('auth_token');
    if (t) {
      api.get('/users/me')
        .then(res => {
          setUser(res.data);
          const pref = res.data?.preferredTheme;
          if (pref === 'light' || pref === 'dark') {
            setTheme(pref);
          }
        })
        .catch(() => setUser(null));
    }
  }, []);

  async function login(newToken: string) {
    setToken(newToken)
    localStorage.setItem('auth_token', newToken)
    try {
      const res = await api.get('/users/me');
      setUser(res.data);
      const pref = res.data?.preferredTheme;
      if (pref === 'light' || pref === 'dark') {
        setTheme(pref);
      }
    } catch (e) {
      setUser(null);
    }
  }

  function logout() {
    setToken(null)
    setUser(null)
    localStorage.removeItem('auth_token')
  }

  function isAuthenticated() {
    return Boolean(token)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
