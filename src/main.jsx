import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// =======================================================
// IMPORTANTE: Esta linha garante que o Ant Design seja carregado!
import 'antd/dist/reset.css'; 
// =======================================================

// O seu index.css também deve estar aqui, se existir
// import './index.css'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);