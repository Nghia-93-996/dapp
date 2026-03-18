import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './i18n';
import './index.css';
import { WalletProvider } from './hooks/WalletContext';
import App from './App';
import DocumentPage from './pages/DocumentPage';
import DocumentationPage from './pages/DocumentationPage';
import SmartContractGuidePage from './pages/SmartContractGuidePage';
import WalletPage from './pages/WalletPage';
import AdminPage from './pages/AdminPage';
import TestingReportPage from './pages/TestingReportPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <WalletProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/docs" element={<DocumentPage />} />
          <Route path="/documentation" element={<DocumentationPage />} />
          <Route path="/smart-contract" element={<SmartContractGuidePage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/testing-report" element={<TestingReportPage />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </WalletProvider>
    </BrowserRouter>
  </StrictMode>,
);
