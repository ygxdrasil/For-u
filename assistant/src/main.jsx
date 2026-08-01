import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import ErrorBoundary, { watchForUncaughtErrors } from './ErrorBoundary.jsx';
import './styles.css';

watchForUncaughtErrors();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Without this, one bad render blanks the whole page and says nothing. */}
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
