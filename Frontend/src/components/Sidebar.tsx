import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowUpDown, ChartNoAxesCombined, User, Target, LayoutList, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo3.png';


const routes = [
  { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={15} /> },
  { name: 'Transactions', path: '/transactions', icon: <ArrowUpDown size={15} /> },
  { name: 'Categories', path: '/categories', icon: <LayoutList size={15} /> },
  { name: 'Goals', path: '/goals', icon: <Target size={15} /> },
  { name: 'Investments', path: '/investments', icon: <ChartNoAxesCombined size={15} /> },
  { name: 'Profile', path: '/profile', icon: <User size={15} /> },
];

import React from 'react';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [expanded, setExpanded] = React.useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside
      className={`fixed top-0 left-0 h-full z-40 flex flex-col justify-between shadow-lg bg-gradient-to-b from-green-900 via-green-700 to-green-800 transition-all duration-500 ease-in-out ${expanded ? 'w-56' : 'w-20'}`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div>
        <div className="flex items-center justify-center py-6 min-h-[64px]">
          {expanded ? (
            <img src={logo} alt="Simple Finance Logo" className="w-40 transition-all duration-200" />
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
        <nav className={`flex flex-col gap-2 mt-4 transition-all duration-500 ease-in-out ${expanded ? 'px-4' : 'px-1'}`}>
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
      <button
        onClick={handleLogout}
        className={`flex items-center ${expanded ? 'gap-3 px-4 py-3' : 'justify-center py-3'} text-white rounded-lg mb-6 mx-2 hover:bg-green-700/80 transition-all duration-500 ease-in-out font-semibold text-base`}
        title="Sair"
      >
        <LogOut size={20} />
        <span
          className={`transition-opacity duration-500 ease-in-out ${expanded ? 'opacity-100 ml-2' : 'opacity-0 ml-0'}`}
          style={{ width: expanded ? 'auto' : 0, overflow: 'hidden', display: expanded ? 'inline' : 'inline-block' }}
        >Sair</span>
      </button>
    </aside>
  );
}
