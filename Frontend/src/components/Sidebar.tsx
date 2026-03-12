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
      className={`fixed h-full z-40 flex flex-col justify-between shadow-xl border-r border-gray-800/80 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 transition-[width] duration-700 ease-in-out ${expanded ? 'w-56' : 'w-20'}`}
    >
      <div>
        <div className="flex items-center justify-center py-4 min-h-[64px] border-b border-gray-800/70">
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
        <nav className={`flex flex-col transition-all duration-500 ease-in-out ${expanded ? 'px-2 pt-3' : 'px-1 pt-3'}`}>
          {expanded && (
            <p className="px-3 pb-2 text-[10px] font-semibold tracking-[0.18em] text-gray-500/80 uppercase">
              Overview
            </p>
          )}
          <div className="flex flex-col gap-1">
            {routes.map(route => (
              <NavLink
                key={route.path}
                to={route.path}
                title={!expanded ? route.name : undefined}
                className={({ isActive }) =>
                  `relative group flex items-center ${expanded ? 'gap-3 px-3 py-2' : 'justify-center py-2'} rounded-xl text-sm transition-all duration-300 ease-out
                   ${isActive
                      ? 'bg-emerald-500/15 text-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/70'}
                  `
                }
              >
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-gray-800/60 group-hover:bg-gray-700/80 group-hover:scale-105 text-gray-200 group-hover:text-white transition-all duration-300">
                  {route.icon}
                </span>
                <span
                  className={`whitespace-nowrap text-[13px] font-medium transition-all duration-300 ease-out ${expanded ? 'opacity-100 ml-2 translate-x-0' : 'opacity-0 -translate-x-1'}`}
                  style={{ width: expanded ? 'auto' : 0, overflow: 'hidden', display: expanded ? 'inline' : 'inline-block' }}
                >
                  {route.name}
                </span>
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-[2px] rounded-full bg-emerald-400 opacity-0 group-[.active]:opacity-100" />
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
      <div
        className={`flex items-center ${expanded ? 'gap-3 px-3 py-2' : 'justify-center py-3'} text-white rounded-xl mb-3 mx-2 bg-gray-900/40 hover:bg-gray-800/80 transition-all duration-300 ease-out font-semibold cursor-pointer border border-transparent hover:border-gray-700/80`}
        onClick={() => setShowProfile(true)}
        title="Perfil"
      >
        {!expanded && <User size={15} />}
        {expanded && (
          <>
            <div className="flex items-center justify-center h-10 w-8 rounded-full bg-gray-600 text-white font-semibold text-sm shadow-sm bg-opacity-50">
              {userInitial}
            </div>
            <div
              className={`transition-opacity duration-500 ease-in-out ${expanded ? 'opacity-100 ' : 'opacity-0'}`}
              style={{ width: expanded ? 'auto' : 0, overflow: 'hidden', display: expanded ? 'inline-flex' : 'inline-block' }}
            >
              <div className="flex flex-col min-w-0">
                <span className="block text-white font-bold text-lg truncate">{user?.name || 'Perfil'}</span>
                <span className="block text-white text-xs font-normal truncate">{user?.email || ''}</span>
              </div>
            </div>
            <ChevronsUpDown className="ml-auto w-4 h-4 text-emerald-100" />
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
