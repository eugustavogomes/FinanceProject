import { useEffect, useState } from 'react';
import { Trash2, Loader, Pencil } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import AddCategoryModal from '../components/modals/AddCategoryModal';
import ConfirmationModal from '../components/modals/ConfirmationModal';
import { IconButton } from '../components/ui/IconButton';
import SearchInput from '../components/ui/SearchInput';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';

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
  const [modalInitialData, setModalInitialData] = useState<{ name: string; type?: string } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState<{ id: string; name?: string } | null>(null);

  const [filtered, setFiltered] = useState<any[]>([]);
  const [typeFilter, setTypeFilter] = useState<'Income' | 'Expense'>('Income');

  useEffect(() => {
    const next = categories
      .map((c: any) => {
        const rawType = c.type;
        const typeLabel = typeof rawType === 'string'
          ? rawType
          : rawType === 0
            ? 'Income'
            : rawType === 1
              ? 'Expense'
              : '';

        return { ...c, __typeLabel: typeLabel };
      })
      .filter((c: any) => c.__typeLabel === typeFilter)
      .filter((c: any) =>
        String(c.name || '').toLowerCase().includes(search.toLowerCase())
      );

    setFiltered(next);
  }, [categories, search, typeFilter]);

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
  const handleEdit = async (id: string, name: string, type?: string) => {
    if (!name.trim()) return;

    try {
      setActionLoading(`edit-${id}`);
      await updateCategory(id, name.trim(), type?.trim() || undefined);
    } catch (error: any) {
      alert('Error editing category: ' + (error.message || String(error)));
    } finally {
      setActionLoading(null);
      setEditingId(null);
      setModalInitialData(null);
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
    setModalInitialData({ name: category.name, type: category.__typeLabel || '' });
    setShowAddModal(true);
  };

  return (
    <main className="p-3">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex flex-col gap-3 md:grid md:grid-cols-[auto,1fr,auto] md:items-center md:gap-4">
          <div className="text-sm font-medium text-foreground">Filtrar categorias</div>

          <div className="flex justify-center">
            <div className="inline-flex rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-1 text-xs font-medium">
              {(['Income', 'Expense'] as const).map((t) => {
                const active = typeFilter === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTypeFilter(t)}
                    className={`px-4 py-1 rounded-full transition-colors ${
                      active
                        ? 'bg-green-600 text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

         <SearchInput value={search} onChange={setSearch} placeholder="Search categories..." />
        </div>
        {loading ? (
          <div className="p-6">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40" />
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">Error loading: {String(error)}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-200">No categories found</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            >
              Add category
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((category: any) => {
              const rawType = category.type;
              const typeLabel = typeof category.__typeLabel === 'string'
                ? category.__typeLabel
                : typeof rawType === 'string'
                  ? rawType
                  : rawType === 0
                    ? 'Income'
                    : rawType === 1
                      ? 'Expense'
                      : '';

              const typeClasses = typeLabel === 'Income'
                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                : typeLabel === 'Expense'
                  ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300';

              return (
                <div key={category.id} className="p-4 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{category.name}</h4>
                      {typeLabel && (
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${typeClasses}`}>
                          {typeLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <IconButton
                      onClick={() => startEdit(category)}
                    >
                      <Pencil className="w-4 h-4" />
                    </IconButton>

                    <IconButton
                      onClick={() => handleDelete(category.id, category.name)}
                      variant="danger"
                    >
                      {actionLoading === `delete-${category.id}` ? (
                        <Loader className="animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                        </>
                      )}
                    </IconButton>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <FloatingActionButton
        onClick={() => setShowAddModal(true)}
        aria-label="Add category"
        title="Add category"
      >
        +
      </FloatingActionButton>

      <AddCategoryModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setEditingId(null); setModalInitialData(null); }}
        initialData={modalInitialData}
        onSubmit={async (data: any) => {
          try {
            if (editingId) {
              await handleEdit(editingId, data.name, data.type);
            } else {
              await handleAdd(data.name, data.type);
            }
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