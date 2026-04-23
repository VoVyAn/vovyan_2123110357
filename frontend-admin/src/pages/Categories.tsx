import { useEffect, useState } from 'react';
import productService from '../api/productService';
import type { Category, CategoryDTO } from '../api/productService';
import { dispatchNotification } from '../utils/notifications';

export const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryDTO>({ name: '' });

  const fetchCategories = async () => {
    try {
      const res = await productService.getCategories();
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await productService.deleteCategory(id);
      dispatchNotification(`Đã xóa danh mục ID: ${id}`);
      fetchCategories();
    } catch (error) {
      alert('Error deleting category');
    }
  };

  const handleOpenModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({ name: cat.name });
    } else {
      setEditingCategory(null);
      setFormData({ name: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await productService.updateCategory(editingCategory.id, formData);
        dispatchNotification(`Đã cập nhật danh mục: ${formData.name}`);
      } else {
        await productService.createCategory(formData);
        dispatchNotification(`Đã thêm danh mục mới: ${formData.name}`);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      alert('Error saving category');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Categories Management</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>+ Add Category</button>
      </div>

      {loading ? (
        <div className="p-8">Loading categories...</div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.id}</td>
                    <td>{cat.name}</td>
                    <td>
                      <button className="btn btn-secondary btn-sm" style={{ marginRight: '8px' }} onClick={() => handleOpenModal(cat)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in">
            <h2 className="text-2xl font-bold mb-6">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Main Course, Drinks..."
                  value={formData.name} 
                  onChange={e => setFormData({ name: e.target.value })} 
                  required 
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary px-8">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
