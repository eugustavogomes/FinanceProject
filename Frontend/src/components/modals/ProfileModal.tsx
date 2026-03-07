
interface Props {
  isOpen: boolean;
  onClose: () => void;
  email?: string | null;
  name?: string | null;
  onLogout: () => void;
}

export default function ProfileModal({ isOpen, onClose, email, name, onLogout }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-6 z-10 w-full max-w-sm">
        <h3 className="text-lg font-semibold mb-4">Perfil</h3>
        <div className="mb-4">
          <p className="text-sm text-gray-600">Email</p>
          <p className="font-medium text-gray-800">{email || 'Não disponível'}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600">Nome</p>
          <p className="font-medium text-gray-800">{name || 'Não disponível'}</p>
        </div>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>Fechar</button>
          <button className="px-4 py-2 rounded bg-red-500 text-white" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
