import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import App from './App';
import './index.css';
import { createRoot } from 'react-dom/client';

// eslint-disable-next-line
const container: any = document.getElementById('root');
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);
