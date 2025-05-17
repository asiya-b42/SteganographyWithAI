import React from 'react';
import { FileImage, FileAudio } from 'lucide-react';

type MediaType = 'image' | 'audio' | null;

interface MediaTypeSelectorProps {
  selectedType: MediaType;
  onChange: (type: MediaType) => void;
}

const MediaTypeSelector: React.FC<MediaTypeSelectorProps> = ({ selectedType, onChange }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        className={`flex-1 p-4 rounded-lg flex items-center justify-center gap-3 transition-all ${
          selectedType === 'image'
            ? 'bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border border-cyan-500/50 shadow-lg shadow-cyan-500/10'
            : 'bg-gray-800/30 border border-gray-700 hover:bg-gray-800/50'
        }`}
        onClick={() => onChange('image')}
      >
        <FileImage size={24} className={selectedType === 'image' ? 'text-cyan-400' : 'text-gray-400'} />
        <span className={`font-medium ${selectedType === 'image' ? 'text-cyan-400' : 'text-gray-300'}`}>
          Image Steganography
        </span>
      </button>
      
      <button
        className={`flex-1 p-4 rounded-lg flex items-center justify-center gap-3 transition-all ${
          selectedType === 'audio'
            ? 'bg-gradient-to-r from-purple-900/50 to-indigo-900/50 border border-purple-500/50 shadow-lg shadow-purple-500/10'
            : 'bg-gray-800/30 border border-gray-700 hover:bg-gray-800/50'
        }`}
        onClick={() => onChange('audio')}
      >
        <FileAudio size={24} className={selectedType === 'audio' ? 'text-purple-400' : 'text-gray-400'} />
        <span className={`font-medium ${selectedType === 'audio' ? 'text-purple-400' : 'text-gray-300'}`}>
          Audio Steganography
        </span>
      </button>
    </div>
  );
};

export default MediaTypeSelector;