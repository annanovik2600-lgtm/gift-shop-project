// client/src/pages/AdminAnalytics.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminAnalytics = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/analytics/admin', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  if (!stats) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка аналитики...</h2>;

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Аналитика магазина</h2>
      
      <div style={styles.grid}>
        {/* Блок: Выручка по поставщикам */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Выручка по поставщикам</h3>
          {stats.suppliers.length === 0 ? <p>Нет данных</p> : (
            <div style={styles.list}>
              {stats.suppliers.map((s, i) => (
                <div key={i} style={styles.listItem}>
                  <span>{s.company_name}</span>
                  <strong style={{ color: '#2ecc71' }}>{s.total_revenue} BYN</strong>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Блок: Популярность по получателям */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Кому чаще дарят</h3>
          {stats.recipients.length === 0 ? <p>Нет данных</p> : (
            <div style={styles.list}>
              {stats.recipients.map((r, i) => (
                <div key={i} style={styles.listItem}>
                  <span>{r.recipient_type}</span>
                  <strong style={{ color: '#3498db' }}>{r.total_sold} шт.</strong>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Блок: Популярность по праздникам */}
        <div style={{...styles.card, gridColumn: '1 / -1'}}>
          <h3 style={styles.cardTitle}>Популярность праздников</h3>
          {stats.occasions.length === 0 ? <p>Нет данных</p> : (
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              {stats.occasions.map((o, i) => (
                <div key={i} style={styles.badge}>
                  <span>{o.occasion}</span>
                  <strong>{o.total_sold} шт.</strong>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '40px auto', padding: '0 20px' },
  header: { textAlign: 'center', fontSize: '32px', color: '#2c3e50', marginBottom: '30px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  card: { backgroundColor: 'rgba(255,255,255,0.9)', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' },
  cardTitle: { marginTop: 0, color: '#2c3e50', borderBottom: '2px solid #fdf5ff', paddingBottom: '10px', marginBottom: '15px' },
  list: { display: 'flex', flexDirection: 'column', gap: '10px' },
  listItem: { display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '8px' },
  badge: { backgroundColor: '#fdf5ff', padding: '10px 15px', borderRadius: '10px', border: '1px solid #ff8da1', display: 'flex', gap: '10px', alignItems: 'center' }
};

export default AdminAnalytics;