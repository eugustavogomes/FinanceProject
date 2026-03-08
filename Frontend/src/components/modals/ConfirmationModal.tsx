
interface Props {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  title = 'Confirm',
  message = 'Are you sure?',
  confirmLabel = 'Yes, I want to delete',
  cancelLabel = 'Cancel',
  loading = false,
  onConfirm,
  onCancel
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onCancel} />
      <div role="dialog" aria-modal="true" className="bg-white rounded-lg shadow-lg z-10 w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-500 flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full border-2 border-white border-t-transparent w-4 h-4" />
            ) : null}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
