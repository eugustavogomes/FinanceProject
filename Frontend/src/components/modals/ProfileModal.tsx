
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { User, Settings, LogOut } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  email?: string | null;
  name?: string | null;
  onLogout?: () => void;
}

export default function ProfileModal({ isOpen, onClose, email, name, onLogout }: Props) {
  const [tab, setTab] = useState<'settings' | 'account'>('settings');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const auth = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!isOpen) return null;

  const userEmail = email ?? auth.user?.email ?? 'Not available';
  const userName = name ?? auth.user?.name ?? 'Not available';
  const handleLogout = () => {
    if (onLogout) onLogout();
    else auth.logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-0 z-10 w-full max-w-lg shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">

        <div className="flex flex-col md:flex-row">
          <div className="dark:bg-gray-800 bg-white md:w-40 p-3 flex md:flex-col gap-2 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700">
            <button
              className={`w-full text-left px-3 py-2 rounded ${
                tab === 'settings'
                  ? 'bg-gray-100 dark:bg-gray-900 font-semibold shadow-sm'
                  : 'text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setTab('settings')}
            >
              <Settings className="w-4 h-4 inline mr-2 text-muted-foreground" />
              Settings
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded ${
                tab === 'account'
                  ? 'bg-gray-100 dark:bg-gray-900 font-semibold shadow-sm'
                  : 'text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setTab('account')}
            >
              <User className="w-4 h-4 inline mr-2 text-muted-foreground" />
              Account
            </button>
          </div>

          <div className="p-6 flex-1 dark:bg-gray-900 bg-white text-foreground space-y-6">
            {tab === 'settings' ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Here you can adjust application preferences.</p>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div>
                      <p className="font-medium">Theme</p>
                      <p className="text-sm text-muted-foreground">Select light/dark mode</p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={theme === 'dark'}
                      onClick={toggleTheme}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-300 ${
                        theme === 'dark' ? 'bg-emerald-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                          theme === 'dark' ? 'translate-x-5' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div>
                      <p className="font-medium">Notifications</p>
                      <p className="text-sm text-muted-foreground">Enable alerts</p>
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
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium text-foreground">{userName}</p>
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Change password</p>
                    <p className="text-xs text-muted-foreground">Prototype: soon this will be connected to the backend to securely change your password.</p>
                    <div className="space-y-2">
                      <input
                        type="password"
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 bg-background text-foreground"
                        placeholder="Current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <input
                        type="password"
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 bg-background text-foreground"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <input
                        type="password"
                        className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 bg-background text-foreground"
                        placeholder="Confirm new password"
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
                        Save new password (soon)
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 border-t border-gray-100 dark:border-gray-700 pt-4">
                    <button
                      className="inline-flex items-center gap-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
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
