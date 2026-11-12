// client/src/pages/Catalog.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Состояния для фильтров
  const [filterRecipient, setFilterRecipient] = useState('Для всех');
  const [filterOccasion, setFilterOccasion] = useState('Без повода');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Логика фильтрации
  const filteredProducts = products.filter(p => {
    const matchRecipient = filterRecipient === 'Для всех' || p.recipient_type === filterRecipient;
    const matchOccasion = filterOccasion === 'Без повода' || p.occasion === filterOccasion;
    return matchRecipient && matchOccasion;
  });

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка...</h2>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Наши подарки</h1>

      {/* Панель фильтров */}
      <div style={styles.filterBar}>
        <div>
          <label style={styles.filterLabel}>Кому: </label>
          <select value={filterRecipient} onChange={(e) => setFilterRecipient(e.target.value)} style={styles.select}>
            <option value="Для всех">Все получатели</option>
            <option value="Для детей">Для детей</option>
            <option value="Для женщин">Для женщин</option>
            <option value="Для мужчин">Для мужчин</option>
          </select>
        </div>

        <div>
          <label style={styles.filterLabel}>Повод: </label>
          <select value={filterOccasion} onChange={(e) => setFilterOccasion(e.target.value)} style={styles.select}>
            <option value="Без повода">Все праздники</option>
            <option value="День рождения">День рождения</option>
            <option value="Новый год">Новый год</option>
            <option value="8 марта">8 марта</option>
            <option value="День влюблённых">День влюблённых</option>
            <option value="23 февраля">23 февраля</option>
          </select>
        </div>
      </div>
      
      {filteredProducts.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '18px', marginTop: '40px' }}>По вашему запросу ничего не найдено 😢</p>
      ) : (
        <div style={styles.grid}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
  header: { textAlign: 'center', marginBottom: '20px', fontSize: '36px', fontWeight: '800', color: '#2c3e50', textTransform: 'uppercase' },
  filterBar: { display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px', backgroundColor: 'rgba(255,255,255,0.7)', padding: '20px', borderRadius: '15px', backdropFilter: 'blur(10px)' },
  filterLabel: { fontWeight: 'bold', color: '#2c3e50', marginRight: '10px' },
  select: { padding: '10px', borderRadius: '10px', border: '1px solid #ccc', fontSize: '15px', fontFamily: 'Nunito, sans-serif', outline: 'none', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }
};

export default Catalog;