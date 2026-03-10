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
    <header className="h-14 bg-gray-600 flex items-center px-4 shadow-sm border-b border-gray-700/40">
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/10 transition focus:outline-none focus:ring-2 focus:ring-white/60"
        aria-label={expanded ? 'Recolher menu lateral' : 'Expandir menu lateral'}
      >
        {expanded ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
      </button>
      <h1 className="ml-3 text-white font-semibold text-lg truncate">{title}</h1>
    </header>
  );
}
