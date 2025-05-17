import React from 'react';
import { Github, Twitter, Mail, Lock } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 text-xl font-bold mb-4">
              <Lock className="text-cyan-400" size={24} />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">StegaSafe</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Advanced steganography platform with AI detection capabilities for securing your communications.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">How Steganography Works</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Security Best Practices</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">API Documentation</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Report a Bug</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Feature Request</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© 2025 StegaSafe. All rights reserved.</p>
          <p className="mt-2">All processing happens in your browser. Your files never leave your device.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;