// client/src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Toast from '../components/Toast';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Списки для выпадающих меню
  const recipients = ['Для всех', 'Для детей', 'Для женщин', 'Для мужчин'];
  const occasions = ['Без повода', 'День рождения', 'Новый год', '8 марта', 'День влюблённых', '23 февраля'];

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

  // Открыть форму редактирования
  const handleEditClick = (product) => {
    setEditingProduct({
      ...product,
      price: product.price.toString(),
      stock_quantity: product.stock_quantity.toString(),
      recipient_type: product.recipient_type || 'Для всех',
      occasion: product.occasion || 'Без повода'
    });
  };

  // Сохранить изменения (Одобрение + Категории)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(`http://localhost:5000/api/products/${editingProduct.id}`, {
        ...editingProduct,
        is_active: 1 // Одобряем (публикуем)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setToast({ message: 'Товар одобрен и опубликован!', type: 'success' });
      setEditingProduct(null); 
      fetchProducts(); 
    } catch (err) {
      setToast({ message: 'Ошибка при сохранении', type: 'error' });
    }
  };

  // Удалить товар
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
      <h2 style={styles.mainTitle}>Управление товарами</h2>
      
      <div style={styles.layout}>
        {/* ЛЕВАЯ ЧАСТЬ: Список всех товаров */}
        <div style={styles.listBox}>
          {products.map(p => (
            <div key={p.id} style={{...styles.productItem, borderLeft: p.is_active ? '5px solid #2ecc71' : '5px solid #e74c3c'}}>
              <div>
                <strong>{p.name}</strong> <span style={{color: '#888', fontSize: '12px'}}>({p.is_active ? 'В каталоге' : 'На модерации'})</span>
                <p style={{margin: '5px 0', fontSize: '14px'}}>{p.price} BYN | {p.stock_quantity} шт.</p>
                {p.recipient_type && <span style={styles.badge}>{p.recipient_type}</span>}
                {p.occasion && <span style={{...styles.badge, backgroundColor: '#fdf5ff', color: '#8e44ad'}}>{p.occasion}</span>}
              </div>
              <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                <button onClick={() => handleEditClick(p)} style={styles.editBtn}>
                  {p.is_active ? 'Редактировать' : 'Одобрить'}
                </button>
                <button onClick={() => handleDelete(p.id)} style={styles.deleteBtn}>Удалить</button>
              </div>
            </div>
          ))}
        </div>

        {/* ПРАВАЯ ЧАСТЬ: Форма редактирования */}
        {editingProduct && (
          <div style={styles.formBox}>
            <h3 style={styles.title}>Настройка товара</h3>
            <form onSubmit={handleSaveProduct} style={styles.form}>
              <label>Название:</label>
              <input type="text" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} required style={styles.input} />
              
              <label>Цена (BYN):</label>
              <input type="number" step="0.01" value={editingProduct.price} onChange={e => setEditingProduct({...editingProduct, price: e.target.value})} required style={styles.input} />
              
              <label>Количество на складе:</label>
              <input type="number" value={editingProduct.stock_quantity} onChange={e => setEditingProduct({...editingProduct, stock_quantity: e.target.value})} required style={styles.input} />

              <label>Кому (получатель):</label>
              <select 
                value={editingProduct.recipient_type} 
                onChange={e => setEditingProduct({...editingProduct, recipient_type: e.target.value})} 
                style={styles.input}
              >
                {recipients.map(r => <option key={r} value={r}>{r}</option>)}
              </select>

              <label>По какому поводу (праздник):</label>
              <select 
                value={editingProduct.occasion} 
                onChange={e => setEditingProduct({...editingProduct, occasion: e.target.value})} 
                style={styles.input}
              >
                {occasions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>

              <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                <button type="submit" style={{...styles.button, backgroundColor: '#2ecc71'}}>Одобрить и Опубликовать</button>
                <button type="button" onClick={() => setEditingProduct(null)} style={{...styles.button, backgroundColor: '#95a5a6'}}>Отмена</button>
              </div>
            </form>
          </div>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '40px auto', padding: '0 20px' },
  mainTitle: { textAlign: 'center', color: '#2c3e50', marginBottom: '30px' },
  layout: { display: 'flex', gap: '30px', flexWrap: 'wrap', alignItems: 'flex-start' },
  listBox: { flex: '1 1 600px', backgroundColor: 'rgba(255,255,255,0.9)', padding: '20px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '15px' },
  productItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' },
  formBox: { flex: '0 0 400px', backgroundColor: 'rgba(255,255,255,0.95)', padding: '30px', borderRadius: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)', position: 'sticky', top: '100px' },
  title: { marginTop: 0, color: '#2c3e50', borderBottom: '2px solid #eee', paddingBottom: '10px' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '15px', fontFamily: 'Nunito, sans-serif' },
  editBtn: { padding: '8px 15px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  deleteBtn: { padding: '8px 15px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  button: { flex: 1, padding: '12px', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' },
  badge: { display: 'inline-block', padding: '4px 8px', backgroundColor: '#e8f8f5', color: '#27ae60', borderRadius: '5px', fontSize: '12px', marginRight: '5px', marginTop: '5px', fontWeight: 'bold' }
};

export default AdminPanel;