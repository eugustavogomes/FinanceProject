import Header from '../components/Header'

export default function InvestmentsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Investments</h2>
        <p className="text-gray-300">Track your investments and profitability.</p>
      </main>
    </div>
  );
}