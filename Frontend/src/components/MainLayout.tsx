import Sidebar from './Sidebar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-20">
        {children}
      </main>
    </div>
  );
}
