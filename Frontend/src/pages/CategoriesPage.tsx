import { useEffect, useState } from 'react';
import { Trash2, Loader, Pencil } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import AddCategoryModal from '../components/modals/AddCategoryModal';
import ConfirmationModal from '../components/modals/ConfirmationModal';

/**
 * CategoriesPage
 * Main page component for listing, searching and managing categories.
 * - Displays categories fetched from `useCategories`.
 * - Supports searching, inline editing, creating via modal and deletion
 *   via a confirmation modal.
 */
export default function CategoriesPage() {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } =
    useCategories();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; name?: string } | null>(null);

  const [filtered, setFiltered] = useState<any[]>([]);

  useEffect(() => {
    const next = categories.filter((c: any) =>
      String(c.name || '').toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(next);
  }, [categories, search]);

  /**
   * handleAdd
   * Create a new category using the hook and close the add modal on success.
   * - sets `actionLoading` to 'add' while the request runs.
   * - on error, shows an alert with the error message.
   */
  const handleAdd = async (name: string, type?: string) => {
    try {
      setActionLoading('add');
      await createCategory(name, type);
      setShowAddModal(false);
    } catch (error: any) {
      alert('Error creating category: ' + (error.message || String(error)));
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * handleEdit
   * Save edits for a category with the given id.
   * - validates the editName is not empty.
   * - sets a per-action loading flag while calling `updateCategory`.
   * - clears editing state on success and shows an alert on error.
   */
  const handleEdit = async (id: string) => {
    if (!editName.trim()) return;

    try {
      setActionLoading(`edit-${id}`);
      await updateCategory(id, editName.trim(), editType.trim() || undefined);
      setEditingId(null);
      setEditName('');
      setEditType('');
    } catch (error: any) {
      alert('Error editing category: ' + (error.message || String(error)));
    } finally {
      setActionLoading(null);
    }
  };

  /**
   * handleDelete
   * Open the confirmation modal for deleting a category.
   * - stores the id and name in `confirmTarget` and opens the modal.
   */
  function handleDelete(id: string, name: string) {
    setConfirmTarget({ id, name });
    setConfirmOpen(true);
  }

  /**
   * handleConfirmDelete
   * Called when the user confirms category deletion.
   * - shows a loading state and calls `deleteCategory`.
   * - hides the modal and clears state after completion.
   * - on error, displays an alert with the error message.
   */
  async function handleConfirmDelete() {
    if (!confirmTarget) return;
    setConfirmLoading(true);
    setActionLoading(`delete-${confirmTarget.id}`);
    try {
      await deleteCategory(confirmTarget.id);
    } catch (error: any) {
      alert('Error deleting category: ' + (error.message || String(error)));
    } finally {
      setActionLoading(null);
      setConfirmLoading(false);
      setConfirmOpen(false);
      setConfirmTarget(null);
    }
  }

  /**
   * startEdit
   * Begin inline editing for the given category by populating edit fields
   * and setting `editingId`.
   */
  const startEdit = (category: any) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditType(category.type || '');
  };

  /**
   * cancelEdit
   * Cancel inline editing and clear temporary edit state.
   */
  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditType('');
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-gray-500">Manage your categories</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories"
            className="w-full md:w-64 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-200"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {loading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-40" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">Error loading: {String(error)}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No categories found</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            >
              Add category
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filtered.map((category: any) => (
              <div key={category.id} className="p-4 flex items-center justify-between">
                {editingId === category.id ? (
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                        placeholder="Type (optional)"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(category.id)}
                          disabled={!editName.trim() || actionLoading === `edit-${category.id}`}
                          className="px-3 py-1 bg-emerald-500 text-white rounded"
                        >
                          {actionLoading === `edit-${category.id}` ? (
                            <Loader className="animate-spin" />
                          ) : (
                            'Save'
                          )}
                        </button>

                        <button onClick={cancelEdit} className="px-3 py-1 bg-gray-200 rounded">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <h4 className="font-semibold text-gray-800">{category.name}</h4>
                      {category.type && <p className="text-sm text-gray-600">{category.type}</p>}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => startEdit(category)}
                        className="px-2 py-1 rounded border border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        disabled={actionLoading === `delete-${category.id}`}
                        className="px-2 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50"
                      >
                        {actionLoading === `delete-${category.id}` ? (
                          <Loader className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setShowAddModal(true)}
        aria-label="Add category"
        title="Add category"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center text-2xl hover:bg-green-500 transition"
      >
        +
      </button>

      <AddCategoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={async (data: any) => {
          try {
            await handleAdd(data.name, data.type);
            return { success: true };
          } catch (err: any) {
            return { success: false, error: err?.message || String(err) };
          }
        }}
      />
      <ConfirmationModal
        isOpen={confirmOpen}
        title="Delete category"
        message={confirmTarget ? `Are you sure you want to delete "${confirmTarget.name}"? This action cannot be undone.` : 'Are you sure?'}
        confirmLabel="Yes, I want to delete"
        cancelLabel="Cancel"
        loading={confirmLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setConfirmOpen(false); setConfirmTarget(null); }}
      />
    </main>
  );
}