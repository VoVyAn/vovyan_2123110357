import { useEffect, useState } from 'react';
import adminService from '../api/adminService';
import type { OrderItem } from '../api/adminService';

export const Orders = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await adminService.updateOrderStatus(id, newStatus);
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div>
      <h1 className="page-title">Orders Management</h1>
      
      {loading ? (
        <div className="p-8">Loading orders...</div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#ORD-{order.id}</td>
                    <td>{order.userId}</td>
                    <td>{order.totalAmount.toLocaleString()} VND</td>
                    <td>
                      <span className={`badge ${order.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>
                      <select 
                        className="btn btn-secondary btn-sm"
                        value={order.status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
