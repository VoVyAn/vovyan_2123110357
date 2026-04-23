import { useState } from 'react';
import apiClient from '../api/apiClient';
import { Lock, User } from 'lucide-react';
import './Login.css';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await apiClient.post('/users/login', { username, password });
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      const role = user.role || 'User';
      localStorage.setItem('role', role);
      
      if (role.toUpperCase() === 'USERPHUCVU' || role.toUpperCase() === 'PHUCVU') {
        window.location.href = '/pos';
      } else {
        window.location.href = '/';
      }
    } catch (err: any) {
      console.error('Login Error:', err.response?.data);
      setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">F&B</div>
          <h1>Chào mừng trở lại</h1>
          <p>Đăng nhập vào hệ thống quản trị</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Tên đăng nhập</label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input 
                type="text" 
                className="form-input" 
                style={{ paddingLeft: '44px' }}
                placeholder="Nhập tên đăng nhập"
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input 
                type="password" 
                className="form-input" 
                style={{ paddingLeft: '44px' }}
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '16px', textAlign: 'center' }}>{error}</p>}

          <button className="login-btn" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng nhập ngay'}
          </button>
        </form>

        <div className="login-hint">
          <strong>Gợi ý:</strong> admin / admin123
        </div>

        <div className="login-footer">
          Chưa có tài khoản? <a href="#">Liên hệ quản trị viên</a>
        </div>
      </div>
    </div>
  );
};
