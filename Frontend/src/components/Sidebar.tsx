import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowUpDown, ChartNoAxesCombined, User, Target, LayoutList, ChevronsUpDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ProfileModal from '../components/modals/ProfileModal';
import logo from '../assets/logo.png';
import logomini from '../assets/logomini.png';
import { useState } from 'react';



const routes = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={15} /> },
  { name: 'Transactions', path: '/transactions', icon: <ArrowUpDown size={15} /> },
  { name: 'Categories', path: '/categories', icon: <LayoutList size={15} /> },
  { name: 'Goals', path: '/goals', icon: <Target size={15} /> },
  { name: 'Investments', path: '/investments', icon: <ChartNoAxesCombined size={15} /> },
];

interface SidebarProps {
  expanded: boolean;
}

export default function Sidebar({ expanded }: SidebarProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const userInitial = (user?.name || user?.email || 'U').trim().charAt(0).toUpperCase();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside
      className={`fixed h-full z-40 flex flex-col justify-between shadow-lg bg-green-800 transition-all duration-700 ease-in-out ${expanded ? 'w-56' : 'w-20'}`}
    >
      <div>
        <div className="flex items-center justify-center py-3 min-h-[64px]">
          {expanded ? (
            <span className="select-none text-white inline-flex items-center justify-center">
              <img
                src={logo}
                alt="SimpleFinance Logo"
                className="max-h-12 w-auto"
              />
            </span>
          ) : (
            <span className="select-none text-white inline-flex items-center justify-center">
              <img
                src={logomini}
                alt="SimpleFinance Logo compacta"
                className="h-12 w-auto"
              />
            </span>
          )}
        </div>
        <nav className={`flex flex-col transition-all duration-600 ease-in-out ${expanded ? 'px-4' : 'px-1'}`}>
          {routes.map(route => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                `flex items-center ${expanded ? 'gap-3 px-3 py-2' : 'justify-center py-2'} text-white rounded-lg transition-all duration-500 ease-in-out hover:bg-green-700/80 ${isActive ? 'bg-green-800 font-bold' : ''}`
              }
            >
              {route.icon}
              <span
                className={`text-base transition-opacity duration-500 ease-in-out ${expanded ? 'opacity-100 ml-2' : 'opacity-0 ml-0'}`}
                style={{ width: expanded ? 'auto' : 0, overflow: 'hidden', display: expanded ? 'inline' : 'inline-block' }}
              >{route.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div
        className={`flex items-center ${expanded ? 'gap-3 px-4 py-3' : 'justify-center py-3'} text-white rounded-lg mb-6 mx-2 hover:bg-green-700/80 transition-all duration-500 ease-in-out font-semibold text-base cursor-pointer`}
        onClick={() => setShowProfile(true)}
        title="Perfil"
      >
        {!expanded && <User size={15} />}
        {expanded && (
          <>
            <div className="flex items-center justify-center h-11 w-11 rounded-full bg-emerald-500 text-white font-semibold text-lg shadow-sm">
              {userInitial}
            </div>
            <div
              className={`transition-opacity duration-500 ease-in-out ${expanded ? 'opacity-100 ' : 'opacity-0 ml-0'}`}
              style={{ width: expanded ? 'auto' : 0, overflow: 'hidden', display: expanded ? 'inline-flex' : 'inline-block' }}
            >
              <div className="flex flex-col min-w-0">
                <span className="block text-white font-bold text-xl truncate">{user?.name || 'Perfil'}</span>
                <span className="block text-white text-sm font-normal truncate">{user?.email || ''}</span>
              </div>
            </div>
            <ChevronsUpDown className="ml-auto w-6 h-6 text-emerald-100" />
          </>
        )}
      </div>

      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        email={user?.email}
        name={user?.name}
        onLogout={handleLogout}
      />
    </aside>
  );
}
