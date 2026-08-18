import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register PWA service worker with logging for debugging
registerSW({ 
  immediate: true,
  onRegistered(r) {
    console.log('PWA Service Worker registered:', r);
  },
  onRegisterError(error) {
    console.error('PWA Service Worker registration error:', error);
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
