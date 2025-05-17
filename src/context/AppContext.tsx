import React, { createContext, useContext, useState, ReactNode } from 'react';

type MediaType = 'image' | 'audio' | null;
type EncryptionMethod = 'aes' | 'des' | 'rsa' | null;

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

const AppContext = createContext<AppContextType | undefined>(undefined);

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
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};