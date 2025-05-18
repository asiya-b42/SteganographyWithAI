import React, { createContext, useContext, useState, ReactNode } from 'react';

type MediaType = 'image' | 'audio' | null;
type EncryptionMethod = 'aes' | 'des' | 'rsa' | null;
type ProcessingOperation = 'embedding' | 'extracting' | 'detecting' | null;

interface AppContextType {
  // Existing state
  mediaType: MediaType;
  setMediaType: (type: MediaType) => void;
  encryptionMethod: EncryptionMethod;
  setEncryptionMethod: (method: EncryptionMethod) => void;
  message: string;
  setMessage: (message: string) => void;
  password: string;
  setPassword: (password: string) => void;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  processedFileUrl: string | null;
  setProcessedFileUrl: (url: string | null) => void;
  extractedMessage: string;
  setExtractedMessage: (message: string) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  detectionResult: { hasHiddenContent: boolean; confidence: number } | null;
  setDetectionResult: (result: { hasHiddenContent: boolean; confidence: number } | null) => void;
  
  // New state for progress tracking
  processingProgress: number;
  setProcessingProgress: (progress: number) => void;
  currentOperation: ProcessingOperation;
  setCurrentOperation: (operation: ProcessingOperation) => void;
  processingError: string | null;
  setProcessingError: (error: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Existing state
  const [mediaType, setMediaType] = useState<MediaType>(null);
  const [encryptionMethod, setEncryptionMethod] = useState<EncryptionMethod>(null);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processedFileUrl, setProcessedFileUrl] = useState<string | null>(null);
  const [extractedMessage, setExtractedMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<{ hasHiddenContent: boolean; confidence: number } | null>(null);
  
  // New state for progress tracking
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentOperation, setCurrentOperation] = useState<ProcessingOperation>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const value = {
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
    extractedMessage,
    setExtractedMessage,
    isProcessing,
    setIsProcessing,
    detectionResult,
    setDetectionResult,
    
    // New state for progress tracking
    processingProgress,
    setProcessingProgress,
    currentOperation,
    setCurrentOperation,
    processingError,
    setProcessingError
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};