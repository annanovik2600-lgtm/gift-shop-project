// client/src/pages/Cart.jsx
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, cartTotal, clearCart } = useContext(CartContext);
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  // Если нет токена — на страницу входа
  if (!token) {
    navigate('/login');
  } 
  // Если роль не user (например, зашел админ) — отправляем в каталог
  else if (user?.role !== 'user') {
    alert('Корзина доступна только покупателям.');
    navigate('/');
  }
}, [navigate]);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (!address) {
      setError('Введите адрес доставки');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Для оформления заказа нужно войти!');
        navigate('/login');
        return;
      }

      // Форматируем товары для сервера
      const itemsForServer = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));

      await axios.post('http://localhost:5000/api/orders', {
        items: itemsForServer,
        deliveryAddress: address,
        paymentMethod: 'card'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Заказ успешно оформлен!');
      clearCart(); // Очищаем корзину
      navigate('/'); // Идем на главную

    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при оформлении заказа');
    }
  };

  if (cart.length === 0) {
    return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Ваша корзина пуста 😢</h2>;
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
        <div style={styles.checkoutBox}>
          <h3>Итого: {cartTotal.toFixed(2)} BYN</h3>
          {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
          
          <input 
            type="text" 
            placeholder="Адрес доставки" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)}
            style={styles.input}
          />
          
          <button onClick={handleCheckout} style={styles.button}>Оформить заказ</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '40px auto', padding: '0 20px' },
  header: { textAlign: 'center', color: '#ff8da1', marginBottom: '30px' },
  layout: { display: 'flex', gap: '30px', flexWrap: 'wrap' },
  itemsList: { flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: '15px' },
  cartItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.8)', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
  deleteBtn: { backgroundColor: '#ffe6e6', color: '#ff4d4d', border: 'none', padding: '8px 15px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  checkoutBox: { flex: '1 1 300px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 20px rgba(255,141,161,0.15)', height: 'fit-content' },
  input: { width: '100%', padding: '12px', margin: '15px 0', borderRadius: '10px', border: '1px solid #ccc', boxSizing: 'border-box' },
  button: { width: '100%', padding: '15px', backgroundColor: '#ff8da1', color: 'white', border: 'none', borderRadius: '15px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }
};

export default Cart;