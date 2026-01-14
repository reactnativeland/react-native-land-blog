/// <reference types="vite/client" />
import { createHead, UnheadProvider } from '@unhead/react/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { register } from '@utils/serviceWorker';
import './index.css';

const head = createHead();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UnheadProvider head={head}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UnheadProvider>
  </StrictMode>
);

// Register service worker (enabled in dev for testing PWA features)
register({
  onSuccess: () => {
    console.log('Service worker registered successfully');
  },
  onUpdate: () => {
    console.log('New service worker available');
  },
});
