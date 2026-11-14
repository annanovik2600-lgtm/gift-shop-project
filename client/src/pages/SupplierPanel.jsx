// client/src/pages/SupplierPanel.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toast from '../components/Toast';

const SupplierPanel = () => {
  // Состояние для формы
  const [productData, setProductData] = useState({
    name: '', description: '', price: '', stock_quantity: ''
  });
  const [image, setImage] = useState(null);
  const [toast, setToast] = useState(null);

  // Состояние для списка товаров поставщика
  const [myProducts, setMyProducts] = useState([]);

  // Загрузка товаров при открытии страницы
  const fetchMyProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/products/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyProducts(res.data);
    } catch (err) {
      console.error('Ошибка загрузки товаров', err);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleChange = (e) => setProductData({ ...productData, [e.target.name]: e.target.value });

  // Отправка нового товара
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('stock_quantity', productData.stock_quantity);
      
      if (image) {
        formData.append('image', image);
      }

      await axios.post('http://localhost:5000/api/products', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setToast({ message: 'Товар отправлен на модерацию!', type: 'success' });
      setProductData({ name: '', description: '', price: '', stock_quantity: '' });
      setImage(null); 
      
      // Обновляем список товаров после добавления
      fetchMyProducts(); 
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Ошибка', type: 'error' });
    }
  };

  return (
    <div style={styles.container}>
      
      {/* ЛЕВАЯ КОЛОНКА: Форма добавления */}
      <div style={styles.formBox}>
        <h2 style={styles.title}>Панель Поставщика</h2>
        <p style={{textAlign: 'center', color: '#666', marginBottom: '20px'}}>Предложить новый товар</p>
        
        <form onSubmit={handleAddProduct} style={styles.form}>
          <label>Название товара:</label>
          <input type="text" name="name" value={productData.name} onChange={handleChange} required style={styles.input} />

          <label>Описание:</label>
          <textarea name="description" value={productData.description} onChange={handleChange} style={{...styles.input, height: '80px', resize: 'none'}} />

          <label>Фотография товара:</label>
          <div style={styles.fileUploadContainer}>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setImage(e.target.files[0])} 
              style={styles.fileInput} 
              id="file-upload"
            />
            <label htmlFor="file-upload" style={styles.fileLabel}>
              {image ? image.name : 'Выбрать фотографию'}
            </label>
          </div>

          <label>Цена (BYN):</label>
          <input type="number" step="0.01" name="price" value={productData.price} onChange={handleChange} required style={styles.input} />

          <label>Количество на складе:</label>
          <input type="number" name="stock_quantity" value={productData.stock_quantity} onChange={handleChange} required style={styles.input} />

          <button type="submit" style={styles.button} className="btn-hover-effect">Отправить на модерацию</button>
        </form>
      </div>

      {/* ПРАВАЯ КОЛОНКА: Список моих товаров */}
      <div style={styles.listBox}>
        <h3 style={styles.title}>Мои товары и остатки</h3>
        
        {myProducts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>Вы еще не добавили ни одного товара.</p>
        ) : (
          <div style={styles.productList}>
            {myProducts.map(p => (
              <div key={p.id} style={styles.productItem}>
                <div>
                  <strong style={{ fontSize: '16px', color: '#2c3e50' }}>{p.name}</strong>
                  <div style={{ fontSize: '13px', color: p.is_active ? '#27ae60' : '#e74c3c', marginTop: '5px', fontWeight: 'bold' }}>
                    Статус: {p.is_active ? 'В каталоге' : 'На модерации'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: p.stock_quantity > 5 ? '#27ae60' : '#e74c3c', fontSize: '16px' }}>
                    {p.stock_quantity} шт.
                  </div>
                  <div style={{ fontSize: '13px', color: '#888' }}>{p.price} BYN</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

const styles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    gap: '30px', 
    marginTop: '40px', 
    padding: '0 20px',
    flexWrap: 'wrap',
    alignItems: 'flex-start'
  },
  formBox: { 
    flex: '1 1 400px',
    maxWidth: '500px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    backdropFilter: 'blur(10px)', 
    padding: '40px 50px', 
    borderRadius: '25px', 
    boxShadow: '0 15px 35px rgba(255, 141, 161, 0.2)', 
    border: '1px solid white' 
  },
  listBox: {
    flex: '1 1 400px',
    maxWidth: '500px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    padding: '30px', 
    borderRadius: '25px', 
    boxShadow: '0 15px 35px rgba(255, 141, 161, 0.1)',
    border: '1px solid white'
  },
  title: { textAlign: 'center', fontSize: '22px', marginBottom: '20px', color: '#2c3e50', fontWeight: '800' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '12px 15px', borderRadius: '15px', border: '1px solid var(--pink-pastel)', outline: 'none', fontSize: '15px', backgroundColor: '#fff', fontFamily: 'Nunito, sans-serif' },
  button: { padding: '14px', backgroundColor: 'var(--pink-dark)', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', marginTop: '15px', fontSize: '16px', fontWeight: '700' },
  fileUploadContainer: { position: 'relative', marginBottom: '10px' },
  fileInput: { display: 'none' },
  fileLabel: { display: 'block', padding: '12px 15px', backgroundColor: '#fff', border: '2px dashed var(--pink-pastel)', borderRadius: '15px', textAlign: 'center', cursor: 'pointer', color: '#666', fontWeight: '600', transition: 'all 0.3s ease' },
  productList: { display: 'flex', flexDirection: 'column', gap: '15px' },
  productItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '15px', border: '1px solid #eee' }
};

export default SupplierPanel;