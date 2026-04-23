import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/apiClient';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await apiClient.post('/users/login', { username, password });
      const { token } = res.data;
      localStorage.setItem('token', token);
      navigate('/');
    } catch (err: any) {
      console.error('Login Error Detail:', err.response?.data);
      setError(err.response?.data?.message || 'Invalid username or password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="card w-96 p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Username</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Password</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          {error && <p className="text-danger text-sm mb-4">{error}</p>}
          <button type="submit" className="btn btn-primary w-full py-3 mt-4">Login</button>
        </form>
        <div className="mt-6 text-center text-sm">
          <span className="text-slate-400">Chưa có tài khoản? </span>
          <Link to="/register" className="text-primary-color hover:underline font-medium">Đăng ký Admin</Link>
        </div>
        <p className="mt-8 text-xs text-center text-gray-500 opacity-50">Hint: admin / admin123</p>
      </div>
    </div>
  );
};
