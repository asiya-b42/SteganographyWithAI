import React, { useState } from 'react';
import { Shield, Info } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Dropzone from '../components/ui/Dropzone';
import MediaTypeSelector from '../components/ui/MediaTypeSelector';
import DetectionResult from '../components/features/detection/DetectionResult';
import { useAppContext } from '../context/AppContext';
import { detectHiddenMessageInImage } from '../utils/imageSteganoUtils';
import { detectHiddenMessageInAudio } from '../utils/audioSteganoUtils';

const DetectionPage: React.FC = () => {
  const { 
    mediaType, 
    setMediaType, 
    uploadedFile, 
    setUploadedFile,
    detectionResult,
    setDetectionResult,
    isProcessing,
    setIsProcessing
  } = useAppContext();
  
  const [error, setError] = useState<string | null>(null);
  
  const handleMediaTypeChange = (type: 'image' | 'audio' | null) => {
    setMediaType(type);
    setUploadedFile(null);
    setDetectionResult(null);
    setError(null);
  };
  
  const handleFileDrop = (file: File) => {
    setUploadedFile(file);
    setDetectionResult(null);
    setError(null);
  };
  
  const handleDetection = async () => {
    if (!uploadedFile || !mediaType) {
      setError('Please select a file to analyze');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      let result;
      
      if (mediaType === 'image') {
        result = await detectHiddenMessageInImage(uploadedFile);
      } else {
        result = await detectHiddenMessageInAudio(uploadedFile);
      }
      
      setDetectionResult(result);
    } catch (err) {
      console.error('Detection error:', err);
      setError('An error occurred during analysis. Please try again with a different file.');
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="py-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
          <Shield className="text-cyan-400 mr-2" size={28} />
          AI Steganography Detection
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Upload an image or audio file to analyze it for hidden messages. Our AI technology 
          can detect the presence of steganographic content with high accuracy.
        </p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <Card
          className="mb-6"
          bordered
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select media type to analyze
              </label>
              <MediaTypeSelector
                selectedType={mediaType}
                onChange={handleMediaTypeChange}
              />
            </div>
            
            {mediaType && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload a file to analyze
                </label>
                <Dropzone
                  onFileDrop={handleFileDrop}
                  accept={mediaType === 'image' ? 'image/*' : 'audio/*'}
                  label={`Drag & drop your ${mediaType} file here, or click to select`}
                />
              </div>
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
              iconLeft={<Shield size={18} />}
              fullWidth
              isLoading={isProcessing}
              onClick={handleDetection}
              disabled={!uploadedFile || !mediaType}
            >
              Analyze for Hidden Content
            </Button>
          </div>
        </Card>
        
        <DetectionResult
          result={detectionResult}
          isLoading={isProcessing}
        />
        
        <div className="mt-8 p-4 rounded-lg bg-gray-800/30 border border-gray-700">
          <h3 className="font-medium mb-2 flex items-center">
            <Info size={18} className="text-cyan-400 mr-2" />
            How Detection Works
          </h3>
          <p className="text-sm text-gray-400">
            Our AI detection technology analyzes statistical patterns in the file's data, 
            looking for anomalies that may indicate the presence of hidden information. 
            The analysis evaluates bit distribution, unusual patterns, and other 
            steganographic signatures to determine if the file likely contains hidden content.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetectionPage;