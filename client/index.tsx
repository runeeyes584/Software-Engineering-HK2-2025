import React from 'react';
import ReactDOM from 'react-dom/client';
import NotFoundPage from './app/404';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <NotFoundPage />
  </React.StrictMode>
); 