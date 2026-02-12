import Header from '../components/Header'

export default function GoalsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Goals</h2>
        <p className="text-gray-300">Set and track your financial goals.</p>
      </main>
    </div>
  );
}