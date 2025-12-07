import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Bem-vindo ao painel financeiro.</p>
      <button onClick={handleLogout}>Sair</button>
    </main>
  )
}
