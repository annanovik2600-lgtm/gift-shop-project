// client/src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toast from '../components/Toast';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState(null);
  
  // Форма создания
  const [productData, setProductData] = useState({ name: '', description: '', price: '', stock_quantity: '' });

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/products/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/products', productData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToast({ message: 'Товар успешно добавлен!', type: 'success' });
      setProductData({ name: '', description: '', price: '', stock_quantity: '' });
      fetchProducts(); // Обновляем список
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Ошибка', type: 'error' });
    }
  };

  const handleModerate = async (id, is_active) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/products/${id}/status`, { is_active }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToast({ message: is_active ? 'Товар одобрен!' : 'Товар скрыт', type: 'success' });
      fetchProducts();
    } catch (err) {
      setToast({ message: 'Ошибка модерации', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Удалить товар навсегда?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToast({ message: 'Товар удален', type: 'success' });
      fetchProducts();
    } catch (err) {
      setToast({ message: 'Ошибка удаления', type: 'error' });
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.layout}>
        
        {/* Форма добавления (Админ тоже может добавлять) */}
        <div style={styles.formBox}>
          <h3 style={styles.title}>Добавить товар (от админа)</h3>
          <form onSubmit={handleAddProduct} style={styles.form}>
            <input type="text" name="name" placeholder="Название" value={productData.name} onChange={e => setProductData({...productData, name: e.target.value})} required style={styles.input} />
            <input type="number" step="0.01" name="price" placeholder="Цена" value={productData.price} onChange={e => setProductData({...productData, price: e.target.value})} required style={styles.input} />
            <input type="number" name="stock_quantity" placeholder="Кол-во" value={productData.stock_quantity} onChange={e => setProductData({...productData, stock_quantity: e.target.value})} required style={styles.input} />
            <button type="submit" style={styles.button}>Добавить сразу в каталог</button>
          </form>
        </div>

        {/* Список товаров на модерацию */}
        <div style={styles.listBox}>
          <h3 style={styles.title}>Управление товарами</h3>
          <div style={styles.productList}>
            {products.map(p => (
              <div key={p.id} style={{...styles.productItem, borderLeft: p.is_active ? '5px solid #2ecc71' : '5px solid #e74c3c'}}>
                <div>
                  <strong>{p.name}</strong>
                  <p style={{margin: '5px 0', fontSize: '14px', color: '#666'}}>{p.price} BYN | {p.stock_quantity} шт.</p>
                  {p.supplier_name && <small style={{color: '#8e44ad'}}>Поставщик: {p.supplier_name}</small>}
                </div>
                <div style={{display: 'flex', gap: '10px'}}>
                  {!p.is_active && (
                    <button onClick={() => handleModerate(p.id, 1)} style={styles.approveBtn}>Одобрить</button>
                  )}
                  {p.is_active && (
                    <button onClick={() => handleModerate(p.id, 0)} style={styles.hideBtn}>Скрыть</button>
                  )}
                  <button onClick={() => handleDelete(p.id)} style={styles.deleteBtn}>Удалить</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '40px auto', padding: '0 20px' },
  layout: { display: 'flex', gap: '30px', flexWrap: 'wrap' },
  formBox: { flex: '1 1 300px', backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '25px', borderRadius: '20px', height: 'fit-content' },
  listBox: { flex: '1 1 500px', backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: '25px', borderRadius: '20px' },
  title: { marginTop: 0, color: '#2c3e50', borderBottom: '2px solid #fdf5ff', paddingBottom: '10px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', borderRadius: '10px', border: '1px solid #ddd' },
  button: { padding: '12px', backgroundColor: 'var(--pink-dark)', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
  productList: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' },
  productItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' },
  approveBtn: { padding: '6px 12px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  hideBtn: { padding: '6px 12px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  deleteBtn: { padding: '6px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default AdminPanel;