import { NavLink } from 'react-router-dom';

const pages = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Transações', path: '/transactions' },
  { name: 'Categorias', path: '/categories' },
  { name: 'Metas', path: '/goals' },
  { name: 'Perfil', path: '/profile' },
  { name: 'Investimentos', path: '/investments' },
];

export default function Header() {

  return (
    <header className="bg-green-700 py-4 shadow-md mb-6 px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">Dashboard Financeiro</h1>
          <nav className="flex gap-6">
            {pages.map((page) => (
              <NavLink
                key={page.path}
                to={page.path}
                className={({ isActive }) =>
                  `text-white px-3 py-2 rounded hover:bg-green-800 transition ${
                    isActive ? 'bg-green-900 font-semibold' : ''
                  }`
                }
              >
                {page.name}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={undefined}
            className="text-white px-4 py-2 rounded hover:bg-green-800 transition font-semibold"
          >
            Sair
          </button>
        </div>
    </header>
  );
}