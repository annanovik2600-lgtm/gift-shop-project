// client/src/App.jsx
import React, { useContext } from 'react'; 
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import Cart from './pages/Cart'; 
import SupplierPanel from './pages/SupplierPanel'; // <-- Импорт панели поставщика
import { CartContext } from './context/CartContext'; 
import logoImg from './assets/logo.png';

function App() {
  const navigate = useNavigate();
  const { cartCount } = useContext(CartContext); 

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload(); 
  };

  return (
    <div>
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <img src={logoImg} alt="Логотип" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'contain', backgroundColor: 'white' }} />
          <div style={styles.logo}>Магазин Подарков</div>
        </div>
        
        <nav style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={styles.navLink}>Каталог</Link>
          
          {/* Корзина видна ТОЛЬКО покупателю */}
          {token && user?.role === 'user' && (
            <Link to="/cart" style={styles.navLink}>Корзина ({cartCount})</Link>
          )}

          {/* Показываем панель админа только если роль admin */}
          {user?.role === 'admin' && (
            <Link to="/admin" style={styles.navLink}>Панель Админа</Link>
          )}

          {/* Показываем кабинет поставщика только если роль supplier */}
          {user?.role === 'supplier' && (
            <Link to="/supplier" style={styles.navLink}>Кабинет поставщика</Link>
          )}

          {!token ? (
            <>
              <Link to="/login" style={styles.navLink}>Войти</Link>
              <Link to="/register" style={styles.navLink}>Регистрация</Link>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
              <span style={{ color: '#ff8da1', fontWeight: 'bold', marginRight: '15px' }}>
                 {user?.username}
              </span>
              <button onClick={handleLogout} style={styles.logoutBtn}>Выйти</button>
            </div>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/supplier" element={<SupplierPanel />} /> {/* <-- Маршрут поставщика */}
        </Routes>
      </main>
    </div>
  );
}

const styles = {
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '15px 40px', 
    backgroundColor: 'rgba(255, 255, 255, 0.85)', 
    backdropFilter: 'blur(15px)', 
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)', 
    position: 'sticky', 
    top: 0, 
    zIndex: 100 
  },
  logo: { 
    fontSize: '22px', 
    fontWeight: '800', 
    color: '#2c3e50', /* Темно-серый цвет */
    letterSpacing: '1px'
  },
  navLink: { 
    color: '#2c3e50', /* Темно-серый цвет */
    marginLeft: '25px', 
    fontSize: '16px', 
    fontWeight: '700',
    transition: 'color 0.3s ease'
  },
  logoutBtn: { 
    padding: '8px 15px', 
    backgroundColor: '#ff8da1', 
    color: 'white', 
    border: 'none', 
    borderRadius: '15px', 
    cursor: 'pointer', 
    fontWeight: 'bold', 
    fontFamily: 'Nunito, sans-serif' 
  }
};

export default App;