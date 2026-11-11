// client/src/App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import logoImg from './assets/logo.png';
import Catalog from './pages/Catalog';
import Login from './pages/Login'; // <-- ДОБАВИЛИ ИМПОРТ

function App() {
  // Проверяем, есть ли токен в браузере (вошел ли пользователь)
  const token = localStorage.getItem('token');

  return (
    <div>
      <header style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <img src={logoImg} alt="Логотип" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'contain' }} />
    <div style={styles.logo}>Магазин Подарков</div>
</div>
        <nav>
          <Link to="/" style={styles.navLink}>Каталог</Link>
          
          {/* Если токена нет, показываем кнопку Войти */}
          {!token ? (
            <Link to="/login" style={styles.navLink}>Войти</Link>
          ) : (
            <a href="/" onClick={() => { localStorage.clear(); window.location.reload(); }} style={styles.navLink}>Выйти</a>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/login" element={<Login />} /> {/* <-- ДОБАВИЛИ МАРШРУТ */}
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
    
    /* Делаем шапку полупрозрачной */
    backgroundColor: 'rgba(255, 255, 255, 0.6)', 
    backdropFilter: 'blur(15px)', /* Усиливаем размытие */
    
    borderBottom: '1px solid rgba(255, 141, 161, 0.3)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: '24px',
    fontWeight: '800',
    /* Градиентный текст для логотипа */
    background: 'linear-gradient(45deg, #ff8da1, #b19cd9)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '1px',
  },
  navLink: {
    color: '#b19cd9', // Лавандовый цвет для ссылок
    marginLeft: '25px',
    fontSize: '16px',
    fontWeight: '700',
    transition: 'color 0.3s ease',
  }
};

export default App;