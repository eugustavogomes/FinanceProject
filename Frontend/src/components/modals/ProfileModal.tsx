
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Settings } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  email?: string | null;
  name?: string | null;
  onLogout?: () => void;
}

export default function ProfileModal({ isOpen, onClose, email, name, onLogout }: Props) {
  const [tab, setTab] = useState<'settings' | 'account'>('settings');
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const auth = useAuth();

  if (!isOpen) return null;

  const userEmail = email ?? auth.user?.email ?? 'Não disponível';
  const userName = name ?? auth.user?.name ?? 'Não disponível';
  const handleLogout = () => {
    if (onLogout) onLogout();
    else auth.logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-0 z-10 w-full max-w-lg shadow-lg overflow-hidden">

        <div className="flex flex-col md:flex-row">
          <div className="bg-gray-50 md:w-40 p-3 flex md:flex-col gap-2">
            <button
              className={`w-full text-left px-3 py-2 rounded ${tab === 'settings' ? 'bg-white font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setTab('settings')}
            >
              <Settings className="w-4 h-4 inline mr-2 text-gray-600" />
              Settings
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded ${tab === 'account' ? 'bg-white font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setTab('account')}
            >
              <User className="w-4 h-4 inline mr-2 text-gray-600" />
              Account
            </button>
          </div>

          <div className="p-6 flex-1">
            {tab === 'settings' ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Here you can adjust application preferences.</p>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Theme</p>
                      <p className="text-sm text-gray-500">Select light/dark mode</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={darkModeEnabled}
                      onClick={() => setDarkModeEnabled((v) => !v)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                        darkModeEnabled ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                          darkModeEnabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Notifications</p>
                      <p className="text-sm text-gray-500">Enable alerts</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={notificationsEnabled}
                      onClick={() => setNotificationsEnabled((v) => !v)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                        notificationsEnabled ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                          notificationsEnabled ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-800">{userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-800">{userName}</p>
                </div>
                <div className="pt-4 border-t space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-800">Alterar senha</p>
                    <p className="text-xs text-gray-500">Protótipo: em breve será conectado ao backend para alterar sua senha com segurança.</p>
                    <div className="space-y-2">
                      <input
                        type="password"
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200"
                        placeholder="Senha atual"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <input
                        type="password"
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200"
                        placeholder="Nova senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <input
                        type="password"
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200"
                        placeholder="Confirmar nova senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        disabled
                        className="px-4 py-2 rounded bg-gray-900 text-white text-sm opacity-60 cursor-not-allowed"
                      >
                        Salvar nova senha (em breve)
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 border-t pt-4">
                    <button className="px-4 py-2 rounded bg-red-500 text-white" onClick={handleLogout}>Logout</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
