// client/src/components/ProductCard.jsx
import React, { useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom'; // Импортируем навигацию
import { CartContext } from '../context/CartContext';
import Toast from './Toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate(); // Хук для переадресации
  const [toast, setToast] = useState(null); // { message: '...', type: 'error' }

  // Новая функция с проверками
  const handleAddToCart = () => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!token) {
      setToast({ message: 'Для покупки необходимо войти в систему', type: 'error' });
      setTimeout(() => navigate('/login'), 2000); // Перекинем на вход через 2 сек
      return;
    }

    if (user?.role !== 'user') {
      setToast({ message: 'Только покупатели могут добавлять товары', type: 'error' });
      return;
    }

    addToCart(product);
    setToast({ message: 'Товар добавлен в корзину!', type: 'success' });
  };

  return (
    <div style={styles.card}>
      <div style={styles.imagePlaceholder}>
        🎁
      </div>
      <div style={styles.content}>
        <h3 style={styles.title}>{product.name}</h3>
        <p style={styles.description}>{product.description}</p>
        <div style={styles.footer}>
          <span style={styles.price}>{product.price} BYN</span>
          {/* Вызываем нашу новую функцию */}
          <button 
            onClick={handleAddToCart} 
            style={styles.button} 
            className="btn-hover-effect"
          >
            В корзину
          </button>
        </div>
      </div>
      
      {/* ВОТ ЗДЕСЬ ДОБАВЛЯЕМ УВЕДОМЛЕНИЕ */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(5px)',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(255, 141, 161, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.5)',
  },
  imagePlaceholder: {
    height: '160px',
    backgroundColor: '#fdf5ff',
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
    color: '#2c3e50',
  },
  button: {
    backgroundColor: 'var(--pink-dark)', // Более насыщенный розовый
    color: '#fff',
    border: 'none',
    padding: '10px 18px',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: '700',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 4px 10px rgba(255, 141, 161, 0.3)' // Добавили легкую тень кнопке
  }
};

export default ProductCard;