import { useEffect, useState } from 'react';
import adminService from '../api/adminService';
import type { Reservation } from '../api/adminService';
import { Edit, Trash2, Plus, X, Check } from 'lucide-react';

export const Bookings = () => {
  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<Partial<Reservation>>({});

  const fetchBookings = async () => {
    try {
      const res = await adminService.getReservations();
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      customerName: '',
      phone: '',
      email: '',
      reservationDate: new Date().toISOString().slice(0, 16),
      numberOfGuests: 2,
      storeName: 'BỜM - Kitchen & Wine Bar',
      status: 'Pending',
      note: ''
    });
    setIsEdit(false);
    setShowModal(true);
  };

  const handleOpenEdit = (booking: Reservation) => {
    setFormData({
      ...booking,
      reservationDate: new Date(booking.reservationDate).toISOString().slice(0, 16)
    });
    setIsEdit(true);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa lịch đặt bàn này?")) {
      try {
        await adminService.deleteReservation(id);
        fetchBookings();
      } catch (error) {
        console.error("Error deleting booking:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        reservationDate: new Date(formData.reservationDate || '').toISOString()
      };

      if (isEdit && formData.id) {
        await adminService.updateReservation(formData.id, payload);
      } else {
        await adminService.createReservation(payload);
      }
      setShowModal(false);
      fetchBookings();
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("Lỗi khi lưu thông tin. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (booking: Reservation, newStatus: string) => {
    try {
      await adminService.updateReservation(booking.id, { 
        ...booking, 
        status: newStatus,
        reservationDate: new Date(booking.reservationDate).toISOString()
      });
      fetchBookings();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="bookings-page">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Quản Lý Đặt Bàn (Bookings)</h1>
        <button className="btn btn-primary flex items-center gap-2" onClick={handleOpenAdd}>
          <Plus size={18} /> Thêm Đặt Bàn
        </button>
      </div>

      {loading ? (
        <div className="p-8">Đang tải danh sách đặt bàn...</div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Khách Hàng</th>
                  <th>Số Điện Thoại</th>
                  <th>Ngày Đặt</th>
                  <th>Số Khách</th>
                  <th>Chi Nhánh</th>
                  <th>Trạng Thái</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div className="font-bold">{booking.customerName}</div>
                      <div className="text-sm opacity-60">{booking.email}</div>
                    </td>
                    <td>{booking.phone}</td>
                    <td>
                      <div>{new Date(booking.reservationDate).toLocaleDateString()}</div>
                      <div className="text-sm font-bold text-primary">
                        {new Date(booking.reservationDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td>{booking.numberOfGuests} người</td>
                    <td>{booking.storeName || 'N/A'}</td>
                    <td>
                      <span className={`badge ${
                        booking.status === 'Confirmed' ? 'badge-success' : 
                        booking.status === 'Cancelled' ? 'badge-danger' : 
                        booking.status === 'Completed' ? 'badge-info' : 'badge-warning'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn btn-sm btn-info" onClick={() => handleOpenEdit(booking)} title="Sửa">
                          <Edit size={16} />
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(booking.id)} title="Xóa">
                          <Trash2 size={16} />
                        </button>
                        {booking.status === 'Pending' && (
                          <button className="btn btn-sm btn-success" onClick={() => updateStatus(booking, 'Confirmed')} title="Xác nhận">
                            <Check size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="booking-modal-overlay">
          <div className="booking-modal-content glass-panel">
            <div className="modal-header">
              <h2 className="modal-title">{isEdit ? 'Chỉnh Sửa Đặt Bàn' : 'Thêm Đặt Bàn Mới'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Tên khách hàng</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Nhập tên khách..."
                    value={formData.customerName || ''} 
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Số điện thoại</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="09xxx..."
                    value={formData.phone || ''} 
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="khach@example.com"
                    value={formData.email || ''} 
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Số lượng khách</label>
                  <input 
                    type="number" 
                    className="form-control" 
                    value={formData.numberOfGuests || 2} 
                    onChange={(e) => setFormData({...formData, numberOfGuests: parseInt(e.target.value)})}
                    min="1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Ngày & Giờ đặt</label>
                  <input 
                    type="datetime-local" 
                    className="form-control" 
                    value={formData.reservationDate || ''} 
                    onChange={(e) => setFormData({...formData, reservationDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Chi nhánh</label>
                  <select 
                    className="form-control" 
                    value={formData.storeName || ''} 
                    onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                  >
                    <option value="BỜM - Kitchen & Wine Bar">BỜM - Kitchen & Wine Bar</option>
                    <option value="BỜM - District 1">BỜM - District 1</option>
                    <option value="BỜM - District 7">BỜM - District 7</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Trạng thái</label>
                  <select 
                    className="form-control" 
                    value={formData.status || 'Pending'} 
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="form-group mt-4">
                <label className="form-label">Ghi chú</label>
                <textarea 
                  className="form-control" 
                  rows={3} 
                  placeholder="Yêu cầu đặc biệt..."
                  value={formData.note || ''} 
                  onChange={(e) => setFormData({...formData, note: e.target.value})}
                ></textarea>
              </div>
              <div className="modal-actions mt-6">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Hủy bỏ</button>
                <button type="submit" className="btn btn-primary btn-lg">
                  {isEdit ? 'Cập Nhật Lịch Hẹn' : 'Tạo Đặt Bàn'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .booking-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: flex-start; /* Ensure top is never clipped */
          z-index: 100000;
          padding: 60px 20px; /* Increased top padding */
          overflow-y: auto;
        }
        .booking-modal-content {
          width: 100%;
          max-width: 650px;
          background: #1e293b;
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.1);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
          animation: modalFadeInDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          margin-bottom: 60px;
        }
        @keyframes modalFadeInDown {
          from { transform: translateY(-30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
        }
        .modal-title {
          font-size: 1.5rem;
          margin: 0;
          color: white;
          font-weight: 700;
        }
        .modal-body {
          padding: 1.5rem;
          overflow-y: visible; /* Let the overlay handle scrolling if needed */
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
        }
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: #94a3b8;
          font-size: 0.875rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        .modal-actions {
          padding: 1.5rem;
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          border-top: 1px solid rgba(255,255,255,0.1);
          flex-shrink: 0;
        }
        .btn-lg {
          padding: 0.8rem 2rem;
          font-weight: 600;
        }
        .mt-4 { margin-top: 1rem; }
        .mt-6 { margin-top: 1.5rem; }
        
        @media (max-width: 600px) {
          .form-grid { grid-template-columns: 1fr; }
          .booking-modal-content { border-radius: 0; margin-top: 0; }
          .booking-modal-overlay { padding: 0; }
        }
      `}} />
    </div>
  );
};
