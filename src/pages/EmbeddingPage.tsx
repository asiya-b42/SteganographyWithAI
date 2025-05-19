import React, { useState, useEffect } from 'react';
import { FileText, Lock, Shield, FileAudio, Download, Info, ArrowRight, X, Check, ChevronDown } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { encryptMessage } from '../utils/encryptionUtils';
import { embedDataInImage } from '../utils/imageSteganoUtils';
import { embedDataInAudio } from '../utils/audioSteganoUtils';

const colorClassMap = {
  blue:  { bg: 'bg-blue-100', text: 'text-blue-600' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
  teal: { bg: 'bg-teal-100', text: 'text-teal-600' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600' },
  sky: { bg: 'bg-sky-100', text: 'text-sky-600' },
};
const EmbeddingPage = () => {
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
  const [showEncryptionDropdown, setShowEncryptionDropdown] = useState(false);
  const [formStep, setFormStep] = useState(1); // 1 = Select type, 2 = Enter message, 3 = Configuration
  
  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (processedFileUrl && processedFileUrl.startsWith('blob:')) {
        URL.revokeObjectURL(processedFileUrl);
      }
    };
  }, [processedFileUrl]);
  
  const encryptionOptions = [
    { id: 'aes', name: 'AES-256', description: 'Advanced Encryption Standard', color: 'blue' },
    { id: 'des', name: 'Triple DES', description: 'Data Encryption Standard', color: 'indigo' },
    { id: 'rsa', name: 'RSA', description: 'Public-key cryptography', color: 'purple' },
    { id: 'caesar', name: 'Caesar Cipher', description: 'Simple substitution cipher', color: 'teal' },
    { id: 'playfair', name: 'Playfair Cipher', description: 'Digraph substitution cipher', color: 'emerald' },
    { id: 'hill', name: 'Hill Cipher', description: 'Polygraphic substitution cipher', color: 'cyan' },
    { id: 'vigenere', name: 'Vigenère Cipher', description: 'Polyalphabetic substitution', color: 'sky' },
  ];
  
  const handleMediaTypeChange = (type: 'image' | 'audio') => {
    setMediaType(type);
    setUploadedFile(null);
    setProcessedFileUrl(null);
    setError(null);
    setFormStep(2); // Move to next step after selecting type
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
      setError('Please enter a password or key for encryption');
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
    
    if (!mediaType) {
      setError('Please select a media type (image or audio)');
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
      const encryptedMessage = await encryptMessage(message, password, encryptionMethod as "aes" | "des" | "rsa" | "caesar" | "playfair" | "hill" | "vigenere");
      
      // Embed the encrypted message in the file
      if (mediaType === 'image') {
        const imageWithMessage = await embedDataInImage(uploadedFile!, encryptedMessage);
        setProcessedFileUrl(imageWithMessage);
      } else if (mediaType === 'audio') {
        const audioWithMessage = await embedDataInAudio(uploadedFile!, encryptedMessage);
        const audioUrl = URL.createObjectURL(audioWithMessage);
        setProcessedFileUrl(audioUrl);
      }
    } catch (err) {
      console.error('Embedding error:', err);
      if (err && typeof err === 'object' && 'message' in err && typeof (err as any).message === 'string') {
        setError((err as { message: string }).message);
      } else {
        setError('An error occurred during embedding. Please try again.');
      }
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
  
  const getEncryptionOptionColor = (method: string) => {
    const option = encryptionOptions.find(opt => opt.id === method);
    return option ? option.color : 'blue';
  };
  
  const renderMediaTypeSelector = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <button
          type="button"
          onClick={() => handleMediaTypeChange('image')}
          className="group relative bg-white overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 border border-gray-100 p-6 text-left h-full"
        >
          <div className="h-2 w-full absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-500 transform transition-transform duration-300 -translate-x-full group-hover:translate-x-0"></div>
          <div className="flex items-start">
            <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 transition-all">
              <FileText size={28} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Image Steganography</h3>
              <p className="text-gray-600 mb-4">
                Hide your encrypted messages within ordinary images like JPEG, PNG, or WebP. The changes are invisible to the human eye.
              </p>
              <div className="text-blue-600 font-medium flex items-center">
                Select Image <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </button>
        
        <button
          type="button"
          onClick={() => handleMediaTypeChange('audio')}
          className="group relative bg-white overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 border border-gray-100 p-6 text-left h-full"
        >
          <div className="h-2 w-full absolute top-0 left-0 right-0 bg-gradient-to-r from-teal-500 to-cyan-500 transform transition-transform duration-300 -translate-x-full group-hover:translate-x-0"></div>
          <div className="flex items-start">
            <div className="w-14 h-14 bg-teal-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-teal-200 transition-all">
              <FileAudio size={28} className="text-teal-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Audio Steganography</h3>
              <p className="text-gray-600 mb-4">
                Conceal messages within audio files like MP3 or WAV. The modifications are inaudible to the human ear.
              </p>
              <div className="text-teal-600 font-medium flex items-center">
                Select Audio <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </button>
      </div>
    );
  };
  
  const renderMessageForm = () => {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${mediaType === 'image' ? 'bg-blue-100 text-blue-600' : 'bg-teal-100 text-teal-600'}`}>
            {mediaType === 'image' ? <FileText size={20} /> : <FileAudio size={20} />}
          </div>
          {mediaType === 'image' ? 'Image Steganography' : 'Audio Steganography'}
        </h3>
        
        <div className="mb-6">
          <label 
            htmlFor="message" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Message to Hide
          </label>
          <textarea
            id="message"
            rows={5}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Enter your secret message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <p className="mt-2 text-sm text-gray-500">
            This message will be encrypted and hidden within your {mediaType} file.
          </p>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setFormStep(1)}
            className="text-gray-700 hover:text-gray-900 font-medium flex items-center"
          >
            <ChevronDown className="mr-1 rotate-90" size={16} />
            Back
          </button>
          <button
            type="button"
            onClick={() => setFormStep(3)}
            className={`px-6 py-2 rounded-lg font-medium bg-gradient-to-r ${message.trim() ? 'from-blue-600 to-indigo-600 text-white' : 'from-gray-300 to-gray-400 text-gray-100 cursor-not-allowed'} shadow-md hover:shadow-lg transition-all disabled:cursor-not-allowed`}
            disabled={!message.trim()}
          >
            Continue
          </button>
        </div>
      </div>
    );
  };
  
  const renderEncryptionForm = () => {
    const isClassicalCipher = 
      encryptionMethod === 'caesar' || 
      encryptionMethod === 'playfair' || 
      encryptionMethod === 'hill' || 
      encryptionMethod === 'vigenere';
    
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3 text-indigo-600">
            <Lock size={20} />
          </div>
          Encryption Settings
        </h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Encryption Method
          </label>
          <div className="relative">
            <button
              type="button"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-left text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center transition-all"
              onClick={() => setShowEncryptionDropdown(!showEncryptionDropdown)}
            >
              {encryptionMethod ? (
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-md bg-${getEncryptionOptionColor(encryptionMethod)}-100 flex items-center justify-center mr-2`}>
                    <Lock size={16} className={`text-${getEncryptionOptionColor(encryptionMethod)}-600`} />
                  </div>
                  <div>
                    <span className="font-medium">{encryptionOptions.find(opt => opt.id === encryptionMethod)?.name}</span>
                    <span className="text-gray-500 text-sm ml-2">
                      {encryptionOptions.find(opt => opt.id === encryptionMethod)?.description}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-gray-500">Select encryption method</span>
              )}
              <ChevronDown size={20} className={`transition-transform ${showEncryptionDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {showEncryptionDropdown && (
              <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-80 overflow-y-auto">
                {encryptionOptions.map(option => (
                  <button
                    key={option.id}
                    type="button"
                    className="w-full px-4 py-3 hover:bg-gray-50 text-left flex items-center justify-between transition-colors"
                    onClick={() => {
                      setEncryptionMethod(option.id as "aes" | "des" | "rsa" | "caesar" | "playfair" | "hill" | "vigenere");
                      setShowEncryptionDropdown(false);
                    }}
                  >
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-md bg-${option.color}-100 flex items-center justify-center mr-2`}>
                        <Lock size={16} className={`text-${option.color}-600`} />
                      </div>
                      <div>
                        <span className="font-medium">{option.name}</span>
                        <span className="text-gray-500 text-sm ml-2">{option.description}</span>
                      </div>
                    </div>
                    {encryptionMethod === option.id && (
                      <Check size={18} className="text-green-600" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Choose the encryption algorithm that will be used to secure your message.
          </p>
        </div>
        
        <div className="mb-6">
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {isClassicalCipher ? 'Cipher Key' : 'Encryption Password'}
          </label>
          <input
            type={isClassicalCipher ? 'text' : 'password'}
            id="password"
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder={isClassicalCipher ? 'Enter cipher key' : 'Enter a strong password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="mt-2 text-sm text-gray-500">
            {isClassicalCipher 
              ? 'This key will be used for the selected cipher algorithm.' 
              : 'Remember this password! You will need it to extract the message later.'}
          </p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload {mediaType} file
          </label>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-all cursor-pointer min-h-[200px] ${
              uploadedFile 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-300 hover:border-blue-500 bg-gray-50 hover:bg-blue-50'
            }`}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <input
              id="fileInput"
              type="file"
              className="hidden"
              accept={mediaType === 'image' ? 'image/*' : 'audio/*'}
              onChange={(e) => {
                const files = e.target.files;
                if (files && files.length > 0) {
                  handleFileDrop(files[0]);
                }
              }}
            />
            
            {uploadedFile ? (
              <div className="text-center w-full">
                {mediaType === 'image' && (
                  <div className="mb-4 relative w-full max-w-xs mx-auto">
                    <img
                      src={URL.createObjectURL(uploadedFile)}
                      alt="Preview"
                      className="max-h-40 max-w-full mx-auto rounded-lg object-contain shadow-md"
                    />
                  </div>
                )}
                {mediaType === 'audio' && (
                  <div className="mb-4 w-full">
                    <audio controls className="w-full">
                      <source src={URL.createObjectURL(uploadedFile)} />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
                <p className="text-green-600 font-medium">File uploaded successfully</p>
                <p className="mt-1 text-sm text-gray-500">Click or drag to replace this file</p>
              </div>
            ) : (
              <div className="text-center">
                {mediaType === 'image' ? (
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                ) : (
                  <FileAudio className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                )}
                <p className="text-gray-700">Drag & drop your {mediaType} file here, or click to select</p>
                <p className="mt-2 text-sm text-gray-500">
                  {mediaType === 'image' ? 'Supports JPG, PNG, WebP, GIF' : 'Supports MP3, WAV, OGG, FLAC'}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 flex items-start">
            <Info size={18} className="mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setFormStep(2)}
            className="text-gray-700 hover:text-gray-900 font-medium flex items-center"
          >
            <ChevronDown className="mr-1 rotate-90" size={16} />
            Back
          </button>
          <button
            type="button"
            onClick={handleEmbedding}
            className={`px-6 py-3 rounded-lg font-medium bg-gradient-to-r ${
              encryptionMethod && password && uploadedFile 
                ? 'from-blue-600 to-indigo-600 text-white hover:shadow-lg' 
                : 'from-gray-300 to-gray-400 text-gray-100 cursor-not-allowed'
            } shadow-md transition-all flex items-center`}
            disabled={!encryptionMethod || !password || !uploadedFile || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Processing...
              </>
            ) : (
              <>
                Hide Message
                <Lock size={18} className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  };
  
  const renderSuccessState = () => {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
        <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 w-full"></div>
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-green-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Message Hidden Successfully!
          </h3>
          
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Your message has been encrypted and hidden in the {mediaType} file.
            Download the file to share it securely.
          </p>
          
          {mediaType === 'image' && processedFileUrl && (
            <div className="mb-8">
              <div className="max-w-md mx-auto bg-gray-50 p-4 rounded-lg border border-gray-200">
                <img
                  src={processedFileUrl}
                  alt="Image with hidden message"
                  className="max-h-64 mx-auto rounded-lg shadow-md"
                />
              </div>
            </div>
          )}
          
          {mediaType === 'audio' && processedFileUrl && (
            <div className="mb-8 max-w-md mx-auto bg-gray-50 p-4 rounded-lg border border-gray-200">
              <audio controls className="w-full">
                <source src={processedFileUrl} />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleDownload}
              className="px-8 py-3 rounded-lg font-medium bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md hover:shadow-lg transition-all flex items-center"
            >
              <Download size={18} className="mr-2" />
              Download {mediaType === 'image' ? 'Image' : 'Audio'} File
            </button>
            
            <button
              type="button"
              onClick={() => {
                setProcessedFileUrl(null);
                setMessage('');
                setPassword('');
                setEncryptionMethod(null);
                setUploadedFile(null);
                setFormStep(1);
              }}
              className="px-6 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all flex items-center"
            >
              <X size={16} className="mr-2" />
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Hide Your Secret Message
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encrypt and conceal your sensitive information within ordinary files
            using advanced steganography techniques.
          </p>
        </div>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between max-w-md mx-auto mb-12">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              formStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            } transition-colors`}>
              1
            </div>
            <span className={`text-sm mt-2 ${
              formStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'
            }`}>
              Select Type
            </span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${
            formStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
          } transition-colors`}></div>
          
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              formStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            } transition-colors`}>
              2
            </div>
            <span className={`text-sm mt-2 ${
              formStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'
            }`}>
              Message
            </span>
          </div>
          
          <div className={`flex-1 h-1 mx-2 ${
            formStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'
          } transition-colors`}></div>
          
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              formStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            } transition-colors`}>
              3
            </div>
            <span className={`text-sm mt-2 ${
              formStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'
            }`}>
              Configure
            </span>
          </div>
        </div>
        
        {/* Form Steps */}
        {processedFileUrl ? (
          renderSuccessState()
        ) : (
          <>
            {formStep === 1 && renderMediaTypeSelector()}
            {formStep === 2 && renderMessageForm()}
            {formStep === 3 && renderEncryptionForm()}
          </>
        )}
        
        {/* Information Section */}
        <div className="mt-12 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Shield size={20} className="text-blue-600 mr-2" />
            Security Information
          </h3>
          <div className="text-gray-600 text-sm space-y-2">
            <p>
              <span className="font-medium">Complete Privacy:</span> All processing happens in your browser - your data never leaves your device.
            </p>
            <p>
              <span className="font-medium">Two-Layer Security:</span> Your message is first encrypted with the algorithm of your choice, then hidden using steganography.
            </p>
            <p>
              <span className="font-medium">Best Practice:</span> Share the password separately from the file for maximum security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmbeddingPage;