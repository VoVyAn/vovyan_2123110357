import { useEffect, useState } from 'react';
import adminService from '../api/adminService';
import type { User } from '../api/adminService';

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    password: '',
    role: 'UserPhucvu',
    code: ''
  });

  const roles = ['Admin', 'UserCaptain', 'UserPhucvu'];

  const fetchUsers = async () => {
    try {
      const res = await adminService.getUsers();
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminService.deleteUser(id);
      fetchUsers();
    } catch (error) {
      alert('Error deleting user');
    }
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        fullName: user.fullName || '',
        password: '', // Don't show password
        role: user.role,
        code: user.code
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        fullName: '',
        password: '',
        role: 'UserPhucvu',
        code: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.code.length !== 4 || isNaN(Number(formData.code))) {
      alert('Code must be a 4-digit number');
      return;
    }
    try {
      if (editingUser) {
        await adminService.updateUser(editingUser.id, formData);
      } else {
        await adminService.createUser(formData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error: any) {
      console.error('Error saving user:', error);
      const msg = error.response?.data?.message || error.message || 'Unknown error';
      alert('Lỗi khi lưu: ' + msg);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="page-title mb-1">Users Management</h1>
          <p className="subtitle">Manage staff accounts, roles, and security PINs</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <span style={{ fontSize: '20px' }}>+</span> Add New User
        </button>
      </div>
      
      {loading ? (
        <div className="p-8 text-center text-secondary">Loading users...</div>
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ paddingLeft: '24px' }}>Staff ID</th>
                  <th>Full Name</th>
                  <th>Login Username</th>
                  <th>Role</th>
                  <th>Access PIN</th>
                  <th style={{ textAlign: 'right', paddingRight: '24px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ paddingLeft: '24px' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>#{user.id}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
                          {(user.fullName || user.username).charAt(0).toUpperCase()}
                        </div>
                        <span style={{ fontWeight: '500' }}>{user.fullName || '---'}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-secondary)' }}>{user.username}</span>
                    </td>
                    <td>
                      <span className={`badge ${user.role === 'Admin' ? 'badge-danger' : user.role === 'UserCaptain' ? 'badge-primary' : 'badge-success'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '4px 8px', borderRadius: '4px', letterSpacing: '2px' }}>
                        {user.code}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', paddingRight: '24px' }}>
                      <button className="btn btn-secondary btn-sm" style={{ marginRight: '8px', padding: '6px 12px' }} onClick={() => handleOpenModal(user)}>Edit</button>
                      <button className="btn btn-danger btn-sm" style={{ padding: '6px 12px' }} onClick={() => handleDelete(user.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-1">{editingUser ? 'Edit Staff Member' : 'Add New Staff'}</h2>
              <p className="subtitle">{editingUser ? 'Update account details and permissions' : 'Create a new account for your team'}</p>
            </div>
            
            <form onSubmit={handleSave}>
              <div className="mb-4">
                <label className="form-label">Full Name (Họ và Tên)</label>
                <input type="text" className="form-input" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} placeholder="e.g. Võ Vỹ Ân" required />
              </div>

              <div className="mb-4">
                <label className="form-label">Login Username (Tên đăng nhập)</label>
                <input type="text" className="form-input" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="e.g. vovan" required />
              </div>
              
              <div className="mb-4">
                <label className="form-label">{editingUser ? 'New Password' : 'Password'}</label>
                <input type="password" className="form-input" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder={editingUser ? "Leave blank to keep current" : "••••••••"} required={!editingUser} />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="form-label">Role</label>
                  <select className="form-input" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">PIN Code</label>
                  <input type="text" maxLength={4} className="form-input" style={{ letterSpacing: '4px', textAlign: 'center', fontWeight: 'bold' }} value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} placeholder="0000" required />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-8">
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  {editingUser ? 'Update Account' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
