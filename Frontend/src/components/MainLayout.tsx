import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import AppHeader from './AppHeader';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const contentMarginLeft = sidebarExpanded ? '14rem' : '5rem'; // w-56 / w-20

  useEffect(() => {
    if (user && typeof user.isSidebarExpanded === 'boolean') {
      setSidebarExpanded(user.isSidebarExpanded);
    }
  }, [user]);

  const handleToggleSidebar = () => {
    setSidebarExpanded((prev) => {
      const next = !prev;
      api.put('/users/me/preferences', { isSidebarExpanded: next }).catch(() => {
        // ignore errors; local UI still updates
      });
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar expanded={sidebarExpanded} />
      <div
        className="flex flex-col transition-all duration-700 ease-in-out"
        style={{ marginLeft: contentMarginLeft }}
      >
        <AppHeader
          expanded={sidebarExpanded}
          onToggle={handleToggleSidebar}
        />
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
