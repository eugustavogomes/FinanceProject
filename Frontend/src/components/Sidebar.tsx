import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowUpDown, ChartNoAxesCombined, User, Target, LayoutList } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import ProfileModal from '../components/modals/ProfileModal';
import { useState } from 'react';


const routes = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={15} /> },
  { name: 'Transactions', path: '/transactions', icon: <ArrowUpDown size={15} /> },
  { name: 'Categories', path: '/categories', icon: <LayoutList size={15} /> },
  { name: 'Goals', path: '/goals', icon: <Target size={15} /> },
  { name: 'Investments', path: '/investments', icon: <ChartNoAxesCombined size={15} /> },
];

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside
      className={`fixed h-full z-40 flex flex-col justify-between shadow-lg bg-green-800 transition-all duration-700 ease-in-out ${expanded ? 'w-56' : 'w-20'}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div>
        <div className="flex items-start justify-center py-6 min-h-[64px]">
          {expanded ? (
            <span className="select-none text-white"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '1.3rem',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontWeight: 800 }}>Simple</span>
                <span style={{ fontWeight: 300, marginLeft: 6 }}>Finance</span>
              </span>
          ) : (
            <span
              className="select-none text-white"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '1.5rem',
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontWeight: 700 }}>S</span>
              <span style={{ fontWeight: 400 }}>F</span>
            </span>
          )}
        </div>
        <nav className={`flex flex-col gap-2 mt-2 transition-all duration-600 ease-in-out ${expanded ? 'px-4' : 'px-1'}`}>
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
        <span
          className={`transition-opacity duration-500 ease-in-out ${expanded ? 'opacity-100 ml-2' : 'opacity-0 ml-0'}`}
          style={{ width: expanded ? 'auto' : 0, overflow: 'hidden', display: expanded ? 'inline' : 'inline-block' }}
        >
          {expanded ? (user?.email || 'Perfil') : ''}
        </span>
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
