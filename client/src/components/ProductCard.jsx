// client/src/components/ProductCard.jsx
import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div style={styles.card}>
      <div style={styles.imagePlaceholder}>
        {/* Пока заглушка, так как картинок в БД может не быть */}
        🎁
      </div>
      <div style={styles.content}>
        <h3 style={styles.title}>{product.name}</h3>
        <p style={styles.description}>{product.description}</p>
        <div style={styles.footer}>
          <span style={styles.price}>{product.price} BYN</span>
          <button style={styles.button}>В корзину</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Почти непрозрачный белый
    backdropFilter: 'blur(5px)', // Легкое размытие фона позади карточки
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(255, 141, 161, 0.2)', // Чуть более заметная тень
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.5)', // Тонкая светлая рамка
  },
  imagePlaceholder: {
    height: '160px',
    backgroundColor: '#fdf5ff', // Очень светлый лавандовый
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '60px',
    color: 'var(--pink-dark)',
  },
  content: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '19px',
    fontWeight: '700',
    color: '#5a5a5a',
  },
  description: {
    color: 'var(--text-light)',
    fontSize: '14px',
    flexGrow: 1,
    margin: '0 0 20px 0',
    lineHeight: '1.4',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--pink-dark)',
  },
  button: {
    backgroundColor: 'var(--pink-pastel)',
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '30px', // Круглая кнопка
    cursor: 'pointer',
    fontWeight: '700',
    transition: 'background-color 0.3s ease',
  }
};

export default ProductCard;