import React, { createContext, useContext, useState, ReactNode } from 'react';

type MediaType = 'image' | 'audio' | null;
type EncryptionMethod = 'aes' | 'des' | 'rsa' | 'caesar' | 'playfair' | 'hill' | 'vigenere' | null;

interface AppContextType {
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
}

// Create a default context with sensible initial values
const defaultContextValue: AppContextType = {
  mediaType: null,
  setMediaType: () => {},
  encryptionMethod: null,
  setEncryptionMethod: () => {},
  message: '',
  setMessage: () => {},
  password: '',
  setPassword: () => {},
  uploadedFile: null,
  setUploadedFile: () => {},
  processedFileUrl: null,
  setProcessedFileUrl: () => {},
  extractedMessage: '',
  setExtractedMessage: () => {},
  isProcessing: false,
  setIsProcessing: () => {},
  detectionResult: null,
  setDetectionResult: () => {},
};

const AppContext = createContext<AppContextType>(defaultContextValue);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [mediaType, setMediaType] = useState<MediaType>(null);
  const [encryptionMethod, setEncryptionMethod] = useState<EncryptionMethod>(null);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [processedFileUrl, setProcessedFileUrl] = useState<string | null>(null);
  const [extractedMessage, setExtractedMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectionResult, setDetectionResult] = useState<{ hasHiddenContent: boolean; confidence: number } | null>(null);

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
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};