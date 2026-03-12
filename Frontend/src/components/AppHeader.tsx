import { useLocation } from 'react-router-dom';
import { PanelLeftOpen, PanelLeftClose } from 'lucide-react';

interface Props {
  expanded: boolean;
  onToggle: () => void;
}

const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transações',
  '/categories': 'Categorias',
  '/goals': 'Metas',
  '/investments': 'Investimentos',
  '/profile': 'Perfil',
};

export default function AppHeader({ expanded, onToggle }: Props) {
  const location = useLocation();
  const path = location.pathname;
  const title = TITLES[path] || 'Simple Finance';

  return (
    <header className="h-14 flex items-center justify-between px-4 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border-b border-gray-800/80 shadow-md/40">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggle}
          className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-gray-900/60 hover:bg-gray-800/90 text-gray-100 border border-gray-700/80 hover:border-emerald-500/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400/70 focus:ring-offset-2 focus:ring-offset-gray-950"
          aria-label={expanded ? 'Recolher menu lateral' : 'Expandir menu lateral'}
        >
          <span className="absolute inset-0 rounded-full bg-emerald-400/10 opacity-0 group-hover:opacity-100 transition" />
          {expanded ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
        </button>
        <div className="flex flex-col">
          <h1 className="text-white font-semibold text-lg leading-tight truncate">{title}</h1>

        </div>
      </div>

    </header>
  );
}
