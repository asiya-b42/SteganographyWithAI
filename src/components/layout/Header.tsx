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
        scrolled ? 'bg-white shadow-md' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-2xl font-bold"
        >
          <Lock className="text-blue-600" size={28} />
          <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">StegoSafe</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
            <Link to="/embed" className="text-gray-700 hover:text-blue-600 font-medium">Hide</Link>
            <Link to="/extract" className="text-gray-700 hover:text-blue-600 font-medium">Extract</Link>
            <Link to="/detect" className="text-gray-700 hover:text-blue-600 font-medium">Detect</Link>
          </nav>
    
        </div>
      </div>
    </header>
  );
};

export default Header;