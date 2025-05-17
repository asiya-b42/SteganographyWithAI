import React, { useState, useEffect } from 'react';
import { Lock, Eye, Shield } from 'lucide-react';
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
        scrolled ? 'bg-gray-900/95 backdrop-blur-sm shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500"
        >
          <Lock className="text-cyan-400" size={28} />
          <span className="tracking-tight">StegaSafe</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
            <Eye size={16} />
            <span>2048-bit Secure Processing</span>
          </div>
          <Link
            to="/detect"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-1 shadow-lg shadow-cyan-500/20"
          >
            <Shield size={18} />
            <span>AI Detection</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;