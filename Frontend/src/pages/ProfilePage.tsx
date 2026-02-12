import Header from '../components/Header'

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Profile</h2>
        <p className="text-gray-300">Personal information and user settings.</p>
      </main>
    </div>
  );
}