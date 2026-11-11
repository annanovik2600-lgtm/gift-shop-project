// client/src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Хук для переадресации

  const handleLogin = async (e) => {
    e.preventDefault(); // Запрещаем странице перезагружаться при отправке формы
    setError('');

    try {
      // Отправляем данные на наш сервер
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      // Если успех, сервер вернул токен. Сохраняем его в браузере!
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      alert('Вы успешно вошли!');
      
      // Перенаправляем на главную страницу (в каталог)
      navigate('/');
      // Перезагружаем страницу, чтобы шапка обновилась (пока сделаем так)
      window.location.reload(); 
      
    } catch (err) {
      // Если ошибка (неверный пароль), показываем её
      setError(err.response?.data?.error || 'Ошибка при входе. Проверьте данные.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formBox}>
        <h2 style={styles.title}>Вход в систему</h2>
        {error && <p style={styles.error}>{error}</p>}
        
        <form onSubmit={handleLogin} style={styles.form}>
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={styles.input}
          />

          <label>Пароль:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={styles.input}
          />

          <button type="submit" style={styles.button}>Войти</button>
        </form>

        <p style={{marginTop: '15px'}}>
          Нет аккаунта? <Link to="/register" style={{color: '#3498db'}}>Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    marginTop: '60px' 
  },
  formBox: { 
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    backdropFilter: 'blur(10px)',
    padding: '50px 60px', /* Увеличили внутренние отступы: сверху/снизу 50, по бокам 60 */
    borderRadius: '25px', 
    boxShadow: '0 15px 35px rgba(255, 141, 161, 0.2)', 
    width: '420px', /* Ширина была 350px, стала 420px */
    border: '1px solid white',
  },
  title: {
    textAlign: 'center',
    fontSize: '28px', /* Увеличили заголовок */
    marginBottom: '30px',
    color: '#2c3e50', 
    fontWeight: '800'
  },
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '15px' 
  },
  input: { 
    padding: '14px 18px', /* Сделали поля ввода чуть больше */
    borderRadius: '15px', 
    border: '1px solid var(--pink-pastel)', 
    outline: 'none',
    fontSize: '16px',
    backgroundColor: '#fff',
    fontFamily: 'Nunito, sans-serif'
  },
  button: { 
    padding: '14px', 
    backgroundColor: 'var(--pink-dark)', 
    color: 'white', 
    border: 'none', 
    borderRadius: '20px', 
    cursor: 'pointer', 
    marginTop: '15px',
    fontSize: '18px',
    fontWeight: '700',
    transition: 'background 0.3s'
  },
  error: { 
    color: '#ff4d4d', 
    fontSize: '14px',
    textAlign: 'center',
    backgroundColor: '#ffe6e6',
    padding: '10px',
    borderRadius: '10px',
    marginBottom: '15px'
  }
};

export default Login;