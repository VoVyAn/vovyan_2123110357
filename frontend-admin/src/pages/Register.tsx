import { useState } from 'react';
import apiClient from '../api/apiClient';
import { Lock, User, Mail, UserPlus } from 'lucide-react';
import './Login.css'; // Dùng chung style với Login

export const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await apiClient.post('/users/register', { 
        username, 
        password, 
        fullName,
        role: 'User' // Mặc định là User
      });
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (err: any) {
      console.error('Register Error:', err.response?.data);
      setError('Không thể đăng ký tài khoản. Tên đăng nhập có thể đã tồn tại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">F&B</div>
          <h1>Đăng ký tài khoản</h1>
          <p>Tham gia vào hệ thống quản lý nhà hàng</p>
        </div>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ color: '#10b981', fontSize: '18px', marginBottom: '10px' }}>Đăng ký thành công!</div>
            <p>Đang chuyển hướng về trang đăng nhập...</p>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Họ và tên</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ paddingLeft: '44px' }}
                  placeholder="Nhập họ và tên"
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)} 
                  required 
                />
              </div>
            </div>

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

            <button className="login-btn" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <UserPlus size={18} />
              {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
            </button>
          </form>
        )}

        <div className="login-footer">
          Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
        </div>
      </div>
    </div>
  );
};
