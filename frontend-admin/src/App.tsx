import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Products } from './pages/Products';
import { Categories } from './pages/Categories';
import { Orders } from './pages/Orders';
import { Users } from './pages/Users';
import { DiscountCodes } from './pages/DiscountCodes';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { POS } from './pages/POS';
import { Bookings } from './pages/Bookings';
import apiClient from './api/apiClient';

// Initialize token from localStorage
const token = localStorage.getItem('token');
if (token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const hasToken = !!localStorage.getItem('token');
  return hasToken ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="categories" element={<Categories />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="discounts" element={<DiscountCodes />} />
          <Route path="pos" element={<POS />} />
          <Route path="bookings" element={<Bookings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
