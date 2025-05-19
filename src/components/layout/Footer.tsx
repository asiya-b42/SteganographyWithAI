import React from 'react';
import { Lock, Info, Shield, Github } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2 text-xl font-bold mb-2">
              <Lock className="text-blue-600" size={24} />
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">StegaSafe</span>
            </div>
            <p className="text-gray-600 text-sm max-w-md">
              Advanced steganography platform with modern encryption and AI detection.
              All processing happens locally in your browser.
            </p>
          </div>
          
          <div className="flex space-x-8">
            <div>
              <h3 className="text-gray-800 font-medium mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                    <Info size={14} className="mr-1" />
                    <span>How It Works</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                    <Shield size={14} className="mr-1" />
                    <span>Security</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center">
                    <Github size={14} className="mr-1" />
                    <span>Source Code</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>© {currentYear} StegoSafe. All rights reserved.</p>
          <p className="mt-1">Your data never leaves your device.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;