import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/main.scss';
import App from './App.tsx';
import TrpcProvider from './lib/trpc.provider.tsx';
import { AuthProvider } from './lib/auth.provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TrpcProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </TrpcProvider>
    </BrowserRouter>
  </StrictMode>,
);
