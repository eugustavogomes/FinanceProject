import Header from '../components/Header'

export default function ProfilePage() {
  return (
    <div>
      <Header />
      <main className="p-6">
        <h2 className="text-2xl font-bold mb-6">Profile</h2>
        <p>Personal information and user settings.</p>
      </main>
    </div>
  );
}