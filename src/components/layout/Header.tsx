import React, { useState, useEffect } from 'react';
import { Lock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-2xl font-bold"
        >
          <Lock className="text-indigo-500" size={28} />
          <span className="gradient-text">SecureSteg</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm text-slate-400">
            <span>End-to-end encryption</span>
          </div>
          <Link
            to="/detect"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 shadow-lg"
          >
            <Shield size={18} />
            <span>Detect</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;