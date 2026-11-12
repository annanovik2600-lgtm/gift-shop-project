// client/src/pages/MyOrders.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Toast from '../components/Toast';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/orders/my', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
      } catch (err) {
        setToast({ message: 'Не удалось загрузить заказы', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Красивый перевод статусов на русский
  const getStatusText = (status) => {
    const statuses = {
      'new': 'Новый',
      'paid': 'Оплачен',
      'assembled': 'Собран',
      'shipped': 'В доставке',
      'delivered': 'Доставлен',
      'cancelled': 'Отменён'
    };
    return statuses[status] || status;
  };

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка истории...</h2>;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Мои заказы</h2>
      
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p style={{ fontSize: '18px', color: '#666' }}>У вас пока нет заказов 😢</p>
          <button onClick={() => navigate('/')} style={styles.goShopBtn}>Перейти в каталог</button>
        </div>
      ) : (
        <div style={styles.orderList}>
          {orders.map(order => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>Заказ №{order.id}</h3>
                  <span style={{ color: '#888', fontSize: '14px' }}>
                    от {new Date(order.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={styles.statusBadge}>{getStatusText(order.status)}</span>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '5px', color: '#c0392b' }}>
                    {order.total_amount} BYN
                  </div>
                </div>
              </div>

              <div style={styles.itemsList}>
                {order.items && order.items.map((item, index) => (
                  <div key={index} style={styles.itemRow}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ fontSize: '24px' }}>🎁</span>
                      <span style={{ fontWeight: '600' }}>{item.name}</span>
                    </div>
                    <span style={{ color: '#666' }}>
                      {item.quantity} шт. × {item.price_at_moment} BYN
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '15px', fontSize: '14px', color: '#888' }}>
                <strong>Адрес доставки:</strong> {order.delivery_address || 'Не указан'}
              </div>
            </div>
          ))}
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '40px auto', padding: '0 20px' },
  header: { textAlign: 'center', fontSize: '32px', color: '#2c3e50', marginBottom: '30px' },
  orderList: { display: 'flex', flexDirection: 'column', gap: '20px' },
  orderCard: { 
    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
    borderRadius: '20px', 
    padding: '25px', 
    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
    borderLeft: '6px solid #ff8da1'
  },
  orderHeader: { display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px' },
  statusBadge: { backgroundColor: '#e8f8f5', color: '#2ecc71', padding: '5px 10px', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '10px' },
  itemRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fcfcfc', padding: '10px', borderRadius: '10px' },
  goShopBtn: { marginTop: '20px', padding: '12px 25px', backgroundColor: 'var(--pink-dark)', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }
};

export default MyOrders;