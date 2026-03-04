import { useState } from 'react';
import { Pen, Trash2, Plus, Check, X, Loader } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';

export default function CategoriesPage() {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useCategories();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryType, setNewCategoryType] = useState('');
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newCategoryName.trim()) return;
    
    try {
      setActionLoading('add');
      await createCategory(newCategoryName.trim(), newCategoryType.trim() || undefined);
      setNewCategoryName('');
      setNewCategoryType('');
      setShowAddForm(false);
    } catch (error: any) {
      alert('Erro ao criar categoria: ' + error.message);
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

  const startEdit = (category: any) => {
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Categorias</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-olive-green text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
          style={{ backgroundColor: '#8fa68e' }}
        >
          <Plus size={16} />
          {showAddForm ? 'Cancelar' : 'Nova Categoria'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
          <h3 className="text-lg font-semibold mb-4">Nova Categoria</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">nome</label>
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Ex. Alimentação"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-green/20 focus:border-olive-green"
                style={{ '--olive-green': '#8fa68e' } as any}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo (opcional)</label>
              <input
                type="text"
                value={newCategoryType}
                onChange={(e) => setNewCategoryType(e.target.value)}
                placeholder="Ex. Despesa"
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-olive-green/20 focus:border-olive-green"
                style={{ '--olive-green': '#8fa68e' } as any}
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              disabled={!newCategoryName.trim() || actionLoading === 'add'}
              className="bg-olive-green text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: '#8fa68e' }}
            >
              {actionLoading === 'add' ? <Loader size={16} className="animate-spin" /> : <Check size={16} />}
              Adicionar
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewCategoryName('');
                setNewCategoryType('');
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2"
            >
              <X size={16} />
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4 border-b">
          <h3 className="text-lg font-semibold">Suas Categorias</h3>
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(category)}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="Editar categoria"
                      >
                        <Pen size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id, category.name)}
                        disabled={actionLoading === `delete-${category.id}`}
                        className="text-red-600 hover:text-red-800 p-1 rounded disabled:opacity-50"
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
    </main>
  );
}