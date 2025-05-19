import React, { useState } from 'react';
import { Shield, AlertTriangle, FileText, FileAudio, Info, ArrowRight, ChevronDown, Search, CheckCircle, XCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { detectHiddenMessageInImage } from '../utils/imageSteganoUtils';
import { detectHiddenMessageInAudio } from '../utils/audioSteganoUtils';

const DetectionPage = () => {
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
  
  const [error, setError] =  useState<string | null>(null);
  const [formStep, setFormStep] = useState(1); // 1 = Select type, 2 = Upload & Analyze
  
  const handleMediaTypeChange = (type: 'image' | 'audio') => {
    setMediaType(type);
    setUploadedFile(null);
    setDetectionResult(null);
    setError(null);
    setFormStep(2); // Move to next step
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
              <h3 className="text-xl font-bold text-gray-800 mb-2">Analyze Images</h3>
              <p className="text-gray-600 mb-4">
                Scan images for signs of hidden data using advanced statistical analysis and pattern detection.
              </p>
              <div className="text-blue-600 font-medium flex items-center">
                Analyze Image <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </button>
        
        <button
          type="button"
          onClick={() => handleMediaTypeChange('audio')}
          className="group relative bg-white overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 border border-gray-100 p-6 text-left h-full"
        >
          <div className="h-2 w-full absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-500 transform transition-transform duration-300 -translate-x-full group-hover:translate-x-0"></div>
          <div className="flex items-start">
            <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-green-200 transition-all">
              <FileAudio size={28} className="text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Analyze Audio</h3>
              <p className="text-gray-600 mb-4">
                Examine audio files for steganographic content by detecting anomalies in frequency patterns.
              </p>
              <div className="text-green-600 font-medium flex items-center">
                Analyze Audio <ArrowRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </button>
      </div>
    );
  };
  
  const renderAnalysisForm = () => {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
            mediaType === 'image' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
          }`}>
            {mediaType === 'image' ? <FileText size={20} /> : <FileAudio size={20} />}
          </div>
          Analyze {mediaType === 'image' ? 'Image' : 'Audio'} for Hidden Content
        </h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload {mediaType} File to Analyze
          </label>
          <div 
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-all cursor-pointer min-h-[200px] ${
              uploadedFile 
                ? (mediaType === 'image' ? 'border-blue-500 bg-blue-50' : 'border-green-500 bg-green-50')
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
                <p className={`${mediaType === 'image' ? 'text-blue-600' : 'text-green-600'} font-medium`}>File uploaded successfully</p>
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
                  Upload a file to analyze for hidden content
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
            onClick={handleDetection}
            className={`px-6 py-3 rounded-lg font-medium bg-gradient-to-r ${
              uploadedFile 
                ? 'from-blue-500 to-indigo-500 text-white hover:shadow-lg' 
                : 'from-gray-300 to-gray-400 text-gray-100 cursor-not-allowed'
            } shadow-md transition-all flex items-center`}
            disabled={!uploadedFile || isProcessing}
          >
            {isProcessing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                Analyze for Hidden Content
                <Search size={18} className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  };
  
  const renderDetectionResult = () => {
    if (!detectionResult) return null;
    
    const { hasHiddenContent, confidence } = detectionResult;
    const confidencePercent = Math.round(confidence * 100);
    
    return (
      <div className={`bg-white rounded-xl overflow-hidden shadow-lg border ${
        hasHiddenContent ? 'border-blue-200' : 'border-blue-200'
      }`}>
        <div className={`h-2 w-full ${
          hasHiddenContent 
            ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
            : 'bg-gradient-to-r from-blue-500 to-indigo-500'
        }`}></div>
        <div className="p-8 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
            mediaType === 'image' ? 'bg-blue-100' : 'bg-green-100'
          }`}>
            {hasHiddenContent ? (
              <AlertTriangle size={36} className={mediaType === 'image' ? 'text-blue-600' : 'text-green-600'} />
            ) : (
              <CheckCircle size={36} className={mediaType === 'image' ? 'text-blue-600' : 'text-green-600'} />
            )}
          </div>
          
          <h3 className={`text-2xl font-bold mb-4 ${
            mediaType === 'image' ? 'text-blue-700' : 'text-green-700'
          }`}>
            {hasHiddenContent ? 'Hidden Content Detected' : 'No Hidden Content Detected'}
          </h3>
          
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            {hasHiddenContent
              ? 'Our analysis indicates that this file likely contains hidden information embedded using steganographic techniques.'
              : 'Our analysis suggests this file does not contain hidden information. No steganographic content was detected.'}
          </p>
          
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-800">Confidence Level</span>
                <span className={`font-medium ${mediaType === 'image' ? 'text-blue-600' : 'text-green-600'}`}>
                  {confidencePercent}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${mediaType === 'image' ? 'bg-blue-500' : 'bg-green-500'} transition-all duration-1000 ease-out`}
                  style={{ width: `${confidencePercent}%` }}
                ></div>
              </div>
              
              <div className="mt-4 text-sm text-gray-500 flex items-start">
                <Info size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <p>
                  {hasHiddenContent
                    ? 'Higher confidence means our algorithms detected more patterns consistent with hidden data.'
                    : 'Higher confidence indicates greater certainty that no hidden content is present.'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => {
                setDetectionResult(null);
                setUploadedFile(null);
                setFormStep(1);
              }}
              className={`px-8 py-3 rounded-lg font-medium text-white shadow-md hover:shadow-lg transition-all bg-gradient-to-r ${
                mediaType === 'image' ? 'from-blue-600 to-indigo-600' : 'from-green-600 to-emerald-600'
              }`}
            >
              Analyze Another File
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderProcessingState = () => {
    return (
      <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 p-10 text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 opacity-25"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Shield size={32} className="text-blue-500" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">Analyzing File</h3>
        <p className="text-gray-600 mb-6">
          Our AI is scanning for hidden content and analyzing patterns...
        </p>
        
        <div className="w-full max-w-md mx-auto mb-6">
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <p className="text-sm text-gray-500">
          This may take a few moments depending on the file size and complexity
        </p>
      </div>
    );
  };
  
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Steganography Detection
            </span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our advanced algorithms can analyze files to detect hidden messages and
            determine if they contain steganographic content.
          </p>
        </div>
        
        {/* Progress Steps */}
        {!detectionResult && !isProcessing && (
          <div className="flex items-center justify-center max-w-xs mx-auto mb-12">
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
            
            <div className={`flex-1 h-1 mx-3 ${
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
                Analyze
              </span>
            </div>
          </div>
        )}
        
        {/* Content */}
        {isProcessing ? (
          renderProcessingState()
        ) : detectionResult ? (
          renderDetectionResult()
        ) : (
          <>
            {formStep === 1 && renderMediaTypeSelector()}
            {formStep === 2 && renderAnalysisForm()}
          </>
        )}
        
        {/* Information Section */}
        <div className="mt-12 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center">
            <Shield size={20} className="text-blue-600 mr-2" />
            How Detection Works
          </h3>
          <div className="text-gray-600 space-y-2 text-sm">
            <p>
              <span className="font-medium">Pattern Analysis:</span> Our AI analyzes statistical patterns in the file's data, 
              looking for anomalies that may indicate hidden information.
            </p>
            <p>
              <span className="font-medium">LSB Detection:</span> The analysis examines bit distribution in the least significant 
              bits where steganographic content is typically hidden.
            </p>
            <p>
              <span className="font-medium">Confidence Rating:</span> The confidence score represents how certain our algorithm 
              is about its findings based on multiple detection methods.
            </p>
            <p>
              <span className="font-medium">Limitations:</span> While highly accurate, detection is not 100% perfect. Very sophisticated 
              steganography techniques may sometimes evade detection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionPage;