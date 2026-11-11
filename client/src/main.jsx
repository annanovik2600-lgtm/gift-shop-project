// client/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { CartProvider } from './context/CartContext' // <-- ДОБАВИЛИ

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider> {/* <-- ОБЕРНУЛИ */}
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>,
)