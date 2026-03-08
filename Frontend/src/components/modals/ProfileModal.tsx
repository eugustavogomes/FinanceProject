
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  email?: string | null;
  name?: string | null;
  onLogout?: () => void;
}

export default function ProfileModal({ isOpen, onClose, email, name, onLogout }: Props) {
  const [tab, setTab] = useState<'settings' | 'account'>('settings');
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
              Configurações
            </button>
            <button
              className={`w-full text-left px-3 py-2 rounded ${tab === 'account' ? 'bg-white font-semibold shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
              onClick={() => setTab('account')}
            >
              Conta
            </button>
          </div>

          <div className="p-6 flex-1">
            {tab === 'settings' ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Aqui você pode ajustar preferências do aplicativo.</p>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Tema</p>
                      <p className="text-sm text-gray-500">Selecionar modo claro/escuro</p>
                    </div>
                    <button className="px-3 py-1 bg-gray-200 rounded">Alternar</button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Notificações</p>
                      <p className="text-sm text-gray-500">Ativar alertas</p>
                    </div>
                    <button className="px-3 py-1 bg-gray-200 rounded">Alternar</button>
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
                  <p className="text-sm text-gray-600">Nome</p>
                  <p className="font-medium text-gray-800">{userName}</p>
                </div>
                <div className="pt-4 border-t flex justify-end gap-3">
                  <button className="px-4 py-2 rounded bg-red-500 text-white" onClick={handleLogout}>Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
