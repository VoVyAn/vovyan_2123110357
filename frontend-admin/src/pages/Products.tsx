import { useEffect, useState } from 'react';
import productService from '../api/productService';
import type { Product, Category, ProductDTO } from '../api/productService';
import { dispatchNotification } from '../utils/notifications';
import { BASE_URL } from '../api/apiClient';

export const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState<ProductDTO>({
    categoryId: 0,
    name: '',
    description: '',
    price: 0,
    quantity: 0,
    imageUrl: ''
  });

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        productService.getProducts(),
        productService.getCategories()
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      dispatchNotification(`Đã xóa sản phẩm ID: ${id}`);
      fetchData();
    } catch (error) {
      alert('Error deleting product');
    }
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        categoryId: product.categoryId,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        imageUrl: product.imageUrl
      });
    } else {
      setEditingProduct(null);
      setFormData({
        categoryId: categories[0]?.id || 0,
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        imageUrl: ''
      });
    }
    setIsModalOpen(true);
  };

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await productService.uploadImage(file);
      setFormData({ ...formData, imageUrl: res.data.url });
    } catch (error) {
      console.error("Lỗi upload ảnh:", error);
      alert('Error uploading image. Check console for details.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploading) return;
    
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, formData);
        dispatchNotification(`Đã cập nhật sản phẩm: ${formData.name}`);
      } else {
        await productService.createProduct(formData);
        dispatchNotification(`Đã thêm sản phẩm mới: ${formData.name}`);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert('Error saving product');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Products Management</h1>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>+ Add New Product</button>
      </div>
      
      {loading ? (
        <div className="p-8">Loading products...</div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      <img src={getImageUrl(product.imageUrl)} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.price.toLocaleString()} VND</td>
                    <td>{product.quantity}</td>
                    <td>{categories.find(c => c.id === product.categoryId)?.name || product.categoryId}</td>
                    <td>
                      <button className="btn btn-secondary btn-sm" style={{ marginRight: '8px' }} onClick={() => handleOpenModal(product)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product.id)}>Delete</button>
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
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <h2 className="text-2xl font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSave}>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group col-span-2">
                  <label className="form-label">Product Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-input" 
                    value={formData.categoryId} 
                    onChange={e => setFormData({...formData, categoryId: parseInt(e.target.value)})}
                  >
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Price (VND)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} 
                    required 
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Quantity</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={formData.quantity} 
                    onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} 
                    required 
                  />
                </div>
                <div className="form-group col-span-2">
                  <label className="form-label">Product Image</label>
                  <div className="flex gap-4 items-start">
                    <div 
                      className="w-24 h-24 rounded border-2 border-dashed border-slate-700 flex items-center justify-center overflow-hidden bg-slate-900"
                    >
                      {formData.imageUrl ? (
                        <img src={getImageUrl(formData.imageUrl)} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-slate-500 text-xs">No Image</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <input 
                        type="file" 
                        accept="image/*"
                        className="form-input mb-2" 
                        onChange={handleImageUpload}
                      />
                      <input 
                        type="text" 
                        className="form-input text-xs" 
                        placeholder="Or enter image URL manually"
                        value={formData.imageUrl} 
                        onChange={e => setFormData({...formData, imageUrl: e.target.value})} 
                      />
                      {uploading && <p className="text-xs text-primary-color mt-1">Uploading...</p>}
                    </div>
                  </div>
                </div>
                <div className="form-group col-span-2">
                  <label className="form-label">Description</label>
                  <textarea 
                    className="form-input" 
                    rows={3}
                    style={{ resize: 'none' }}
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    required 
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button 
                  type="submit" 
                  className="btn btn-primary px-8"
                  disabled={uploading}
                >
                  {uploading ? 'Waiting for upload...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
