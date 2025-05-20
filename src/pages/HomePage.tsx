import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileText, Unlock, ArrowRight, Lock, Fingerprint, Eye } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white">
      {/* Hero section */}
      <section className="relative overflow-hidden py-20">
        {/* Background design elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-blue-200 opacity-20 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-teal-200 opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-40 h-40 rounded-full bg-indigo-200 opacity-20 blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">

          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
              StegoSafe
            </span>
            <span className="text-gray-800 block mt-2">Modern Steganography</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Hide sensitive information within ordinary files using advanced steganography techniques.
            Your data remains secure, private, and never leaves your device.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/embed" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all flex items-center"
            >
              Get Started <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Security Made Simple
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides powerful steganography tools with an intuitive interface
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100 group">
              <div className="h-3 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
              <div className="p-8">
                <div className="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-indigo-200 transition-all">
                  <ShieldCheck size={28} className="text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">AI Detection</h3>
                <p className="text-gray-600 mb-6">
                  Our advanced algorithms can detect hidden messages in images and audio files 
                  by analyzing statistical patterns and anomalies.
                </p>
                <Link 
                  to="/detect" 
                  className="text-indigo-600 font-medium hover:text-indigo-800 flex items-center"
                >
                  Try Detection <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            {/* Feature Card 2 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100 group">
              <div className="h-3 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <div className="p-8">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-all">
                  <FileText size={28} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Hide Messages</h3>
                <p className="text-gray-600 mb-6">
                  Encrypt your messages with AES, DES, or RSA and hide them within 
                  innocent-looking images or audio files that only you can decode.
                </p>
                <Link 
                  to="/embed" 
                  className="text-blue-600 font-medium hover:text-blue-800 flex items-center"
                >
                  Hide a Message <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            {/* Feature Card 3 */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100 group">
              <div className="h-3 bg-gradient-to-r from-cyan-500 to-teal-500"></div>
              <div className="p-8">
                <div className="w-14 h-14 bg-teal-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-teal-200 transition-all">
                  <Unlock size={28} className="text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Extract Messages</h3>
                <p className="text-gray-600 mb-6">
                  Upload files containing hidden messages to extract and decrypt the 
                  secret information using your secure password.
                </p>
                <Link 
                  to="/extract" 
                  className="text-teal-600 font-medium hover:text-teal-800 flex items-center"
                >
                  Extract a Message <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How it works section */}
      <section className="py-20 px-4 bg-gradient-to-b from-indigo-50 via-blue-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How StegoSafe Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful steganography with an intuitive interface
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <Fingerprint className="text-blue-600 mr-3" size={32} />
                Advanced Steganography
              </h3>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h4 className="font-bold text-gray-800 mb-2">What is Steganography?</h4>
                  <p className="text-gray-600">
                    Steganography is the practice of concealing information within other non-secret data or files. 
                    Unlike encryption, which makes data unreadable, steganography hides the existence of a message completely.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h4 className="font-bold text-gray-800 mb-2">LSB Technique</h4>
                  <p className="text-gray-600">
                    Our platform uses least significant bit (LSB) steganography, which alters the least important bits in image pixels or audio samples—changes imperceptible to human senses but detectable with the right tools.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md">
                  <h4 className="font-bold text-gray-800 mb-2">End-to-End Security</h4>
                  <p className="text-gray-600">
                    Combined with strong encryption, this creates a virtually unbreakable layer of security for your sensitive communications. All processing happens locally in your browser.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform hover:shadow-lg">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Lock size={24} className="text-blue-600" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Multiple Encryption</h4>
                <p className="text-gray-600 text-sm">
                  AES-256, Triple DES, or RSA encryption options
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform hover:shadow-lg">
                <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FileText size={24} className="text-indigo-600" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">File Support</h4>
                <p className="text-gray-600 text-sm">
                  Hide within images and audio files seamlessly
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md transform hover:-translate-y-1 transition-transform hover:shadow-lg">
                <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Eye size={24} className="text-teal-600" />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">Detection</h4>
                <p className="text-gray-600 text-sm">
                  AI-powered detection of hidden content
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;