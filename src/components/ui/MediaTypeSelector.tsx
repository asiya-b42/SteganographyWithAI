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
        type="button"
        className={`flex-1 p-4 rounded-lg flex items-center justify-center gap-3 transition-all ${
          selectedType === 'image'
            ? 'bg-indigo-900/40 border border-indigo-500/50 shadow-lg shadow-indigo-500/10'
            : 'bg-slate-800 border border-slate-700 hover:bg-slate-700'
        }`}
        onClick={() => onChange('image')}
      >
        <FileImage size={24} className={selectedType === 'image' ? 'text-indigo-400' : 'text-slate-400'} />
        <span className={`font-medium ${selectedType === 'image' ? 'text-indigo-400' : 'text-slate-300'}`}>
          Image Steganography
        </span>
      </button>
      
      <button
        type="button"
        className={`flex-1 p-4 rounded-lg flex items-center justify-center gap-3 transition-all ${
          selectedType === 'audio'
            ? 'bg-cyan-900/40 border border-cyan-500/50 shadow-lg shadow-cyan-500/10'
            : 'bg-slate-800 border border-slate-700 hover:bg-slate-700'
        }`}
        onClick={() => onChange('audio')}
      >
        <FileAudio size={24} className={selectedType === 'audio' ? 'text-cyan-400' : 'text-slate-400'} />
        <span className={`font-medium ${selectedType === 'audio' ? 'text-cyan-400' : 'text-slate-300'}`}>
          Audio Steganography
        </span>
      </button>
    </div>
  );
};

export default MediaTypeSelector;