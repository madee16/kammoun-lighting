import React from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.jsx';
import { applyTheme, readStoredTheme, themeFromSystem } from './lib/theme.js';
import './styles.css';

applyTheme(readStoredTheme() || themeFromSystem());

registerSW({ immediate: true });

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);