import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage.jsx';
import MetalPricesPage from './Components/MetalPricesPage.jsx';
import { SSEProvider } from './context/SSEContext.jsx';


function App() {
  return (
    <SSEProvider>
    <Router>
      <Routes>
        {/* Default route - redirects to home */}
        <Route path="/" element={<Navigate to="/home" replace />} />

        {/* Home page route */}
        <Route path="/home" element={<HomePage />} />

        {/* Metal prices route */}
        <Route path="/metal-prices" element={<MetalPricesPage />} />

        {/* Catch all route - redirects to home if route not found */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
    </SSEProvider>
  );
}

export default App;