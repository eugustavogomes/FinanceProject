import { NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut } from 'lucide-react';
import logo from '../assets/logo3.png';

const pages = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Transactions', path: '/transactions' },
  { name: 'Categories', path: '/categories' },
  { name: 'Goals', path: '/goals' },
  { name: 'Profile', path: '/profile' },
  { name: 'Investments', path: '/investments' },
];

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="bg-gradient-to-r from-green-900 via-green-600 to-green-800 py-3 shadow-lg mb-0 px-8">
      <div className="flex items-center justify-between">
        <NavLink to="/dashboard" >
          <img src={logo} alt="Simple Finance Logo" className="w-40 h-5 inline" />
        </NavLink>
        <nav className="flex gap-4">
          {pages.filter(page => page.name !== 'Dashboard').map((page) => (
            <NavLink
              key={page.path}
              to={page.path}
              className={({ isActive }) =>
                `text-white text-sm p-1 border-b-2 transition ${isActive ? 'border-gray-200 font-semibold' : 'border-transparent hover:border-white/60'
                }`
              }
            >
              {page.name}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="text-white py-2 rounded hover:bg-white/10 transition font-semibold text-xs flex items-center"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}