import { useEffect, useState } from 'react';
import adminService from '../api/adminService';
import type { OrderItem, AdminOrderDetail } from '../api/adminService';
import { Eye, X, Printer } from 'lucide-react';

export const Orders = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderDetail | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  const fetchOrders = async () => {
    try {
      const res = await adminService.getOrders();
      setOrders(res.data.items);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await adminService.getSettings();
      setSettings(res.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchSettings();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await adminService.updateOrderStatus(id, newStatus);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const handleViewDetails = async (id: number) => {
    try {
      const res = await adminService.getOrderById(id);
      setSelectedOrder(res.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="orders-page">
      <h1 className="page-title">Quản Lý Đơn Hàng</h1>
      
      {loading ? (
        <div className="p-8">Đang tải danh sách đơn hàng...</div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Mã Đơn</th>
                  <th>Khách Hàng</th>
                  <th>Tổng Tiền</th>
                  <th>Trạng Thái</th>
                  <th>Ngày Tạo</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#ORD-{order.id}</td>
                    <td>{order.userId ? `User ID: ${order.userId}` : 'Khách vãng lai'}</td>
                    <td>{order.totalAmount.toLocaleString()} VND</td>
                    <td>
                      <span className={`badge ${
                        order.status === 'Completed' || order.status === 'Paid' ? 'badge-success' : 
                        order.status === 'Cancelled' ? 'badge-danger' : 'badge-warning'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td className="flex gap-2">
                      <button 
                        className="btn btn-primary btn-sm flex items-center gap-1"
                        onClick={() => handleViewDetails(order.id)}
                      >
                        <Eye size={14} /> Xem
                      </button>
                      <select 
                        className="btn btn-secondary btn-sm"
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      >
                        <option value="Pending">Chờ xử lý</option>
                        <option value="Preparing">Đang chuẩn bị</option>
                        <option value="Completed">Hoàn thành</option>
                        <option value="Paid">Đã thanh toán</option>
                        <option value="Cancelled">Hủy đơn</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content invoice-modal animate-scale-in">
            <div className="modal-header no-print">
              <h3>Chi tiết hóa đơn #{selectedOrder.id}</h3>
              <div className="flex gap-2">
                <button className="btn btn-secondary" onClick={handlePrint}>
                  <Printer size={18} /> In hóa đơn
                </button>
                <button className="btn-close" onClick={() => setShowModal(false)}>
                  <X size={24} />
                </button>
              </div>
            </div>

            <div id="printable-invoice" className="invoice-container">
              <div className="invoice-header">
                <div className="restaurant-info">
                  <h2>{settings?.restaurantName || 'VOVYAN RESTAURANT'}</h2>
                  <p>{settings?.address || 'Địa chỉ đang cập nhật'}</p>
                  <p>SĐT: {settings?.phone || 'N/A'}</p>
                </div>
                <div className="invoice-meta">
                  <h1>HÓA ĐƠN</h1>
                  <p>Mã: #ORD-{selectedOrder.id}</p>
                  <p>Ngày: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  <p>Giờ: {new Date(selectedOrder.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>

              <div className="invoice-body">
                <div className="customer-info-grid">
                  <div>
                    <p><strong>Khách hàng:</strong> {selectedOrder.customerName}</p>
                    {selectedOrder.tableCode && (
                      <p><strong>Bàn:</strong> {selectedOrder.tableCode}</p>
                    )}
                    <p><strong>Nhân viên:</strong> {selectedOrder.staffName || 'Hệ thống'}</p>
                  </div>
                  <div className="text-right">
                    <p><strong>Hình thức:</strong> {selectedOrder.paymentMethod || 'N/A'}</p>
                    <p><strong>Trạng thái:</strong> {selectedOrder.status}</p>
                  </div>
                </div>

                <table className="invoice-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th className="text-right">SL</th>
                      <th className="text-right">Đơn giá</th>
                      <th className="text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.productName}</td>
                        <td className="text-right">{item.quantity}</td>
                        <td className="text-right">{item.price.toLocaleString()}đ</td>
                        <td className="text-right">{(item.price * item.quantity).toLocaleString()}đ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="invoice-summary">
                  <div className="summary-row">
                    <span>Tạm tính:</span>
                    <span>{selectedOrder.items.reduce((sum, i) => sum + i.price * i.quantity, 0).toLocaleString()}đ</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="summary-row discount">
                      <span>Giảm giá ({selectedOrder.discountCode}):</span>
                      <span>-{selectedOrder.discountAmount.toLocaleString()}đ</span>
                    </div>
                  )}
                  <div className="summary-row">
                    <span>Phí dịch vụ:</span>
                    <span>{selectedOrder.serviceFee.toLocaleString()}đ</span>
                  </div>
                  <div className="summary-row">
                    <span>Thuế VAT:</span>
                    <span>{selectedOrder.vat.toLocaleString()}đ</span>
                  </div>
                  <div className="summary-row total">
                    <span>TỔNG CỘNG:</span>
                    <span>{selectedOrder.totalAmount.toLocaleString()}đ</span>
                  </div>
                </div>
              </div>

              <div className="invoice-footer">
                <p>Cảm ơn quý khách. Hẹn gặp lại!</p>
                <div className="qr-placeholder">
                  {/* Có thể thêm QR thanh toán ở đây */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          backdrop-filter: blur(4px);
        }
        .invoice-modal {
          background: white;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          border-radius: 12px;
          color: #333;
        }
        .modal-header {
          padding: 1rem 2rem;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8f9fa;
        }
        .invoice-container {
          padding: 2.5rem;
        }
        .invoice-header {
          display: flex;
          justify-content: space-between;
          border-bottom: 2px solid #333;
          padding-bottom: 1rem;
          margin-bottom: 2rem;
        }
        .restaurant-info h2 { margin: 0; color: #1a1a1a; }
        .invoice-meta { text-align: right; }
        .invoice-meta h1 { margin: 0; color: #1a1a1a; letter-spacing: 2px; }
        
        .customer-info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }
        
        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 2rem;
        }
        .invoice-table th {
          border-bottom: 2px solid #eee;
          padding: 0.75rem;
          text-align: left;
        }
        .invoice-table td {
          padding: 0.75rem;
          border-bottom: 1px solid #eee;
        }
        .text-right { text-align: right !important; }
        
        .invoice-summary {
          margin-left: auto;
          width: 250px;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 0.4rem 0;
        }
        .summary-row.total {
          border-top: 2px solid #333;
          margin-top: 0.5rem;
          padding-top: 0.5rem;
          font-weight: bold;
          font-size: 1.2rem;
        }
        .discount { color: #e53e3e; }
        
        .invoice-footer {
          text-align: center;
          margin-top: 3rem;
          border-top: 1px dashed #ccc;
          padding-top: 1.5rem;
          font-style: italic;
        }

        @media print {
          .no-print { display: none !important; }
          .modal-overlay { background: white; position: absolute; }
          .invoice-modal { box-shadow: none; width: 100%; max-width: none; }
          body * { visibility: hidden; }
          #printable-invoice, #printable-invoice * { visibility: visible; }
          #printable-invoice { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
};
