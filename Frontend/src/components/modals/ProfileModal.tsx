
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { User, Settings, LogOut, Eye, EyeClosed, Info } from 'lucide-react';
import { changePassword } from '../../hooks/useChangePassword';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  email?: string | null;
  name?: string | null;
  onLogout?: () => void;
}

export default function ProfileModal({ isOpen, onClose, email, name, onLogout }: Props) {
  const [tab, setTab] = useState<'settings' | 'account' | 'info'>('settings');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
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

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordError('New password must be different from current password.');
      return;
    }

    try {
      setIsSavingPassword(true);
      await changePassword({ currentPassword, newPassword });
      setPasswordSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      const message = error?.response?.data ?? 'Could not change password. Please check your current password.';
      setPasswordError(typeof message === 'string' ? message : 'Could not change password.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center md:items-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-3xl mx-4 my-6">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-emerald-400/5 to-transparent pointer-events-none" />
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100/80 dark:border-gray-800/80 overflow-hidden min-h-[360px] max-h-[80vh] flex flex-col">
        
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <div className="dark:bg-gray-900/90 bg-gray-50/90 md:w-48 p-4 flex md:flex-col gap-2 border-b md:border-b-0 md:border-r border-gray-100/80 dark:border-gray-800/80">
            <button
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition ${
                tab === 'settings'
                  ? 'bg-white shadow-sm text-gray-900 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/60'
              }`}
              onClick={() => setTab('settings')}
            >
              <Settings className="w-4 h-4 inline mr-2 text-gray-400" />
              Settings
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition ${
                tab === 'account'
                  ? 'bg-white shadow-sm text-gray-900 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/60'
              }`}
              onClick={() => setTab('account')}
            >
              <User className="w-4 h-4 inline mr-2 text-gray-400" />
              Account
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition ${
                tab === 'info'
                  ? 'bg-white shadow-sm text-gray-900 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-800/60'
              }`}
              onClick={() => setTab('info')}
            >
              <Info className="w-4 h-4 inline mr-2 text-gray-400" />
              Info
            </button>
          </div>

          <div className="p-6 flex-1 bg-white dark:bg-gray-950 text-foreground space-y-6 overflow-y-auto">
            {tab === 'settings' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
                  <p className="text-sm text-muted-foreground">Adjust how Simple Finance behaves and looks for you.</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-3 border rounded-xl border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Theme</p>
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
                  <div className="flex items-center justify-between p-3 border rounded-xl border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Notifications</p>
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
            )}
            {tab === 'account' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account</h2>
                  <p className="text-sm text-muted-foreground">Manage your account information and password.</p>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div className="p-3 border rounded-xl border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium text-foreground break-all">{userEmail}</p>
                  </div>
                  <div className="p-3 border rounded-xl border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80">
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium text-foreground">{userName}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Change password</p>
                    <p className="text-xs text-muted-foreground">Update your password securely. Make sure to use a strong one.</p>
                    <div className="space-y-2">
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-emerald-200 bg-background text-foreground"
                          placeholder="Current password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
                          aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                        >
                          {showCurrentPassword ? (
                            <EyeClosed className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-emerald-200 bg-background text-foreground"
                          placeholder="New password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
                          aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                        >
                          {showNewPassword ? (
                            <EyeClosed className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="w-full border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-emerald-200 bg-background text-foreground"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
                          aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                        >
                          {showConfirmPassword ? (
                            <EyeClosed className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    {passwordError && (
                      <p className="text-xs text-red-500 mt-1">{passwordError}</p>
                    )}
                    {passwordSuccess && (
                      <p className="text-xs text-emerald-600 mt-1">{passwordSuccess}</p>
                    )}
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleChangePassword}
                        disabled={isSavingPassword}
                        className={`px-4 py-2 rounded-full text-sm font-medium text-white shadow-sm transition flex items-center gap-2 ${
                          isSavingPassword
                            ? 'bg-gray-500 cursor-wait'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        {isSavingPassword ? 'Saving...' : 'Save new password'}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800 pt-4">
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
            {tab === 'info' && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">About & Billing</h2>
                  <p className="text-sm text-muted-foreground">Learn more about Simple Finance and the current preview plan.</p>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-xl border-emerald-200/70 dark:border-emerald-700/60 bg-emerald-50/80 dark:bg-emerald-900/30">
                  <div className="mt-0.5 h-6 w-6 rounded-full bg-emerald-500/90 flex items-center justify-center text-xs font-bold text-white shadow">
                    SF
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Simple Finance</p>
                    <p className="text-xs text-muted-foreground">
                      A focused personal finance dashboard to help you track expenses, goals and investments with a clean, minimal interface.
                    </p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                      This is an early preview build — features like billing and collaboration are still coming soon.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 p-3 border rounded-xl border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Billing & usage</p>
                      <p className="text-xs text-muted-foreground">Starter plan · Mock data only</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300 px-2 py-0.5 text-[11px] font-medium">
                      Free preview
                    </span>
                  </div>
                  <div className="space-y-1 mt-2">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Monthly budget usage</span>
                      <span>45% of mock limit</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                      <div className="h-full w-[45%] bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2 text-[11px] text-muted-foreground">
                    <span>Mock billing — no real charges.</span>
                    <button
                      type="button"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
                    >
                      Learn more
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
