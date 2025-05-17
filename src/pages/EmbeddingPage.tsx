import React, { useState } from 'react';
import { FileText, Lock, FileAudio, Download, Info } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Dropzone from '../components/ui/Dropzone';
import MediaTypeSelector from '../components/ui/MediaTypeSelector';
import SelectEncryption from '../components/ui/SelectEncryption';
import { useAppContext } from '../context/AppContext';
import { encryptMessage } from '../utils/encryptionUtils';
import { embedDataInImage } from '../utils/imageSteganoUtils';
import { embedDataInAudio } from '../utils/audioSteganoUtils';

const EmbeddingPage: React.FC = () => {
  const {
    mediaType,
    setMediaType,
    encryptionMethod,
    setEncryptionMethod,
    message,
    setMessage,
    password,
    setPassword,
    uploadedFile,
    setUploadedFile,
    processedFileUrl,
    setProcessedFileUrl,
    isProcessing,
    setIsProcessing
  } = useAppContext();
  
  const [error, setError] = useState<string | null>(null);
  
  const handleMediaTypeChange = (type: 'image' | 'audio' | null) => {
    setMediaType(type);
    setUploadedFile(null);
    setProcessedFileUrl(null);
    setError(null);
  };
  
  const handleFileDrop = (file: File) => {
    setUploadedFile(file);
    setProcessedFileUrl(null);
    setError(null);
  };
  
  const validateInputs = () => {
    if (!message.trim()) {
      setError('Please enter a message to hide');
      return false;
    }
    
    if (!password.trim()) {
      setError('Please enter a password for encryption');
      return false;
    }
    
    if (!encryptionMethod) {
      setError('Please select an encryption method');
      return false;
    }
    
    if (!uploadedFile) {
      setError('Please upload a file to embed your message in');
      return false;
    }
    
    return true;
  };
  
  const handleEmbedding = async () => {
    if (!validateInputs()) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Encrypt the message
      const encryptedMessage = await encryptMessage(message, password, encryptionMethod!);
      
      // Embed the encrypted message in the file
      if (mediaType === 'image') {
        const imageWithMessage = await embedDataInImage(uploadedFile!, encryptedMessage);
        setProcessedFileUrl(imageWithMessage);
      } else if (mediaType === 'audio') {
        const audioWithMessage = await embedDataInAudio(uploadedFile!, encryptedMessage);
        setProcessedFileUrl(URL.createObjectURL(audioWithMessage));
      }
    } catch (err: any) {
      console.error('Embedding error:', err);
      setError(err.message || 'An error occurred during embedding. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDownload = () => {
    if (!processedFileUrl) return;
    
    const link = document.createElement('a');
    link.href = processedFileUrl;
    link.download = `stegasafe_${mediaType === 'image' ? 'image.png' : 'audio.wav'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="py-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
          <Lock className="text-cyan-400 mr-2" size={28} />
          Hide Encrypted Messages
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Hide your messages securely within image or audio files. First, your message will be 
          encrypted with your chosen method, then embedded invisibly in your selected file.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        {!processedFileUrl ? (
          <Card
            bordered
            className="mb-6"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Select media type for hiding your message
                </label>
                <MediaTypeSelector
                  selectedType={mediaType}
                  onChange={handleMediaTypeChange}
                />
              </div>
              
              {mediaType && (
                <>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message to hide
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Enter your secret message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Select encryption method
                    </label>
                    <SelectEncryption
                      selectedMethod={encryptionMethod}
                      onChange={setEncryptionMethod}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                      Encryption password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Enter a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Remember this password! You'll need it to extract the message later.
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Upload {mediaType} file
                    </label>
                    <Dropzone
                      onFileDrop={handleFileDrop}
                      accept={mediaType === 'image' ? 'image/*' : 'audio/*'}
                      label={`Drag & drop your ${mediaType} file here, or click to select`}
                    />
                  </div>
                </>
              )}
              
              {error && (
                <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 text-red-400">
                  <p className="flex items-center">
                    <Info size={18} className="mr-2 flex-shrink-0" />
                    {error}
                  </p>
                </div>
              )}
              
              <Button
                variant="primary"
                size="lg"
                iconLeft={<FileText size={18} />}
                fullWidth
                isLoading={isProcessing}
                onClick={handleEmbedding}
                disabled={!message || !password || !encryptionMethod || !uploadedFile || !mediaType}
              >
                Hide Message
              </Button>
            </div>
          </Card>
        ) : (
          <Card
            bordered
            className="mb-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileAudio size={32} className="text-green-500" />
              </div>
              
              <h3 className="text-xl font-medium text-green-400 mb-2">
                Message Hidden Successfully!
              </h3>
              
              <p className="text-gray-300 mb-6">
                Your message has been encrypted and hidden in the {mediaType} file.
                Download the file to share it securely.
              </p>
              
              {mediaType === 'image' && (
                <div className="mb-6">
                  <img
                    src={processedFileUrl}
                    alt="Image with hidden message"
                    className="max-h-60 mx-auto rounded-lg border border-gray-700"
                  />
                </div>
              )}
              
              {mediaType === 'audio' && (
                <div className="mb-6">
                  <audio controls className="w-full">
                    <source src={processedFileUrl} />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              
              <Button
                variant="primary"
                size="lg"
                iconLeft={<Download size={18} />}
                onClick={handleDownload}
              >
                Download {mediaType === 'image' ? 'Image' : 'Audio'} File
              </Button>
              
              <button
                className="block mx-auto mt-4 text-cyan-400 hover:text-cyan-300 text-sm"
                onClick={() => {
                  setProcessedFileUrl(null);
                  setMessage('');
                  setPassword('');
                }}
              >
                Hide another message
              </button>
            </div>
          </Card>
        )}
        
        <div className="mt-8 p-4 rounded-lg bg-gray-800/30 border border-gray-700">
          <h3 className="font-medium mb-2 flex items-center">
            <Info size={18} className="text-cyan-400 mr-2" />
            Security Information
          </h3>
          <p className="text-sm text-gray-400">
            All processing happens in your browser. Your files and messages never leave your device.
            The encryption and embedding process is completely private. Remember to share the password
            through a separate, secure channel from the file itself.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmbeddingPage;