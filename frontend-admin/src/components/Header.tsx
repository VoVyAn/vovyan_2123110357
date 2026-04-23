import { useState, useEffect } from 'react';
import { Bell, Search, User } from 'lucide-react';
import './Header.css';

export const Header = () => {
  const [username, setUsername] = useState<string>('Admin');
  const [role, setRole] = useState<string>('Administrator');
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentToast, setCurrentToast] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    if (storedUser) setUsername(storedUser);
    if (storedRole) setRole(storedRole);

    const handleNotification = (event: any) => {
      const message = event.detail;
      setNotifications(prev => [message, ...prev].slice(0, 5));
      
      // Auto-popup toast
      setCurrentToast(message);
      setTimeout(() => setCurrentToast(null), 4000);
    };

    window.addEventListener('pos-notification', handleNotification);
    return () => window.removeEventListener('pos-notification', handleNotification);
  }, []);

  return (
    <header className="header glass-panel">
      {currentToast && (
        <div className="toast-notification animate-slide-down">
          <div className="toast-icon"><Bell size={16} /></div>
          <div className="toast-content">{currentToast}</div>
        </div>
      )}
      
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search orders, products..." className="search-input" />
      </div>

      <div className="header-actions">
        <div className="notification-wrapper">
          <button className="action-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            {notifications.length > 0 && <span className="badge-indicator">{notifications.length}</span>}
          </button>
          
          {showNotifications && (
            <div className="notifications-dropdown glass-panel">
              <h4>Thông báo mới</h4>
              {notifications.length === 0 ? (
                <p className="no-notif">Chưa có thông báo</p>
              ) : (
                <ul>
                  {notifications.map((n, i) => (
                    <li key={i} className="notif-item">{n}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info">
            <span className="user-name">{username}</span>
            <span className="user-role">{role}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
