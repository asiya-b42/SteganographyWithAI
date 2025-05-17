import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Shield, FileAudio, Image, Home } from 'lucide-react';

import Header from './components/layout/Header';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import DetectionPage from './pages/DetectionPage';
import EmbeddingPage from './pages/EmbeddingPage';
import ExtractionPage from './pages/ExtractionPage';
import { AppProvider } from './context/AppContext';

function App() {
  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/detect', label: 'AI Detection', icon: <Shield size={20} /> },
    { path: '/embed', label: 'Hide Message', icon: <FileAudio size={20} /> },
    { path: '/extract', label: 'Extract Message', icon: <Image size={20} /> },
  ];

  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100">
          <Header />
          <Navbar items={navItems} />
          <main className="flex-grow container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/detect" element={<DetectionPage />} />
              <Route path="/embed" element={<EmbeddingPage />} />
              <Route path="/extract" element={<ExtractionPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;