import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './app';
import './locales/i18n';
import './global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0b1117',
            color: '#c8d3dc',
            border: '1px solid #1e2a36',
          },
          success: { iconTheme: { primary: '#00e87d', secondary: '#05090c' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
