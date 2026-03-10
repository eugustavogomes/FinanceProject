import { useState } from 'react';
import Sidebar from './Sidebar';
import AppHeader from './AppHeader';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const contentMarginLeft = sidebarExpanded ? '14rem' : '5rem'; // w-56 / w-20

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar expanded={sidebarExpanded} />
      <div
        className="flex flex-col transition-all duration-700 ease-in-out"
        style={{ marginLeft: contentMarginLeft }}
      >
        <AppHeader
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((prev) => !prev)}
        />
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
