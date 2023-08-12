import React from 'react';
import ReactDOM from 'react-dom/client';

import { CalendarApp } from './CalendarApp';
import './styles.css';

const isProduction = (import.meta.env.MODE === 'production')

// Verificar si el navegador admite Service Workers
if ( isProduction && 'serviceWorker' in navigator) {
  // Agregar un evento de carga para registrar el Service Worker
  window.addEventListener('load', () => {
    // Registrar el Service Worker
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        // El registro del Service Worker fue exitoso
        console.log('Service Worker registrado con éxito:', registration);
      })
      .catch(error => {
        // Hubo un error al registrar el Service Worker
        console.error('Error al registrar el Service Worker:', error);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <CalendarApp />
  // </React.StrictMode>
)
