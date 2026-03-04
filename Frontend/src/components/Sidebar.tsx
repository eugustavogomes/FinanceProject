import { NavLink, useNavigate } from 'react-router-dom';
import { Home, List, PieChart, User, Target, Layers, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo3.png';

const routes = [
  { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
  { name: 'Transactions', path: '/transactions', icon: <List size={20} /> },
  { name: 'Categories', path: '/categories', icon: <Layers size={20} /> },
  { name: 'Goals', path: '/goals', icon: <Target size={20} /> },
  { name: 'Profile', path: '/profile', icon: <User size={20} /> },
  { name: 'Investments', path: '/investments', icon: <PieChart size={20} /> },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside
      className="fixed top-0 left-0 h-full w-56 bg-gradient-to-b from-green-900 via-green-700 to-green-800 shadow-lg z-40 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-center py-6">
          <img src={logo} alt="Simple Finance Logo" className="w-40 transition-all duration-200" />
        </div>
        <nav className="flex flex-col gap-2 mt-4">
          {routes.map(route => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 text-white rounded-lg transition-colors duration-150 hover:bg-green-700/80 ${isActive ? 'bg-green-800 font-bold' : ''}`
              }
            >
              {route.icon}
              <span className="text-base">{route.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-white rounded-lg mb-6 mx-2 hover:bg-green-700/80 transition-colors font-semibold text-base"
        title="Sair"
      >
        <LogOut size={20} />
        <span>Sair</span>
      </button>
    </aside>
  );
}
