import React, { useCallback, useState } from 'react';
import { FileUp, FileImage, FileAudio, AlertCircle } from 'lucide-react';

interface DropzoneProps {
  onFileDrop: (file: File) => void;
  accept: string;
  maxSize?: number;
  label?: string;
  showPreview?: boolean;
}

const Dropzone: React.FC<DropzoneProps> = ({
  onFileDrop,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  label = 'Drag & drop your file here, or click to select',
  showPreview = true,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isImage = accept.includes('image');
  const isAudio = accept.includes('audio');

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file: File): boolean => {
    // Check file type
    const fileType = file.type;
    
    if (isImage && !fileType.startsWith('image/')) {
      setError('Please upload an image file');
      return false;
    }
    
    if (isAudio && !fileType.startsWith('audio/')) {
      setError('Please upload an audio file');
      return false;
    }
    
    // Check file size
    if (file.size > maxSize) {
      setError(`File size exceeds maximum limit of ${Math.round(maxSize / (1024 * 1024))}MB`);
      return false;
    }
    
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setError(null);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      if (validateFile(file)) {
        if (showPreview) {
          if (isImage) {
            const reader = new FileReader();
            reader.onload = () => {
              setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
          } else if (isAudio) {
            setPreview(URL.createObjectURL(file));
          }
        }
        
        onFileDrop(file);
      }
    }
  }, [onFileDrop, isImage, isAudio, maxSize, showPreview]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      if (validateFile(file)) {
        if (showPreview) {
          if (isImage) {
            const reader = new FileReader();
            reader.onload = () => {
              setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
          } else if (isAudio) {
            setPreview(URL.createObjectURL(file));
          }
        }
        
        onFileDrop(file);
      }
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-all cursor-pointer min-h-[200px] ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10'
            : error
            ? 'border-red-500 bg-red-500/5'
            : preview
            ? 'border-green-500 bg-green-500/5'
            : 'border-slate-600 hover:border-slate-500 bg-slate-800/30 hover:bg-slate-700/40'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input
          id="fileInput"
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileInputChange}
        />
        
        {error ? (
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <p className="text-red-500">{error}</p>
            <p className="mt-2 text-sm text-slate-400">Please try again with a different file</p>
          </div>
        ) : preview ? (
          <div className="text-center w-full">
            {isImage && (
              <div className="mb-4 relative w-full max-w-xs mx-auto">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-40 max-w-full mx-auto rounded object-contain"
                />
              </div>
            )}
            {isAudio && (
              <div className="mb-4 w-full">
                <audio controls className="w-full">
                  <source src={preview} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
            <p className="text-green-400 font-medium">File uploaded successfully</p>
            <p className="mt-1 text-sm text-slate-400">Click or drag to replace this file</p>
          </div>
        ) : (
          <div className="text-center">
            {isImage ? (
              <FileImage className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            ) : isAudio ? (
              <FileAudio className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            ) : (
              <FileUp className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            )}
            <p className="text-slate-300">{label}</p>
            <p className="mt-2 text-sm text-slate-400">
              {isImage ? 'Supports JPG, PNG, WebP, GIF' : isAudio ? 'Supports MP3, WAV, OGG, FLAC' : 'Select a file'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Max file size: {Math.round(maxSize / (1024 * 1024))}MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropzone;