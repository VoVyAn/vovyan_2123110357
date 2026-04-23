import { useEffect, useState } from 'react';
import discountService from '../api/discountService';
import type { DiscountCode, DiscountCodeDTO } from '../api/discountService';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Ticket, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Percent,
  Check
} from 'lucide-react';
import './DiscountCodes.css';

export const DiscountCodes = () => {
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null);
  
  const [formData, setFormData] = useState<DiscountCodeDTO>({
    code: '',
    percentage: 0,
    expiryDate: '',
    isActive: true
  });

  const fetchData = async () => {
    try {
      const res = await discountService.getDiscounts();
      setDiscounts(res.data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa mã giảm giá này?')) return;
    try {
      await discountService.deleteDiscount(id);
      fetchData();
    } catch (error) {
      alert('Lỗi khi xóa mã giảm giá');
    }
  };

  const handleOpenModal = (discount?: DiscountCode) => {
    if (discount) {
      setEditingDiscount(discount);
      setFormData({
        code: discount.code,
        percentage: discount.percentage,
        expiryDate: discount.expiryDate ? discount.expiryDate.split('T')[0] : '',
        isActive: discount.isActive
      });
    } else {
      setEditingDiscount(null);
      setFormData({
        code: '',
        percentage: 0,
        expiryDate: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDiscount) {
        await discountService.updateDiscount(editingDiscount.id, formData);
      } else {
        await discountService.createDiscount(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert('Lỗi khi lưu mã giảm giá');
    }
  };

  return (
    <div className="discounts-page">
      <div className="discounts-header">
        <div>
          <h1>Mã Giảm Giá <span>Khuyến Mãi</span></h1>
          <p>Thiết lập các chương trình ưu đãi để thu hút khách hàng.</p>
        </div>
        <button className="btn-add-discount" onClick={() => handleOpenModal()}>
          <Plus size={24} />
          Tạo Mã Mới
        </button>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-color"></div>
          <p className="text-slate-400">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="discounts-grid">
          {discounts.map((discount) => (
            <div key={discount.id} className="discount-card">
              <div className="card-status">
                {discount.isActive ? (
                  <span className="status-badge status-active">
                    <CheckCircle size={14} /> HOẠT ĐỘNG
                  </span>
                ) : (
                  <span className="status-badge status-inactive">
                    <XCircle size={14} /> TẠM DỪNG
                  </span>
                )}
              </div>

              <div className="card-icon">
                <Ticket size={28} />
              </div>

              <div className="discount-info">
                <h3>{discount.code}</h3>
                <div className="discount-value">
                  {discount.percentage}% <span>OFF</span>
                </div>
              </div>

              <div className="card-meta">
                <Calendar size={16} />
                <span>
                  {discount.expiryDate ? `Hết hạn: ${new Date(discount.expiryDate).toLocaleDateString('vi-VN')}` : 'Không giới hạn thời gian'}
                </span>
              </div>

              <div className="card-actions">
                <button className="btn-edit" onClick={() => handleOpenModal(discount)}>
                  <Edit2 size={18} /> Chỉnh sửa
                </button>
                <button className="btn-delete" onClick={() => handleDelete(discount.id)}>
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">
              <Ticket size={28} />
              {editingDiscount ? 'Cập Nhật Mã' : 'Tạo Ưu Đãi Mới'}
            </h2>

            <form onSubmit={handleSave} className="modal-form">
              <div className="form-group">
                <label>Mã Code Niêm Yết</label>
                <input 
                  type="text" 
                  className="form-control form-control-lg" 
                  value={formData.code} 
                  onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} 
                  placeholder="VÍ DỤ: CHILL2024"
                  required 
                />
              </div>

              <div className="form-group">
                <label>Tỷ Lệ Giảm Giá (%)</label>
                <div className="input-with-icon">
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    className="form-control form-control-lg" 
                    value={formData.percentage} 
                    onChange={e => setFormData({...formData, percentage: parseFloat(e.target.value)})} 
                    required 
                  />
                  <Percent className="input-icon" size={24} />
                </div>
              </div>

              <div className="form-group">
                <label>Ngày Hết Hạn Hiệu Lực</label>
                <div className="input-with-icon">
                  <input 
                    type="date" 
                    className="form-control" 
                    value={formData.expiryDate} 
                    onChange={e => setFormData({...formData, expiryDate: e.target.value})} 
                  />
                  <Calendar className="input-icon" size={20} />
                </div>
              </div>

              <div 
                className={`status-toggle ${formData.isActive ? 'active' : ''}`}
                onClick={() => setFormData({...formData, isActive: !formData.isActive})}
              >
                <div className="toggle-info">
                  <div className="toggle-circle">
                    {formData.isActive && <Check size={12} />}
                  </div>
                  <span className="font-bold">Kích hoạt mã giảm giá</span>
                </div>
                <div className="text-xs font-black opacity-50">
                  {formData.isActive ? 'ENABLE' : 'DISABLE'}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy Bỏ</button>
                <button type="submit" className="btn-save">
                  {editingDiscount ? 'Cập Nhật Ngay' : 'Tạo Mã Giảm Giá'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
