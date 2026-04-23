import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  CreditCard, 
  ShoppingBag,
  User as UserIcon,
  Ticket,
  ChevronLeft,
  CheckCircle
} from 'lucide-react';
import type { Product, Category } from '../api/productService';
import productService from '../api/productService';
import orderService from '../api/orderService';
import discountService from '../api/discountService';
import { dispatchNotification } from '../utils/notifications';
import './POS.css';

const TABLES = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Bàn ${String(i + 1).padStart(2, '0')}`,
  area: i < 15 ? 'Tầng 1' : 'Tầng 2',
  status: 'available'
}));

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface StaffUser {
  id: number;
  username: string;
  role: string;
}

export const POS: React.FC = () => {
  const [pin, setPin] = useState<string>('');
  const [staffUser, setStaffUser] = useState<StaffUser | null>(null);
  const [showPinModal, setShowPinModal] = useState<boolean>(false);
  const [pendingTable, setPendingTable] = useState<any>(null);
  
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Tất cả');
  const [tableCarts, setTableCarts] = useState<Record<number, CartItem[]>>({});
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [discountCode, setDiscountCode] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Current active cart for the selected table
  const currentCart = selectedTable ? (tableCarts[selectedTable.id] || []) : [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          productService.getProducts(),
          productService.getCategories()
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleTableSelect = (table: any) => {
    if (!staffUser) {
      setPendingTable(table);
      setShowPinModal(true);
    } else {
      setSelectedTable(table);
    }
  };

  const handlePinInput = async (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      if (newPin.length === 4) {
        try {
          const res = await orderService.validatePin(newPin);
          setStaffUser(res.data);
          if (pendingTable) {
            setSelectedTable(pendingTable);
            setPendingTable(null);
          }
          setShowPinModal(false);
          setPin('');
        } catch (error) {
          alert('Mã PIN không chính xác!');
          setPin('');
        }
      }
    }
  };

  const logoutStaff = () => {
    setStaffUser(null);
    setSelectedTable(null);
  };

  const cartRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cartRef.current) {
      cartRef.current.scrollTop = cartRef.current.scrollHeight;
    }
  }, [tableCarts, selectedTable]);

  const addToCart = (product: any) => {
    if (!selectedTable) return;
    const tableId = selectedTable.id;
    
    setTableCarts(prev => {
      const currentTableCart = prev[tableId] || [];
      const existing = currentTableCart.find(item => item.id === product.id);
      let newCart;
      
      if (existing) {
        newCart = currentTableCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        newCart = [...currentTableCart, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
      }
      
      return { ...prev, [tableId]: newCart };
    });
  };

  const removeFromCart = (id: number) => {
    if (!selectedTable) return;
    const tableId = selectedTable.id;
    
    setTableCarts(prev => ({
      ...prev,
      [tableId]: (prev[tableId] || []).filter(item => item.id !== id)
    }));
  };

  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);

  const applyVoucher = async () => {
    if (!discountCode) return;
    try {
      const res = await discountService.getDiscounts();
      // Find the discount code (case insensitive and trimming whitespace)
      const discount = res.data.find((d: any) => 
        d.code.trim().toUpperCase() === discountCode.trim().toUpperCase() && d.isActive
      );
      
      if (discount) {
        const amount = (subtotal * discount.percentage) / 100;
        setAppliedDiscount(amount);
      } else {
        alert('Mã giảm giá không hợp lệ hoặc đã hết hạn.');
        setAppliedDiscount(0);
      }
    } catch (error) {
      console.error("Error applying voucher:", error);
      alert('Lỗi hệ thống khi kiểm tra mã giảm giá.');
    }
  };

  const handlePayment = async () => {
    if (!selectedTable || currentCart.length === 0) return;
    const tableId = selectedTable.id;
    
    try {
      const orderData = {
        tableId: tableId,
        items: currentCart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        userId: staffUser?.id || null,
        discountCode: discountCode || null,
        paymentMethod: paymentMethod
      };

      await orderService.createPOSOrder(orderData);
      
      dispatchNotification(`Đơn hàng mới tại ${selectedTable.name} đã thanh toán thành công!`);
      
      // Clear cart for this specific table
      setTableCarts(prev => {
        const newState = { ...prev };
        delete newState[tableId];
        return newState;
      });
      
      setSelectedTable(null);
      setDiscountCode('');
      setAppliedDiscount(0);
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      alert('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng thử lại.');
    }
  };

  // Calculations
  const subtotal = currentCart.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
  const serviceFee = subtotal * 0.05;
  const vat = (subtotal - appliedDiscount) > 0 ? (subtotal - appliedDiscount) * 0.08 : subtotal * 0.08; 
  // User wants VAT and Fee to stay even if 100% discount. 
  // Let's stick to the simplest interpretation: Discount only subtracts from subtotal.
  const total = (subtotal - appliedDiscount) + serviceFee + vat;

  const filteredProducts = products.filter(p => {
    const categoryMatch = activeCategory === 'Tất cả' || 
      categories.find(c => c.id === p.categoryId)?.name === activeCategory;
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="animate-fade-in pos-page">
      {/* Staff Bar */}
      {staffUser && (
        <div className="staff-header bg-slate-800/80 backdrop-blur-md px-6 py-3 flex justify-between items-center border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-color flex items-center justify-center">
              <UserIcon size={20} className="text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">{staffUser.username}</span>
              <span className="text-slate-600">-</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setShowPinModal(true)} className="text-slate-400 hover:text-primary-color transition-colors text-xs font-bold uppercase tracking-wider">Đổi nhân viên</button>
                <span className="text-slate-600">/</span>
                <button onClick={logoutStaff} className="text-slate-400 hover:text-rose-500 transition-colors text-xs font-bold uppercase tracking-wider">Thoát</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pos-container">
        {!selectedTable ? (
          <div className="pos-main w-full col-span-2">
            <div className="tables-grid">
              {TABLES.map(table => (
                <button 
                  key={table.id} 
                  className={`table-card ${table.status}`}
                  onClick={() => handleTableSelect(table)}
                >
                  <span className="table-number">{table.name}</span>
                  <span className="table-area">{table.area}</span>
                  <span className="table-status-label">{table.status === 'available' ? 'Bàn trống' : 'Có khách'}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="pos-main">
              <div className="pos-main-header">
                <button onClick={() => setSelectedTable(null)} className="back-btn">
                  <ChevronLeft size={20} /> Quay lại chọn bàn
                </button>
                <div className="category-tabs">
                  {['Tất cả', ...categories.map(c => c.name)].map(cat => (
                    <button 
                      key={cat} 
                      className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="products-grid-container">
                <div className="search-bar-pos">
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Tìm món nhanh..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="products-grid-pos">
                  {filteredProducts.map(p => (
                    <div key={p.id} className="product-card-pos" onClick={() => addToCart(p)}>
                      <div className="product-image-pos">
                        <img 
                          src={p.imageUrl.startsWith('http') ? p.imageUrl : `http://localhost:5000${p.imageUrl}`} 
                          alt={p.name} 
                          onError={(e) => (e.currentTarget.src = 'https://placehold.co/200x200?text=No+Image')}
                        />
                        <div className="price-tag-pos">{p.price.toLocaleString()}đ</div>
                      </div>
                      <div className="product-info-pos">
                        <h4 className="font-bold text-white text-sm">{p.name}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pos-sidebar">
              <div className="table-selector-mini">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <select 
                    className="table-select-mini-input"
                    value={selectedTable.id}
                    onChange={(e) => {
                      const newTable = TABLES.find(t => t.id === parseInt(e.target.value));
                      if (newTable) setSelectedTable(newTable);
                    }}
                  >
                    {TABLES.map(t => (
                      <option key={t.id} value={t.id} className="bg-slate-900 text-white py-2">
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="back-to-map-simple" onClick={() => setSelectedTable(null)}>
                  <ChevronLeft size={16} />
                  Bản đồ
                </button>
              </div>

              <div className="cart-container" ref={cartRef}>
                {currentCart.length === 0 ? (
                  <div className="empty-cart">
                    <ShoppingBag size={48} />
                    <p>Chưa có món nào được chọn</p>
                  </div>
                ) : (
                  <div className="cart-items">
                    {currentCart.map(item => (
                      <div key={item.id} className="cart-item">
                        <div className="item-qty-name">
                          <span className="qty">{item.quantity}</span>
                          <span className="name">{item.name}</span>
                        </div>
                        <div className="item-price-actions">
                          <span className="price">{(item.price * item.quantity).toLocaleString()}đ</span>
                          <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="checkout-summary">
                <div className="voucher-card-premium">
                  <div className="voucher-input-wrapper">
                    <div className="input-inner">
                      <Ticket size={18} className="ticket-icon" />
                      <input 
                        type="text" 
                        placeholder="MÃ GIẢM GIÁ" 
                        className="voucher-field"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                      />
                      <button 
                        className="apply-btn-unified"
                        onClick={applyVoucher}
                      >
                        ÁP DỤNG
                      </button>
                    </div>
                  </div>
                </div>

                <div className="summary-details space-y-2">
                  <div className="summary-line">
                    <span>Tạm tính</span>
                    <span>{subtotal.toLocaleString()}đ</span>
                  </div>
                  <div className="summary-line">
                    <span>Phí dịch vụ (5%)</span>
                    <span>{serviceFee.toLocaleString()}đ</span>
                  </div>
                  <div className="summary-line">
                    <span>Thuế VAT (8%)</span>
                    <span>{vat.toLocaleString()}đ</span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="summary-line">
                      <span>Giảm giá</span>
                      <span className="text-rose-500">-{appliedDiscount.toLocaleString()}đ</span>
                    </div>
                  )}
                </div>

                <div className="total-line mt-4">
                  <span>TỔNG THANH TOÁN</span>
                  <span>{total.toLocaleString()}đ</span>
                </div>

                <div className="payment-options-grid">
                  <div className="option-item">
                    <p className="option-label">Phương thức</p>
                    <select 
                      className="payment-select"
                      value={paymentMethod}
                      onChange={(e: any) => setPaymentMethod(e.target.value)}
                    >
                      <option value="cash">Tiền mặt</option>
                      <option value="card">Chuyển khoản / Thẻ</option>
                    </select>
                  </div>
                  <div className="option-item">
                    <p className="option-label">Hóa đơn</p>
                    <button className="secondary-btn">
                      <ShoppingBag size={16} />
                      In hóa đơn
                    </button>
                  </div>
                </div>
                
                <button className="primary-btn pay-now-btn" onClick={handlePayment}>
                  <CreditCard size={20} />
                  XÁC NHẬN THANH TOÁN
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* PIN Modal */}
      {showPinModal && (
        <div className="pin-overlay">
          <div className="pin-modal animate-scale-in">
            <h2 className="mb-4 text-2xl font-black text-white text-center">XÁC NHẬN NHÂN VIÊN</h2>
            <p className="text-slate-400 text-center mb-8">Vui lòng nhập mã PIN 4 số của bạn</p>
            
            <div className="pin-display mb-10">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`pin-dot ${pin.length > i ? 'filled' : ''}`} />
              ))}
            </div>

            <div className="pin-pad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <button key={n} className="pin-btn" onClick={() => handlePinInput(n.toString())}>{n}</button>
              ))}
              <button className="pin-btn text-rose-500" onClick={() => { setPin(''); setShowPinModal(false); setPendingTable(null); }}>
                <Trash2 size={24} />
              </button>
              <button className="pin-btn" onClick={() => handlePinInput('0')}>0</button>
              <button className="pin-btn text-slate-400" onClick={() => { setShowPinModal(false); setPendingTable(null); setPin(''); }}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
