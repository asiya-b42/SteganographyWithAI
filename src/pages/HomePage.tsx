import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileAudio, Image, ArrowRight, Lock, Fingerprint } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const HomePage: React.FC = () => {
  return (
    <div className="py-12">
      {/* Hero section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            Secure Your Messages
          </span>
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          StegaSafe uses advanced steganography techniques to hide your sensitive 
          information within image and audio files, making it virtually invisible 
          to the untrained eye.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/embed">
            <Button
              size="lg"
              iconRight={<ArrowRight size={18} />}
            >
              Hide a Message
            </Button>
          </Link>
          <Link to="/detect">
            <Button
              variant="secondary"
              size="lg"
              iconLeft={<Shield size={18} />}
            >
              AI Detection
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Features section */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Powerful Steganography Tools</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            icon={<Shield size={24} />}
            title="AI Detection"
            subtitle="Detect hidden messages in files"
            hoverable
            bordered
          >
            <p className="text-gray-300 mb-4">
              Our advanced AI technology can analyze images and audio files to detect 
              hidden messages with high accuracy.
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
            icon={<FileAudio size={24} />}
            title="Hide Messages"
            subtitle="Embed secret information securely"
            hoverable
            bordered
          >
            <p className="text-gray-300 mb-4">
              Encrypt your messages with AES, DES, or RSA and hide them within images 
              or audio files that appear normal to others.
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
            icon={<Image size={24} />}
            title="Extract Messages"
            subtitle="Retrieve hidden information"
            hoverable
            bordered
          >
            <p className="text-gray-300 mb-4">
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
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-8 border border-gray-700 order-2 md:order-1">
            <h3 className="text-xl font-medium mb-4 flex items-center">
              <Fingerprint className="text-cyan-400 mr-2" size={24} />
              Steganography Explained
            </h3>
            <p className="text-gray-300 mb-4">
              Steganography is the practice of concealing information within other non-secret data or a physical object. 
              Unlike encryption, which makes data unreadable, steganography hides the existence of the secret message altogether.
            </p>
            <p className="text-gray-300 mb-4">
              Our platform uses least significant bit (LSB) steganography, which alters the least important bits in image or audio data—changes
              imperceptible to human senses but detectable by our algorithms.
            </p>
            <p className="text-gray-300">
              Combined with strong encryption, this creates a virtually unbreakable layer of security for your sensitive communications.
            </p>
          </div>
          
          <div className="space-y-4 order-1 md:order-2">
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 flex items-start">
              <div className="bg-cyan-900/30 rounded-full p-2 mr-3 text-cyan-400">
                <Lock size={20} />
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Multiple Encryption Options</h4>
                <p className="text-gray-400 text-sm">
                  Choose from AES-256, Triple DES, or RSA encryption to secure your message before hiding it.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 flex items-start">
              <div className="bg-cyan-900/30 rounded-full p-2 mr-3 text-cyan-400">
                <FileAudio size={20} />
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">Image & Audio Support</h4>
                <p className="text-gray-400 text-sm">
                  Embed your messages in images or audio files, with techniques optimized for each media type.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 flex items-start">
              <div className="bg-cyan-900/30 rounded-full p-2 mr-3 text-cyan-400">
                <Shield size={20} />
              </div>
              <div>
                <h4 className="font-medium text-white mb-1">AI-Powered Detection</h4>
                <p className="text-gray-400 text-sm">
                  Our advanced algorithms can analyze files and detect if they contain hidden messages.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to action */}
      <section className="text-center bg-gradient-to-r from-cyan-900/20 to-purple-900/20 rounded-xl p-8 border border-gray-700">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to secure your communications?</h2>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Start using our steganography tools today to protect your sensitive information 
          with military-grade encryption and hiding techniques.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/embed">
            <Button
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