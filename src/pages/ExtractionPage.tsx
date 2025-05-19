import React, { useState } from 'react';
import { Unlock, FileText, FileAudio, Copy, Info, ArrowRight, Lock, Search, ChevronDown, Check, Shield } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { decryptMessage } from '../utils/encryptionUtils';
import { extractDataFromImage } from '../utils/imageSteganoUtils';
import { extractDataFromAudio } from '../utils/audioSteganoUtils';

const ExtractionPage = () => {
  const {
    mediaType,
    setMediaType,
    encryptionMethod,
    setEncryptionMethod,
    password,
    setPassword,
    uploadedFile,
    setUploadedFile,
    extractedMessage,
    setExtractedMessage,
    isProcessing,
    setIsProcessing
  } = useAppContext();
  
  // State variables  
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showEncryptionDropdown, setShowEncryptionDropdown] = useState(false);
  const [formStep, setFormStep] = useState(1); // 1 = Select type, 2 = Upload & Configure
  
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
    setExtractedMessage('');
    setError(null);
    setFormStep(2); // Move to next step after selecting type
  };
  
  const handleFileDrop = (file: File) => {
    setUploadedFile(file);
    setExtractedMessage('');
    setError(null);
  };
  
  const validateInputs = () => {
    if (!password.trim()) {
      setError('Please enter the password or key used for encryption');
      return false;
    }
    
    if (!encryptionMethod) {
      setError('Please select the encryption method used');
      return false;
    }
    
    if (!uploadedFile) {
      setError('Please upload a file to extract the message from');
      return false;
    }
    
    if (!mediaType) {
      setError('Please select a media type');
      return false;
    }
    
    return true;
  };
  
  const handleExtraction = async () => {
    if (!validateInputs()) return;
    
    setIsProcessing(true);
    setError(null);
    setCopied(false);
    
    try {
      // Extract the encrypted message from the file
      let encryptedMessage;
      
      if (mediaType === 'image') {
        if (!uploadedFile) throw new Error('No file uploaded');
        encryptedMessage = await extractDataFromImage(uploadedFile);
      } else if (mediaType === 'audio') {
        if (!uploadedFile) throw new Error('No file uploaded');
        encryptedMessage = await extractDataFromAudio(uploadedFile);
      } else {
        throw new Error('Invalid media type');
      }
      
      // Decrypt the message
      if (!encryptionMethod) throw new Error('No encryption method selected');
      const decryptedMessage = await decryptMessage(encryptedMessage, password, encryptionMethod);
      setExtractedMessage(decryptedMessage);
    } catch (err) {
      console.error('Extraction error:', err);
      if (err instanceof Error) {
        setError(err.message || 'Failed to extract or decrypt message. Check your password/key and encryption method.');
      } else {
        setError('Failed to extract or decrypt message. Check your password/key and encryption method.');
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCopyToClipboard = () => {
    if (extractedMessage) {
      navigator.clipboard.writeText(extractedMessage)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    }
  };
  
  const getEncryptionOptionColor = (method: string) => {
    const option = encryptionOptions.find(opt => opt.id === method);
    return option ? option.color : 'blue';
  };
  
  const isClassicalCipher = 
    encryptionMethod === 'caesar' || 
    encryptionMethod === 'playfair' || 
    encryptionMethod === 'hill' || 
    encryptionMethod === 'vigenere';
  
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
                Extract hidden messages from image files like PNG, JPEG, or WebP that contain steganographic content.
              </p>
              <div className="text-blue-600 font-medium flex items-center">
                Extract from Image <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
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
                Recover secret messages from audio files like MP3 or WAV that have embedded information.
              </p>
              <div className="text-teal-600 font-medium flex items-center">
                Extract from Audio <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </button>
      </div>
    );
  };
  
  const renderExtractionForm = () => {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${mediaType === 'image' ? 'bg-blue-100 text-blue-600' : 'bg-teal-100 text-teal-600'}`}>
            {mediaType === 'image' ? <FileText size={20} /> : <FileAudio size={20} />}
          </div>
          Extract from {mediaType === 'image' ? 'Image' : 'Audio'}
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
                <span className="text-gray-500">Select encryption method used</span>
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
            Select the encryption method that was used to encrypt the hidden message.
          </p>
        </div>
        
        <div className="mb-6">
          <label 
            htmlFor="password" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {isClassicalCipher ? 'Cipher Key' : 'Decryption Password'}
          </label>
          <input
            type={isClassicalCipher ? 'text' : 'password'}
            id="password"
            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder={isClassicalCipher ? 'Enter the cipher key used' : 'Enter the password used for encryption'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="mt-2 text-sm text-gray-500">
            {isClassicalCipher 
              ? 'Enter the exact same key that was used during embedding.' 
              : 'This should be the same password that was used to encrypt the message.'}
          </p>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload {mediaType} File with Hidden Message
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
                  Upload a file that contains a hidden message
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
            onClick={() => setFormStep(1)}
            className="text-gray-700 hover:text-gray-900 font-medium flex items-center"
          >
            <ChevronDown className="mr-1 rotate-90" size={16} />
            Back
          </button>
          <button
            type="button"
            onClick={handleExtraction}
            className={`px-6 py-3 rounded-lg font-medium bg-gradient-to-r ${
              encryptionMethod && password && uploadedFile 
                ? 'from-purple-600 to-indigo-600 text-white hover:shadow-lg' 
                : 'from-gray-300 to-gray-400 text-gray-100 cursor-not-allowed'
            } shadow-md transition-all flex items-center`}
            disabled={!encryptionMethod || !password || !uploadedFile || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Extracting...
              </>
            ) : (
              <>
                Extract Message
                <Search size={18} className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  };
  
  const renderExtractedMessage = () => {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
        <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-500 w-full"></div>
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Unlock size={36} className="text-indigo-600" />
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Message Extracted Successfully!
          </h3>
          
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            The hidden message was successfully extracted and decrypted from your {mediaType} file.
          </p>
          
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 shadow-inner text-left relative">
              <div className="whitespace-pre-wrap text-gray-800 font-mono text-sm max-h-64 overflow-y-auto">
                {extractedMessage}
              </div>
              <button
                onClick={handleCopyToClipboard}
                className="absolute top-3 right-3 p-2 bg-white rounded-md border border-gray-200 hover:bg-gray-100 transition-colors group"
                title="Copy to clipboard"
              >
                <Copy size={16} className={copied ? 'text-green-600' : 'text-gray-500'} />
                <span className="absolute bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity -top-8 right-0 whitespace-nowrap">
                  {copied ? 'Copied!' : 'Copy to clipboard'}
                </span>
              </button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                setExtractedMessage('');
                setPassword('');
                setEncryptionMethod(null);
                setUploadedFile(null);
                setFormStep(1);
              }}
              className="px-8 py-3 rounded-lg font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all"
            >
              Extract Another Message
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-gradient-to-b from-indigo-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Extract Secret Messages
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Recover and decrypt messages that have been hidden in innocent-looking files
            using our advanced steganography tools.
          </p>
        </div>
        
        {/* Progress Steps */}
        {!extractedMessage && (
          <div className="flex items-center justify-center max-w-xs mx-auto mb-12">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                formStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
              } transition-colors`}>
                1
              </div>
              <span className={`text-sm mt-2 ${
                formStep >= 1 ? 'text-indigo-600 font-medium' : 'text-gray-500'
              }`}>
                Select Type
              </span>
            </div>
            
            <div className={`flex-1 h-1 mx-3 ${
              formStep >= 2 ? 'bg-indigo-600' : 'bg-gray-200'
            } transition-colors`}></div>
            
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                formStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
              } transition-colors`}>
                2
              </div>
              <span className={`text-sm mt-2 ${
                formStep >= 2 ? 'text-indigo-600 font-medium' : 'text-gray-500'
              }`}>
                Extract
              </span>
            </div>
          </div>
        )}
        
        {/* Form Steps */}
        {extractedMessage ? (
          renderExtractedMessage()
        ) : (
          <>
            {formStep === 1 && renderMediaTypeSelector()}
            {formStep === 2 && renderExtractionForm()}
          </>
        )}
        
        {/* Information Section */}
        <div className="mt-12 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Shield size={20} className="text-indigo-600 mr-2" />
            Extraction Tips
          </h3>
          <div className="text-gray-600 space-y-2 text-sm">
            <p>
              <span className="font-medium">Correct Method Required:</span> You must select the same encryption method that was used to hide the message.
            </p>
            <p>
              <span className="font-medium">Accurate Key:</span> For classical ciphers, you need to enter the exact same key parameters used during embedding.
            </p>
            <p>
              <span className="font-medium">File Integrity:</span> Make sure the file hasn't been modified, compressed, or converted since the message was hidden.
            </p>
            <p>
              <span className="font-medium">Privacy:</span> All extraction happens locally in your browser. Your files and passwords never leave your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtractionPage;