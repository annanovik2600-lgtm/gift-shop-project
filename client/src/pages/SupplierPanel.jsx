// client/src/pages/SupplierPanel.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Toast from '../components/Toast';

const SupplierPanel = () => {
  const [productData, setProductData] = useState({
    name: '', description: '', price: '', stock_quantity: ''
  });
  const [toast, setToast] = useState(null);
  const [image, setImage] = useState(null);

  const handleChange = (e) => setProductData({ ...productData, [e.target.name]: e.target.value });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // Создаем FormData (он нужен для передачи файлов)
      const formData = new FormData();
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('stock_quantity', productData.stock_quantity);
      
      // Добавляем файл, если он выбран
      if (image) {
        formData.append('image', image);
      }

      await axios.post('http://localhost:5000/api/products', formData, {
        headers: { Authorization: `Bearer ${token}` } // Content-Type axios ставит сам!
      });

      setToast({ message: 'Товар с картинкой отправлен на модерацию!', type: 'success' });
      setProductData({ name: '', description: '', price: '', stock_quantity: '' });
      setImage(null); // Очищаем файл
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Ошибка', type: 'error' });
    }
  };

  return (
    <div style={styles.container}>
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
              {image ? image.name : ' Выбрать фотографию'}
            </label>
          </div>

          <label>Цена (BYN):</label>
          <input type="number" step="0.01" name="price" value={productData.price} onChange={handleChange} required style={styles.input} />

          <label>Количество на складе:</label>
          <input type="number" name="stock_quantity" value={productData.stock_quantity} onChange={handleChange} required style={styles.input} />

          <button type="submit" style={styles.button} className="btn-hover-effect">Отправить на модерацию</button>
        </form>
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', marginTop: '40px' },
  formBox: { backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', padding: '40px 50px', borderRadius: '25px', boxShadow: '0 15px 35px rgba(255, 141, 161, 0.2)', width: '500px', border: '1px solid white' },
  title: { textAlign: 'center', fontSize: '24px', marginBottom: '10px', color: '#2c3e50', fontWeight: '800' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '12px 15px', borderRadius: '15px', border: '1px solid var(--pink-pastel)', outline: 'none', fontSize: '15px', backgroundColor: '#fff', fontFamily: 'Nunito, sans-serif' },
  button: { padding: '14px', backgroundColor: 'var(--pink-dark)', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', marginTop: '15px', fontSize: '16px', fontWeight: '700' },
    fileUploadContainer: {
    position: 'relative',
    marginBottom: '15px'
  },
  fileInput: {
    display: 'none' // Прячем стандартный уродливый инпут
  },
  fileLabel: {
    display: 'block',
    padding: '12px 15px',
    backgroundColor: '#fff',
    border: '2px dashed var(--pink-pastel)', // Красивая пунктирная рамка
    borderRadius: '15px',
    textAlign: 'center',
    cursor: 'pointer',
    color: '#666',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  }
};

export default SupplierPanel;