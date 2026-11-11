// client/src/pages/Catalog.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Загружаем товары при запуске страницы
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Делаем запрос к нашему серверу!
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Не удалось загрузить товары. Проверьте, запущен ли сервер.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка товаров...</h2>;
  if (error) return <h2 style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</h2>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Наши подарки</h1>
      
      {products.length === 0 ? (
        <p>В магазине пока нет товаров. Добавьте их через Postman!</p>
      ) : (
        <div style={styles.grid}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    fontSize: '36px', // Увеличили размер
    fontWeight: '800', // Сделали жирным
    color: '#2c3e50', // Строгий темно-серый цвет (вместо розового)
    letterSpacing: '1px',
    textTransform: 'uppercase', // Сделали все буквы заглавными (для солидности)
    // Можно добавить легкую тень для объема
    textShadow: '0px 2px 4px rgba(0,0,0,0.05)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px'
  }
};

export default Catalog;