import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Unlock, ArrowRight, Lock, Fingerprint } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  return (
    <div className="py-12">
      {/* Hero section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="gradient-text">
            Protect Your Secret Messages
          </span>
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
          Hide sensitive information within ordinary files using advanced steganography techniques. 
          Your data never leaves your browser.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/embed">
            <Button
              variant="primary"
              size="lg"
              iconRight={<ArrowRight size={18} />}
            >
              Hide a Message
            </Button>
          </Link>
          <Link to="/extract">
            <Button
              variant="secondary"
              size="lg"
              iconLeft={<Unlock size={18} />}
            >
              Extract a Message
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Features section */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Simple & Secure Steganography</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            icon={<Shield size={24} />}
            title="AI Detection"
            subtitle="Analyze files for hidden content"
            hoverable
            bordered
          >
            <p className="text-slate-300 mb-4">
              Our advanced algorithms can detect hidden messages in images and audio files 
              by analyzing statistical patterns and anomalies.
            </p>
            <Link to="/detect" className="block">
              <Button
                variant="outline"
                fullWidth
                iconRight={<ArrowRight size={16} />}
              >
                Try Detection
              </Button>
            </Link>
          </Card>
          
          <Card
            icon={<FileText size={24} />}
            title="Hide Messages"
            subtitle="Secure your information"
            hoverable
            bordered
          >
            <p className="text-slate-300 mb-4">
              Encrypt your messages with AES, DES, or RSA and hide them within 
              innocent-looking images or audio files that only you can decode.
            </p>
            <Link to="/embed" className="block">
              <Button
                variant="outline"
                fullWidth
                iconRight={<ArrowRight size={16} />}
              >
                Hide a Message
              </Button>
            </Link>
          </Card>
          
          <Card
            icon={<Unlock size={24} />}
            title="Extract Messages"
            subtitle="Retrieve hidden information"
            hoverable
            bordered
          >
            <p className="text-slate-300 mb-4">
              Upload files containing hidden messages to extract and decrypt the 
              secret information using your secure password.
            </p>
            <Link to="/extract" className="block">
              <Button
                variant="outline"
                fullWidth
                iconRight={<ArrowRight size={16} />}
              >
                Extract a Message
              </Button>
            </Link>
          </Card>
        </div>
      </section>
      
      {/* How it works section */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 order-2 md:order-1">
            <h3 className="text-xl font-medium mb-4 flex items-center">
              <Fingerprint className="text-indigo-400 mr-2" size={24} />
              Steganography Explained
            </h3>
            <p className="text-slate-300 mb-4">
              Steganography is the practice of concealing information within other non-secret data or files. 
              Unlike encryption, which makes data unreadable, steganography hides the existence of a message completely.
            </p>
            <p className="text-slate-300 mb-4">
              Our platform uses least significant bit (LSB) steganography, which alters the least important bits in image pixels or 
              audio samples—changes imperceptible to human senses but detectable with the right tools.
            </p>
            <p className="text-slate-300">
              Combined with strong encryption, this creates a virtually unbreakable layer of security for your sensitive communications.
            </p>
          </div>
          
          <div className="space-y-4 order-1 md:order-2">
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-start">
              <div className="bg-indigo-900/30 rounded-full p-2 mr-3 text-indigo-400">
                <Lock size={20} />
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Multiple Encryption Options</h4>
                <p className="text-slate-400 text-sm">
                  Choose from AES-256, Triple DES, or RSA encryption before hiding your message.
                </p>
              </div>
            </div>
            
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-start">
              <div className="bg-indigo-900/30 rounded-full p-2 mr-3 text-indigo-400">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Image & Audio Support</h4>
                <p className="text-slate-400 text-sm">
                  Hide messages in various image formats or audio files with specialized techniques.
                </p>
              </div>
            </div>
            
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-start">
              <div className="bg-indigo-900/30 rounded-full p-2 mr-3 text-indigo-400">
                <Shield size={20} />
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">AI-Powered Detection</h4>
                <p className="text-slate-400 text-sm">
                  Advanced algorithms can scan files to determine if they contain hidden data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="text-center bg-gradient-to-r from-indigo-900/20 to-cyan-900/20 rounded-xl p-8 border border-slate-700">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to secure your communications?</h2>
        <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
          Start using our steganography tools today to protect your sensitive information 
          with military-grade encryption and hiding techniques.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/embed">
            <Button
              variant="primary"
              size="lg"
              iconRight={<ArrowRight size={18} />}
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;