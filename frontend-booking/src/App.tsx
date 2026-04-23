import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, Clock, Users, CheckCircle } from 'lucide-react';

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const LinkedinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

const STORES = [
  'BỜM - Kitchen & Wine Bar',
  'BỜM - District 1',
  'BỜM - District 7'
];

const TIME_SLOTS = [
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM'
];

const Header = () => (
  <header className="main-header">
    <div className="top-bar">
      <div className="container">
        <span>IF YOU DO NOT HAVE A VIETNAMESE PHONE NUMBER, YOU CAN MAKE A RESERVATION VIA OUR <a href="#">FANPAGE</a></span>
        <div className="lang-switcher">
          <span className="active">ENG</span>
          <span>|</span>
          <span>VIE</span>
        </div>
      </div>
    </div>
    <div className="nav-bar">
      <div className="container">
        <div className="logo">
          <span className="logo-text">Bòm</span>
        </div>
        <nav>
          <a href="#">ABOUT US</a>
          <a href="#">MENU</a>
          <a href="#">EVENTS</a>
          <a href="#">PRESS</a>
          <a href="#" className="active">RESERVATIONS</a>
        </nav>
      </div>
    </div>
  </header>
);

const Footer = () => (
  <footer className="main-footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-col">
          <h4>ADDRESS</h4>
          <p>24 Nguyen Thi Nghia, Ben Thanh Ward,</p>
          <p>District 1, Ho Chi Minh City, Vietnam</p>
        </div>
        <div className="footer-col">
          <h4>OPENING HOURS</h4>
          <p>Monday - Sunday</p>
          <p>10:30 – 23:00</p>
        </div>
        <div className="footer-col">
          <h4>CONTACT</h4>
          <p>booking@bomhospitality.vn</p>
          <p>(+84) 82 399 9980</p>
        </div>
        <div className="footer-col">
          <h4>FOLLOW US</h4>
          <div className="social-links">
            <a href="#"><FacebookIcon /></a>
            <a href="#"><InstagramIcon /></a>
            <a href="#"><LinkedinIcon /></a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '7:00 PM',
    guests: 2,
    store: STORES[0],
    name: '',
    phone: '',
    email: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const timeMatch = formData.time.match(/(\d+):(\d+) (\w+)/);
      if (!timeMatch) return;
      const [hours, minutes, period] = timeMatch.slice(1);
      let h = parseInt(hours);
      if (period === 'PM' && h < 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      
      const reservationDate = new Date(`${formData.date}T${h.toString().padStart(2, '0')}:${minutes}:00`);

      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      await axios.post(`${API_BASE_URL}/api/Reservations`, {
        customerName: formData.name,
        phone: formData.phone,
        email: formData.email,
        reservationDate: reservationDate.toISOString(),
        numberOfGuests: formData.guests,
        storeName: formData.store,
        note: formData.note,
        status: 'Pending'
      });
      setSuccess(true);
    } catch (error) {
      console.error('Error booking:', error);
      alert('Có lỗi xảy ra khi đặt bàn. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const BookingForm = () => (
    <div className="booking-container">
      <div className="video-section">
        <video autoPlay muted loop playsInline>
          <source src="https://bomkitchen.com/wp-content/uploads/2024/07/bom-intro.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="form-section">
        <h1 className="booking-title">ĐẶT BÀN</h1>

        <div className="summary-badges">
          <div className="badge"><Calendar size={16} /> {formData.date}</div>
          <div className="badge"><Clock size={16} /> {formData.time}</div>
          <div className="badge"><Users size={16} /> {formData.guests}</div>
        </div>

        {step === 1 ? (
          <div className="booking-form">
            <h3 style={{ marginBottom: '1.5rem' }}>Vui lòng điền thông tin đặt bàn</h3>
            
            <div className="form-group">
              <label>Ngày</label>
              <input 
                type="date" 
                name="date" 
                className="input-field" 
                value={formData.date} 
                onChange={handleInputChange} 
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="row-group">
              <div className="form-group">
                <label>Số người</label>
                <input 
                  type="number" 
                  name="guests" 
                  className="input-field" 
                  value={formData.guests} 
                  onChange={handleInputChange}
                  min="1"
                  max="20"
                />
              </div>
              <div className="form-group">
                <label>Thời gian</label>
                <select name="time" className="input-field" value={formData.time} onChange={handleInputChange}>
                  {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Cửa hàng</label>
              <select name="store" className="input-field" value={formData.store} onChange={handleInputChange}>
                {STORES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <button className="next-btn" onClick={handleNext}>TIẾP THEO</button>
          </div>
        ) : (
          <form className="booking-form" onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: '1.5rem' }}>Thông tin liên hệ của bạn</h3>

            <div className="form-group">
              <label>Họ và tên</label>
              <input 
                type="text" 
                name="name" 
                className="input-field" 
                placeholder="Ví dụ: Nguyễn Văn A"
                value={formData.name} 
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input 
                type="tel" 
                name="phone" 
                className="input-field" 
                placeholder="Nhập số điện thoại của bạn"
                value={formData.phone} 
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                className="input-field" 
                placeholder="email@example.com"
                value={formData.email} 
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Ghi chú thêm</label>
              <textarea 
                name="note" 
                className="input-field" 
                style={{ height: '80px', resize: 'none' }}
                placeholder="Yêu cầu đặc biệt (nếu có)..."
                value={formData.note} 
                onChange={handleInputChange}
              />
            </div>

            <div className="row-group">
              <button type="button" className="next-btn" style={{ background: '#999' }} onClick={() => setStep(1)}>QUAY LẠI</button>
              <button type="submit" className="next-btn" disabled={loading}>
                {loading ? 'ĐANG GỬI...' : 'ĐẶT BÀN NGAY'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  const SuccessMessage = () => (
    <div className="booking-container">
      <div className="video-section">
        <video autoPlay muted loop playsInline>
          <source src="https://bomkitchen.com/wp-content/uploads/2024/07/bom-intro.mp4" type="video/mp4" />
        </video>
      </div>
      <div className="form-section success-message">
        <CheckCircle size={80} color="#2e7d32" style={{ margin: '0 auto 2rem' }} />
        <h2>ĐẶT BÀN THÀNH CÔNG!</h2>
        <p>Cảm ơn {formData.name}, chúng tôi đã nhận được yêu cầu của bạn.</p>
        <p>Nhân viên sẽ liên hệ xác nhận qua số điện thoại {formData.phone} sớm nhất.</p>
        <button className="next-btn" onClick={() => window.location.reload()}>QUAY LẠI</button>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <Header />
      {success ? <SuccessMessage /> : <BookingForm />}
      <Footer />
    </div>
  );
}

export default App;
