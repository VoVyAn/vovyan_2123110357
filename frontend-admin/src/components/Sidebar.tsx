import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Utensils, ListOrdered, LogOut, Users, Ticket, Monitor } from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { path: '/categories', name: 'Categories', icon: <ListOrdered size={20} /> },
  { path: '/products', name: 'Products', icon: <Utensils size={20} /> },
  { path: '/orders', name: 'Orders', icon: <ShoppingBag size={20} /> },
  { path: '/users', name: 'Users', icon: <Users size={20} /> },
  { path: '/discounts', name: 'Mã giảm giá', icon: <Ticket size={20} /> },
  { path: '/pos', name: 'POS System', icon: <Monitor size={20} /> },
];

export const Sidebar = () => {
  const role = localStorage.getItem('role') || 'Phucvu';
  const username = localStorage.getItem('username') || '';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  const filteredNavItems = navItems.filter(item => {
    const userRole = role.toUpperCase();
    const userName = username.toLowerCase();
    
    // Admin / Manager / user with 'admin' name have full access
    if (userRole === 'ADMIN' || userRole === 'MANAGER' || userName === 'admin') return true;
    
    // Captain access
    if (userRole === 'CAPTAIN' || userRole === 'USERCAPTAIN') {
      return ['Dashboard', 'Orders', 'Mã giảm giá', 'POS System'].includes(item.name);
    }
    
    // Phucvu access
    if (userRole === 'PHUCVU' || userRole === 'USERPHUCVU') {
      return ['POS System'].includes(item.name);
    }
    
    // Default fallback: only POS if unknown
    return item.name === 'POS System';
  });

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="logo-icon">F&B</div>
        <h2>Admin Portal</h2>
      </div>
      
      <nav className="sidebar-nav">
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-link logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
