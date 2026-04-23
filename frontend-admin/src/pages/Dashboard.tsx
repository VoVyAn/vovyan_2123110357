import { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, Utensils, Users } from 'lucide-react';
import adminService from '../api/adminService';
import type { DashboardData, OrderItem } from '../api/adminService';
import './Dashboard.css';

export const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('role')?.toUpperCase();
    if (role === 'USERPHUCVU' || role === 'PHUCVU') {
      window.location.href = '/pos';
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, ordersRes] = await Promise.all([
          adminService.getDashboard(),
          adminService.getOrders({ pageSize: 5 })
        ]);
        setData(dashRes.data);
        setRecentOrders(ordersRes.data.items);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  const statCards = [
    { 
      title: "Revenue Today", 
      value: `${(data?.revenueToday ?? 0).toLocaleString()} VND`, 
      increase: "+14%", 
      icon: <DollarSign size={24} />, 
      color: "primary" 
    },
    { 
      title: "Orders Today", 
      value: (data?.orderCountToday ?? 0).toString(), 
      increase: "+5%", 
      icon: <ShoppingBag size={24} />, 
      color: "success" 
    },
    { 
      title: "Active Tables", 
      value: `${data?.tableStatus?.serving ?? 0} / ${data?.tableStatus ? (data.tableStatus.empty + data.tableStatus.serving + data.tableStatus.reserved) : 0}`, 
      increase: "Normal", 
      icon: <Utensils size={24} />, 
      color: "warning" 
    },
    { 
      title: "Total Customers", 
      value: "1,245", // Backend doesn't have total customers in dashboard DTO yet
      increase: "+22%", 
      icon: <Users size={24} />, 
      color: "accent" 
    }
  ];

  return (
    <div>
      <h1 className="page-title">Dashboard Overview</h1>
      
      <div className="stats-grid">
        {statCards.map((stat, idx) => (
          <div key={idx} className={`card stat-card delay-${idx * 100}`}>
            <div className="stat-content">
              <div>
                <p className="stat-title">{stat.title}</p>
                <h3 className="stat-value">{stat.value}</h3>
              </div>
              <div className={`stat-icon-wrapper bg-${stat.color}-light text-${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div className="stat-footer">
              <span className={`trend ${stat.increase.startsWith('+') ? 'text-success' : 'text-warning'}`}>
                {stat.increase}
              </span>
              <span className="stat-subtitle">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        <div className="card delay-300 recent-orders">
          <div className="card-header">
            <h3>Recent Orders</h3>
            <button className="btn btn-secondary">View All</button>
          </div>
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#ORD-{order.id}</td>
                    <td>{order.userId}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>{order.totalAmount.toLocaleString()} VND</td>
                    <td>
                      <span className={`badge ${order.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
