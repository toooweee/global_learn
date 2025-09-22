import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import TrpcProvider from './lib/trpc.provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TrpcProvider>
        <App />
      </TrpcProvider>
    </BrowserRouter>
  </StrictMode>,
);
