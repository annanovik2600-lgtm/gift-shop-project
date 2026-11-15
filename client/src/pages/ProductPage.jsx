// client/src/pages/ProductPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import Toast from '../components/Toast';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [toast, setToast] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    if (!token) {
      setToast({ message: 'Для покупки необходимо войти', type: 'error' });
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    if (user?.role !== 'user') {
      setToast({ message: 'Только покупатели могут добавлять товары', type: 'error' });
      return;
    }
    addToCart(product);
    setToast({ message: 'Товар добавлен в корзину!', type: 'success' });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setToast({ message: 'Функция отзывов скоро появится!', type: 'info' });
    setReviewText('');
  };

  if (!product) {
    return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Загрузка данных...</h2>;
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>Назад в каталог</button>

      <div style={styles.productLayout}>
        <div style={styles.imageBox}>
          {product.image_url ? (
            <img src={`http://localhost:5000${product.image_url}`} alt={product.name} style={styles.mainImage} />
          ) : (
            <div style={{ fontSize: '100px' }}>PODAROK</div>
          )}
        </div>

        <div style={styles.infoBox}>
          <h1 style={styles.title}>{product.name}</h1>
          <p style={styles.price}>{product.price} BYN</p>
          <p style={{ color: product.stock_quantity > 0 ? 'green' : 'red', fontWeight: 'bold', fontSize: '18px' }}>
            {product.stock_quantity > 0 ? `В наличии: ${product.stock_quantity} шт.` : 'Нет в наличии'}
          </p>
          <p style={styles.description}>{product.description}</p>
          <button 
            onClick={handleAddToCart} 
            style={styles.addToCartBtn} 
            className="btn-hover-effect"
          >
            Добавить в корзину
          </button>
        </div>
      </div>

      <div style={styles.reviewsBox}>
        <h2 style={{ marginTop: 0 }}>Отзывы</h2>
        <p>Отзывов пока нет. Будьте первым!</p>
        
        <form onSubmit={handleReviewSubmit} style={styles.reviewForm}>
          <h3 style={{ margin: '0 0 10px 0' }}>Оставить отзыв</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <label>Оценка:</label>
            <select value={rating} onChange={(e) => setRating(e.target.value)} style={styles.select}>
              <option value="5">5 (Отлично)</option>
              <option value="4">4 (Хорошо)</option>
              <option value="3">3 (Нормально)</option>
              <option value="2">2 (Плохо)</option>
              <option value="1">1 (Ужасно)</option>
            </select>
          </div>
          <textarea 
            placeholder="Поделитесь впечатлениями..." 
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            style={styles.textarea}
            required
          />
          <button type="submit" style={styles.submitBtn}>Отправить отзыв</button>
        </form>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '40px auto', padding: '0 20px' },
  backBtn: { background: 'none', border: 'none', color: '#b19cd9', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '20px', padding: 0 },
  productLayout: { display: 'flex', gap: '40px', flexWrap: 'wrap', backgroundColor: 'rgba(255,255,255,0.7)', padding: '30px', borderRadius: '20px' },
  imageBox: { flex: '1 1 400px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: '15px', padding: '20px', minHeight: '400px' },
  mainImage: { maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' },
  infoBox: { flex: '1 1 400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' },
  title: { fontSize: '32px', margin: '0 0 15px 0' },
  price: { fontSize: '28px', color: '#c0392b', fontWeight: 'bold', margin: '0 0 15px 0' },
  description: { fontSize: '16px', color: '#666', lineHeight: '1.6', marginBottom: '30px' },
  addToCartBtn: { padding: '15px 30px', backgroundColor: '#ff8da1', color: 'white', border: 'none', borderRadius: '25px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' },
  reviewsBox: { marginTop: '40px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '30px', borderRadius: '20px' },
  reviewForm: { marginTop: '20px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '15px' },
  select: { padding: '8px', borderRadius: '8px', border: '1px solid #ddd' },
  textarea: { width: '100%', height: '100px', padding: '15px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '15px', resize: 'none' },
  submitBtn: { padding: '10px 25px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '15px', cursor: 'pointer', fontWeight: 'bold' }
};

export default ProductPage;