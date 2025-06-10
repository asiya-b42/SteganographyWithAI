import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import DetectionPage from './pages/DetectionPage';
import EmbeddingPage from './pages/EmbeddingPage';
import ExtractionPage from './pages/ExtractionPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { AppProvider } from './context/AppContext';

function App() {
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
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;