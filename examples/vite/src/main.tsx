import { AOWalletKit } from '@project-kardeshev/ao-wallet-kit';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AOWalletKit>
      <App />
    </AOWalletKit>
  </StrictMode>,
);
