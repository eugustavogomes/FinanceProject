import { useState } from 'react';
import { Trash2, Check, X, Loader, Pencil } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import AddCategoryModal from '../components/modals/AddCategoryModal';

export default function CategoriesPage() {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useCategories();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAdd = async (name: string, type?: string) => {
    try {
      setActionLoading('add');
      await createCategory(name, type);
      setShowAddModal(false);
    } catch (error: any) {
      alert('Erro ao criar categoria: ' + (error.message || String(error)));
    } finally {
      setActionLoading(null);
    }
  };

  const handleEdit = async (id: string) => {
    if (!editName.trim()) return;

    try {
      setActionLoading(`edit-${id}`);
      await updateCategory(id, editName.trim(), editType.trim() || undefined);
      setEditingId(null);
      setEditName('');
      setEditType('');
    } catch (error: any) {
      alert('Erro ao editar categoria: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir a categoria "${name}"?`)) return;

    try {
      setActionLoading(`delete-${id}`);
      await deleteCategory(id);
    } catch (error: any) {
      alert('Erro ao excluir categoria: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const HandleEdit = (category: any) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditType(category.type || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditType('');
  };

  return (
    <main className="p-6 w-full ">

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-xl font-bold">Categorias</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <Loader size={32} className="animate-spin mx-auto mb-2" />
            <p className="text-gray-600">Carregando categorias...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">Erro ao carregar: {error}</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">Nenhuma categoria encontrada</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {categories.map((category) => (
              <div key={category.id} className="p-4">
                {editingId === category.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-green/20 focus:border-olive-green"
                        style={{ '--olive-green': '#8fa68e' } as any}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={editType}
                        onChange={(e) => setEditType(e.target.value)}
                        placeholder="Tipo (opcional)"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-green/20 focus:border-olive-green"
                        style={{ '--olive-green': '#8fa68e' } as any}
                      />
                    </div>
                    <div className="md:col-span-2 flex gap-2">
                      <button
                        onClick={() => handleEdit(category.id)}
                        disabled={!editName.trim() || actionLoading === `edit-${category.id}`}
                        className="bg-olive-green text-white px-3 py-1 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50"
                        style={{ backgroundColor: '#8fa68e' }}
                      >
                        {actionLoading === `edit-${category.id}` ? <Loader size={14} className="animate-spin" /> : <Check size={14} />}
                        Salvar
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
                      >
                        <X size={14} />
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-800">{category.name}</h4>
                      {category.type && <p className="text-sm text-gray-600">{category.type}</p>}
                    </div>
                    <div className="flex">
                      <button
                        onClick={() => HandleEdit(category)}
                        className="shadow-md rounded-xl border border-gray-200 text-gray-400 p-2 hover:bg-gray-400 hover:text-white rounded mr-2"
                        title="Editar categoria"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        disabled={actionLoading === `delete-${category.id}`}
                        className="shadow-md rounded-xl border border-red-200 hover:bg-red-600 hover:border-white p-2 text-red-400 hover:text-white rounded"
                        title="Excluir categoria"
                      >
                        {actionLoading === `delete-${category.id}` ? (
                          <Loader size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className='mt-12' >

        <button
          onClick={() => setShowAddModal(true)}
          aria-label="Adicionar categoria"
          title="Adicionar categoria"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-600 text-white shadow-lg flex items-center justify-center text-2xl hover:bg-green-500 transition"
        >
          +
        </button>
      </div>

      <AddCategoryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={async (data) => {
          const res = { success: true } as { success: boolean; error?: string };
          try {
            await handleAdd(data.name, data.type);
            return res;
          } catch (err: any) {
            return { success: false, error: err?.message || String(err) };
          }
        }}
      />
    </main>
  );
}