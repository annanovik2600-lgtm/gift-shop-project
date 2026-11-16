// client/src/pages/SupplierAnalytics.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupplierAnalytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/analytics/supplier', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  if (!data) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка статистики...</h2>;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Статистика моих товаров</h2>
      
      {/* Карточка с общей выручкой */}
      <div style={styles.mainStat}>
        <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>Общая выручка с продаж</h3>
        <p style={{ fontSize: '40px', fontWeight: 'bold', margin: '0 0 5px 0', color: '#fff' }}>
          {data.revenue.total_revenue || 0} BYN
        </p>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)' }}>Всего продано: {data.revenue.items_sold || 0} шт.</p>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Остатки на складе</h3>
        {data.products.length === 0 ? <p>У вас нет товаров.</p> : (
          <div style={styles.list}>
            {data.products.map((p, i) => (
              <div key={i} style={styles.listItem}>
                <span>{p.name}</span>
                <span>
                  <span style={{ marginRight: '15px', color: '#888' }}>{p.price} BYN</span>
                  <strong style={{ color: p.stock_quantity > 5 ? '#2ecc71' : '#e74c3c' }}>
                    Остаток: {p.stock_quantity} шт.
                  </strong>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '40px auto', padding: '0 20px' },
  header: { textAlign: 'center', fontSize: '28px', color: '#2c3e50', marginBottom: '30px' },
  mainStat: { 
    background: 'linear-gradient(135deg, #ff8da1, #b19cd9)', 
    padding: '30px', 
    borderRadius: '20px', 
    textAlign: 'center',
    marginBottom: '20px',
    boxShadow: '0 10px 20px rgba(255, 141, 161, 0.3)'
  },
  card: { backgroundColor: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' },
  cardTitle: { marginTop: 0, color: '#2c3e50', borderBottom: '2px solid #eee', paddingBottom: '10px' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' },
  listItem: { display: 'flex', justifyContent: 'space-between', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '10px', fontWeight: '500' }
};

export default SupplierAnalytics;