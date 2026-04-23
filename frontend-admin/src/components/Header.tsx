import { Bell, Search, User } from 'lucide-react';
import './Header.css';

export const Header = () => {
  return (
    <header className="header glass-panel">
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search orders, products..." className="search-input" />
      </div>

      <div className="header-actions">
        <button className="action-btn">
          <Bell size={20} />
          <span className="badge-indicator"></span>
        </button>
        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role">Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
};
