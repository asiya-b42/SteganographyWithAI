import React, { useState } from 'react';
import { detectStegoInImage, loadStegoDetectionModel } from '../utils/mlStegoDetector';
import MLDetectionResult from '../components/features/detection/MLDetectionResult';

const MLDetectionPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<{ hasHiddenContent: boolean; confidence: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleDetect = async () => {
    if (!file) return;
    setLoading(true);
    if (!modelLoaded) {
      await loadStegoDetectionModel();
      setModelLoaded(true);
    }
    const detection = await detectStegoInImage(file);
    setResult(detection);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, background: '#fafafa', borderRadius: 12 }}>
      <h2>ML-Based Image Steganography Detection (Demo)</h2>
      <p style={{ color: '#555', fontSize: 14, marginBottom: 16 }}>
        This uses a Convolutional Neural Network (CNN) to detect hidden data in images.<br />
        ()
      </p>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleDetect} disabled={!file || loading} style={{ marginLeft: 12 }}>
        {loading ? (modelLoaded ? 'Running Model...' : 'Loading Model...') : 'Detect Stego'}
      </button>
      {loading && (
        <div style={{ marginTop: 12, color: '#1976d2', fontSize: 13 }}>
          {modelLoaded ? 'Analyzing image with CNN model...' : 'Loading CNN model...'}
        </div>
      )}
      {result && <MLDetectionResult {...result} />}
      <p style={{ color: '#888', fontSize: 12, marginTop: 16 }}>
        (This page simulates ML-based detection. No real model is used.)
      </p>
      <details style={{ marginTop: 18 }}>
        <summary style={{ cursor: 'pointer', color: '#888' }}>How does this ML detection work?</summary>
        <ul style={{ fontSize: 13, color: '#555', marginTop: 8 }}>
          <li>1. Loads a CNN model (simulated delay).</li>
          <li>2. "Preprocesses" the image (random tensor generation).</li>
          <li>3. "Runs inference" (random confidence score).</li>
          <li>4. Displays a prediction and confidence bar.</li>
        </ul>
      </details>
    </div>
  );
};

export default MLDetectionPage;
