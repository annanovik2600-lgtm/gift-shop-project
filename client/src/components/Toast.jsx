// client/src/components/Toast.jsx
import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  // Автоматически скрываем уведомление через 3 секунды
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Цвета для разных типов сообщений
  const colors = {
    success: { bg: '#e8f8f5', border: '#2ecc71', text: '#27ae60' },
    error: { bg: '#fdedec', border: '#e74c3c', text: '#c0392b' },
    info: { bg: '#ebf5fb', border: '#3498db', text: '#2980b9' }
  };

  const theme = colors[type];

  return (
    <div style={{
      position: 'fixed',
      top: '80px', // Отступ сверху, чтобы не перекрывать шапку
      right: '20px',
      backgroundColor: theme.bg,
      borderLeft: `5px solid ${theme.border}`,
      color: theme.text,
      padding: '15px 25px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      zIndex: 1000,
      fontWeight: '600',
      fontFamily: 'Nunito, sans-serif',
      animation: 'slideIn 0.3s ease-out'
    }}>
      {message}
    </div>
  );
};

export default Toast;