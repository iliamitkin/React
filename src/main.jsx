import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { getSentryErrorBoundary, initializeMonitoring, trackWebVital } from './monitoring';
import { reportWebVitals } from './reportWebVitals';

async function startApp() {
  try {
    await initializeMonitoring(import.meta.env);
  } catch (error) {
    console.error('Monitoring initialization failed', error);
  }
  const SentryErrorBoundary = getSentryErrorBoundary();
  const app = SentryErrorBoundary
    ? <SentryErrorBoundary fallback={<main role="alert">Что-то пошло не так. Перезагрузите страницу.</main>}><App/></SentryErrorBoundary>
    : <App/>;
  createRoot(document.getElementById('root')).render(<React.StrictMode>{app}</React.StrictMode>);
  reportWebVitals(trackWebVital);
}

startApp();
