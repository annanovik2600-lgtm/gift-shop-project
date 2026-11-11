// client/src/pages/Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user' // По умолчанию покупатель
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert('Регистрация успешна! Теперь вы можете войти.');
      navigate('/login'); // Перекидываем на страницу входа
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при регистрации');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.title}>Создать аккаунт</h2>
        {error && <p style={styles.error}>{error}</p>}
        
        <form onSubmit={handleRegister} style={styles.form}>
          <label>Ваше имя (или название компании):</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required style={styles.input} />

          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required style={styles.input} />

          <label>Пароль:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required style={styles.input} />

          <label>Кто вы?</label>
          <select name="role" value={formData.role} onChange={handleChange} style={styles.input}>
            <option value="user">Покупатель</option>
            <option value="admin">Администратор (для теста)</option>
            <option value="supplier">Поставщик (для теста)</option>
          </select>

          <button type="submit" style={styles.button}>Зарегистрироваться</button>
        </form>

        <p style={{marginTop: '20px', textAlign: 'center'}}>
          Уже есть аккаунт? <Link to="/login" style={{color: 'var(--pink-dark)'}}>Войти</Link>
        </p>
      </div>
    </div>
  );
};

// Используем те же стили, что и для Login
const styles = {
  container: { display: 'flex', justifyContent: 'center', marginTop: '40px', marginBottom: '40px' },
  formBox: { backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', padding: '40px 50px', borderRadius: '25px', boxShadow: '0 15px 35px rgba(255, 141, 161, 0.2)', width: '420px', border: '1px solid white' },
  title: { textAlign: 'center', fontSize: '26px', marginBottom: '25px', color: '#2c3e50', fontWeight: '800' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px' },
  input: { padding: '12px 15px', borderRadius: '15px', border: '1px solid var(--pink-pastel)', outline: 'none', fontSize: '15px', backgroundColor: '#fff', fontFamily: 'Nunito, sans-serif' },
  button: { padding: '14px', backgroundColor: 'var(--pink-dark)', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', marginTop: '15px', fontSize: '16px', fontWeight: '700' },
  error: { color: '#ff4d4d', fontSize: '14px', textAlign: 'center', backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '10px', marginBottom: '15px' }
};

export default Register;