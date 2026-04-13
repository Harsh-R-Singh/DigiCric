import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

const originalFetch = window.fetch;
window.fetch = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  if (token && url.toString().includes('/api/v1/')) {
    if (!options.headers) {
      options.headers = {};
    }
    if (options.headers instanceof Headers) {
      if (!options.headers.has('Authorization')) {
        options.headers.append('Authorization', `Bearer ${token}`);
      }
    } else {
      if (!options.headers['Authorization']) {
        options.headers = {
          ...options.headers,
          'Authorization': `Bearer ${token}`
        };
      }
    }
  }
  return originalFetch(url, options);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
