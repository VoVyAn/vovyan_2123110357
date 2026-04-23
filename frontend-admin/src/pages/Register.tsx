import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

export const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'Admin'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await apiClient.post('/users/register', {
        username: formData.username,
        password: formData.password,
        role: formData.role
      });
      alert('Đăng ký tài khoản Admin thành công!');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Lỗi khi đăng ký tài khoản');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950">
      <div className="card w-full max-w-md p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Đăng ký Admin</h2>
          <p className="text-slate-400">Tạo tài khoản quản trị hệ thống</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="form-group">
            <label className="form-label">Tên đăng nhập</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Nhập tên đăng nhập"
              value={formData.username} 
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mật khẩu</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={formData.password} 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Xác nhận mật khẩu</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••"
              value={formData.confirmPassword} 
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required 
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary w-full py-3 text-lg font-semibold"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký ngay'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-400">Đã có tài khoản? </span>
          <Link to="/login" className="text-primary-color hover:underline font-medium">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};
