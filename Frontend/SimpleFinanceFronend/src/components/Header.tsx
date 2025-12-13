import { NavLink } from 'react-router-dom';

const pages = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Transactions', path: '/transactions' },
  { name: 'Categories', path: '/categories' },
  { name: 'Goals', path: '/goals' },
  { name: 'Profile', path: '/profile' },
  { name: 'Investments', path: '/investments' },
];

export default function Header() {

  return (
    <header className="bg-gradient-to-r from-green-900 via-green-600 to-green-800 py-4 shadow-lg mb-0 px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-2xl font-bold">Finance Dashboard</h1>
        <nav className="flex gap-4">
          {pages.map((page) => (
            <NavLink
              key={page.path}
              to={page.path}
              className={({ isActive }) =>
                `text-white text-sm p-1 border-b-2 transition ${
                  isActive ? 'border-gray-200 font-semibold' : 'border-transparent hover:border-white/60'
                }`
              }
            >
              {page.name}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={undefined}
          className="text-white px-3 py-2 rounded hover:bg-white/10 transition font-semibold text-xs"
        >
          Logout
        </button>
      </div>
    </header>
  );
}