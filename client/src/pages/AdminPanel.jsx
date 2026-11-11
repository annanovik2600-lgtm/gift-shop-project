// client/src/pages/AdminPanel.jsx
import React, { useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: 1 // Для теста ставим 1, если у вас есть категории
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // Получаем токен админа из localStorage
      const token = localStorage.getItem('token');
      
      // Отправляем запрос с заголовком Authorization
      await axios.post('http://localhost:5000/api/products', productData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessage('Товар успешно добавлен!');
      setProductData({ name: '', description: '', price: '', stock_quantity: '', category_id: 1 }); // Очищаем форму
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при добавлении. Вы точно админ?');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.title}>Панель Администратора</h2>
        <p style={{textAlign: 'center', color: '#666', marginBottom: '20px'}}>Добавление нового подарка в каталог</p>
        
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleAddProduct} style={styles.form}>
          <label>Название подарка:</label>
          <input type="text" name="name" value={productData.name} onChange={handleChange} required style={styles.input} />

          <label>Описание:</label>
          <textarea name="description" value={productData.description} onChange={handleChange} style={{...styles.input, height: '80px', resize: 'none'}} />

          <label>Цена (BYN):</label>
          <input type="number" step="0.01" name="price" value={productData.price} onChange={handleChange} required style={styles.input} />

          <label>Количество на складе:</label>
          <input type="number" name="stock_quantity" value={productData.stock_quantity} onChange={handleChange} required style={styles.input} />

          <button type="submit" style={styles.button}>Добавить товар</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', marginTop: '40px' },
  formBox: { backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', padding: '40px 50px', borderRadius: '25px', boxShadow: '0 15px 35px rgba(255, 141, 161, 0.2)', width: '500px', border: '1px solid white' },
  title: { textAlign: 'center', fontSize: '24px', marginBottom: '10px', color: '#ff8da1', fontWeight: '800' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '12px 15px', borderRadius: '15px', border: '1px solid var(--pink-pastel)', outline: 'none', fontSize: '15px', backgroundColor: '#fff', fontFamily: 'Nunito, sans-serif' },
  button: { padding: '14px', backgroundColor: 'var(--pink-dark)', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', marginTop: '15px', fontSize: '16px', fontWeight: '700' },
  error: { color: '#ff4d4d', fontSize: '14px', textAlign: 'center', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '10px' },
  success: { color: '#2ecc71', fontSize: '14px', textAlign: 'center', backgroundColor: '#e8f8f5', padding: '10px', borderRadius: '10px' }
};

export default AdminPanel;