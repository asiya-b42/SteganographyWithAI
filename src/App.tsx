import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home, FileText, Unlock, Shield, MessageCircle } from 'lucide-react';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import DetectionPage from './pages/DetectionPage';
import EmbeddingPage from './pages/EmbeddingPage';
import ExtractionPage from './pages/ExtractionPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChatbotPage from './pages/ChatbotPage';
import { AppProvider } from './context/AppContext';

function App() {
  const navItems = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/embed', label: 'Hide Message', icon: <FileText size={20} /> },
    { path: '/extract', label: 'Extract Message', icon: <Unlock size={20} /> },
    { path: '/detect', label: 'Detect Hidden Message', icon: <Shield size={20} /> },
    { path: '/chatbot', label: 'Ask AI Assistant', icon: <MessageCircle size={20} /> },
  ];

  return (
    <AppProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-white text-gray-800">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={
                localStorage.getItem('isLoggedIn') === 'true' ? <HomePage /> : <LoginPage />
              } />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/detect" element={<DetectionPage />} />
              <Route path="/embed" element={<EmbeddingPage />} />
              <Route path="/extract" element={<ExtractionPage />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;