// client/src/pages/Cart.jsx
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import Toast from '../components/Toast';

const Cart = () => {
  const { cart, removeFromCart, cartTotal, clearCart } = useContext(CartContext);
  
  // Три отдельных состояния для адреса
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!token) {
      navigate('/login');
    } else if (user?.role !== 'user') {
      setToast({ message: 'Корзина доступна только покупателям.', type: 'error' });
      setTimeout(() => navigate('/'), 2000); 
    }
  }, [navigate]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    // Проверка на заполненность всех трех полей
    if (!city.trim() || !street.trim() || !house.trim()) {
      setToast({ message: 'Пожалуйста, заполните город, улицу и дом', type: 'error' });
      return;
    }

    // Склеиваем адрес в одну строку для базы данных
    const fullAddress = `г. ${city.trim()}, ул. ${street.trim()}, д. ${house.trim()}`;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setToast({ message: 'Войдите в систему для оформления заказа', type: 'error' }); 
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const itemsForServer = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));

      await axios.post('http://localhost:5000/api/orders', {
        items: itemsForServer,
        deliveryAddress: fullAddress, // Отправляем красивую строку
        paymentMethod: 'card'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setToast({ message: 'Заказ успешно оформлен! Уведомление отправлено на вашу почту.', type: 'success' });
      
      clearCart(); // Очищаем корзину
      setCity(''); setStreet(''); setHouse(''); // Очищаем поля
      
      setTimeout(() => navigate('/my-orders'), 2500); // Перекидываем в историю заказов

    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Ошибка при оформлении заказа', type: 'error' });
    }
  };

  if (cart.length === 0) {
    return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Ваша корзина пуста</h2>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Ваша корзина</h2>
      
      <div style={styles.layout}>
        {/* Список товаров */}
        <div style={styles.itemsList}>
          {cart.map(item => (
            <div key={item.id} style={styles.cartItem}>
              <div>
                <h3 style={{ margin: '0 0 5px 0' }}>{item.name}</h3>
                <p style={{ margin: 0, color: '#666' }}>{item.quantity} шт. × {item.price} BYN</p>
              </div>
              <button onClick={() => removeFromCart(item.id)} style={styles.deleteBtn}>Удалить</button>
            </div>
          ))}
        </div>

        {/* Блок оформления */}
        {/* ВАЖНО: Добавлен className="checkout-box-responsive" */}
        <div style={styles.checkoutBox} className="checkout-box-responsive">
          <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Итого: {cartTotal.toFixed(2)} BYN</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <input 
              type="text" 
              placeholder="Город" 
              value={city} 
              onChange={(e) => setCity(e.target.value)}
              style={styles.input}
            />
            <input 
              type="text" 
              placeholder="Улица" 
              value={street} 
              onChange={(e) => setStreet(e.target.value)}
              style={styles.input}
            />
            <input 
              type="text" 
              placeholder="Дом / Квартира" 
              value={house} 
              onChange={(e) => setHouse(e.target.value)}
              style={styles.input}
            />
          </div>

          <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px', marginTop: '5px' }}>
            После оформления на вашу электронную почту будут приходить уведомления о статусе заказа.
          </p>
          
          <button onClick={handleCheckout} style={styles.button} className="btn-hover-effect">
            Оформить заказ
          </button>
        </div>
      </div>
      
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '40px auto', padding: '0 20px' },
  header: { textAlign: 'center', color: '#2c3e50', marginBottom: '30px' },
  layout: { 
    display: 'flex', 
    gap: '40px', 
    alignItems: 'flex-start', 
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  itemsList: { 
    flex: '1 1 400px', // <--- ИЗМЕНЕНИЕ: теперь товар растянется, чтобы занять свободное место слева
    display: 'flex', 
    flexDirection: 'column', 
    gap: '15px' 
  },
    cartItem: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.8)', 
    padding: '20px', 
    borderRadius: '15px', 
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    maxWidth: '600px', // <--- ДОБАВИТЬ ВОТ ЭТО
    width: '100%'
  },
  deleteBtn: { backgroundColor: '#ffe6e6', color: '#ff4d4d', border: 'none', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  checkoutBox: { 
    flex: '0 0 400px', // Форма всегда 400px
    maxWidth: '100%',
    backgroundColor: 'rgba(255,255,255,0.95)', 
    padding: '30px', 
    borderRadius: '20px', 
    boxShadow: '0 10px 20px rgba(255,141,161,0.15)', 
    height: 'fit-content' 
  },
  input: { 
    width: '100%', 
    padding: '15px', 
    borderRadius: '12px', 
    border: '1px solid #ccc', 
    boxSizing: 'border-box',
    fontSize: '15px',
    marginBottom: '15px' // Добавили отступ снизу для каждого поля ввода
  },
  button: { width: '100%', padding: '15px', backgroundColor: '#ff8da1', color: 'white', border: 'none', borderRadius: '15px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    @media (max-width: 1300px) {
      .checkout-box-responsive {
        margin-top: 10px !important;
        flex: 1 1 100% !important; /* Занимает всю ширину */
        display: flex;
        flex-direction: column;
      }
    }
  `;
  document.head.appendChild(style);
}

export default Cart;