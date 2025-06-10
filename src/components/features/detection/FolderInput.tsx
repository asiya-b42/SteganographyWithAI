import React, { useState } from 'react';

interface FolderInputProps {
  onFoldersSelected: (cleanFiles: File[], stegoFiles: File[]) => void;
}

const FolderInput: React.FC<FolderInputProps> = ({ onFoldersSelected }) => {
  const [cleanFiles, setCleanFiles] = useState<File[]>([]);
  const [stegoFiles, setStegoFiles] = useState<File[]>([]);

  const handleCleanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setCleanFiles(files);
      onFoldersSelected(files, stegoFiles);
    }
  };

  const handleStegoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setStegoFiles(files);
      onFoldersSelected(cleanFiles, files);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 24, marginBottom: 24 }}>
      <div>
        <label style={{ fontWeight: 500 }}>Clean Images Folder:</label><br />
        <input
          type="file"
          webkitdirectory="true"
          directory="true"
          multiple
          accept="image/*"
          onChange={handleCleanChange}
        />
        <div style={{ fontSize: 12, color: '#888' }}>{cleanFiles.length} files selected</div>
      </div>
      <div>
        <label style={{ fontWeight: 500 }}>Stego Images Folder:</label><br />
        <input
          type="file"
          webkitdirectory="true"
          directory="true"
          multiple
          accept="image/*"
          onChange={handleStegoChange}
        />
        <div style={{ fontSize: 12, color: '#888' }}>{stegoFiles.length} files selected</div>
      </div>
    </div>
  );
};

export default FolderInput;
