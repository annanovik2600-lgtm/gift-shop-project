// client/src/components/Recommendations.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './ProductCard';

const Recommendations = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        // Показываем только покупателям
        if (!token || user?.role !== 'user') return;

        const res = await axios.get('http://localhost:5000/api/recommendations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(res.data);
      } catch (err) {
        console.error('Ошибка загрузки рекомендаций', err);
      }
    };

    fetchRecommendations();
  }, []);

  if (products.length === 0) return null; // Если нет рекомендаций, ничего не выводим

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>✨ Рекомендуем специально для вас</h2>
      <div style={styles.grid}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '40px auto',
    padding: '30px',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '30px',
    boxShadow: 'inset 0 0 20px rgba(255, 141, 161, 0.1)'
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    fontSize: '24px',
    marginBottom: '20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px'
  }
};

export default Recommendations;