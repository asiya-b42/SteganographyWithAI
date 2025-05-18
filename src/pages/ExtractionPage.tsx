import React, { useState } from 'react';
import { FileText, Unlock, Copy, Info } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Dropzone from '../components/ui/Dropzone';
import MediaTypeSelector from '../components/ui/MediaTypeSelector';
import SelectEncryption from '../components/ui/SelectEncryption';
import { useAppContext } from '../context/AppContext';
import { decryptMessage } from '../utils/encryptionUtils';
import { extractDataFromImage } from '../utils/imageSteganoUtils';
import { extractDataFromAudio } from '../utils/audioSteganoUtils';

const ExtractionPage: React.FC = () => {
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
  
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const handleMediaTypeChange = (type: 'image' | 'audio' | null) => {
    setMediaType(type);
    setUploadedFile(null);
    setExtractedMessage('');
    setError(null);
  };
  
  const handleFileDrop = (file: File) => {
    setUploadedFile(file);
    setExtractedMessage('');
    setError(null);
  };
  
  const validateInputs = () => {
    if (!password.trim()) {
      setError('Please enter the password used for encryption');
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
      let encryptedMessage: string;
      
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
    } catch (err: any) {
      console.error('Extraction error:', err);
      setError(err.message || 'Failed to extract or decrypt message. Check your password and encryption method.');
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
  
  return (
    <div className="py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
          <Unlock className="text-indigo-400 mr-2" size={28} />
          <span className="gradient-text">Extract Hidden Messages</span>
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Retrieve and decrypt messages hidden in files. You'll need to know 
          which encryption method was used and have the correct password.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        {!extractedMessage ? (
          <Card
            bordered
            className="mb-6"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Select media type to extract from
                </label>
                <MediaTypeSelector
                  selectedType={mediaType}
                  onChange={handleMediaTypeChange}
                />
              </div>
              
              {mediaType && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Select encryption method used
                    </label>
                    <SelectEncryption
                      selectedMethod={encryptionMethod}
                      onChange={setEncryptionMethod}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                      Decryption password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter the password used for encryption"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Upload {mediaType} file with hidden message
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
                onClick={() => {
                  console.log('Extract button clicked');
                  console.log('Password:', password);
                  console.log('Encryption Method:', encryptionMethod);
                  console.log('File:', uploadedFile);
                  console.log('Media Type:', mediaType);
                  handleExtraction();
                }}
                disabled={!password || !encryptionMethod || !uploadedFile || !mediaType}
              >
                Extract Message
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
                <Unlock size={32} className="text-green-500" />
              </div>
              
              <h3 className="text-xl font-medium text-green-400 mb-2">
                Message Extracted Successfully!
              </h3>
              
              <div className="mt-6 mb-6">
                <div className="bg-slate-900 rounded-lg p-4 text-left relative">
                  <pre className="whitespace-pre-wrap text-slate-300 font-mono text-sm">
                    {extractedMessage}
                  </pre>
                  <button
                    onClick={handleCopyToClipboard}
                    className="absolute top-2 right-2 p-2 bg-slate-800 rounded hover:bg-slate-700 transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy size={16} className={copied ? 'text-green-400' : 'text-slate-400'} />
                  </button>
                </div>
                {copied && (
                  <p className="text-green-400 text-xs mt-1">Copied to clipboard!</p>
                )}
              </div>
              
              <Button
                variant="outline"
                onClick={() => {
                  setExtractedMessage('');
                  setPassword('');
                }}
              >
                Extract Another Message
              </Button>
            </div>
          </Card>
        )}
        
        <div className="mt-8 p-4 rounded-lg bg-slate-800/60 border border-slate-700">
          <h3 className="font-medium mb-2 flex items-center">
            <Info size={18} className="text-indigo-400 mr-2" />
            Extraction Tips
          </h3>
          <ul className="text-sm text-slate-400 space-y-2 list-disc pl-5">
            <li>You must know which encryption method was used to hide the message.</li>
            <li>The password must be exactly the same as the one used during embedding.</li>
            <li>If extraction fails, try a different encryption method or check the password.</li>
            <li>Some files may not contain any hidden messages, resulting in extraction errors.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExtractionPage;