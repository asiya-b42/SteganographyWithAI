import React from 'react';

interface MLDetectionResultProps {
  hasHiddenContent: boolean;
  confidence: number;
}

const MLDetectionResult: React.FC<MLDetectionResultProps> = ({ hasHiddenContent, confidence }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: 16, borderRadius: 8, marginTop: 16 }}>
      <h3>ML Steganography Detection Result</h3>
      <div style={{ marginBottom: 8 }}>
        <strong>Model:</strong> <span style={{ color: '#1976d2' }}>FakeNet-v1 (Simulated CNN)</span>
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Prediction:</strong> {hasHiddenContent ? <span style={{ color: '#388e3c' }}>Stego Image Detected</span> : <span style={{ color: '#d32f2f' }}>No Stego Detected</span>}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Confidence:</strong> {(confidence * 100).toFixed(1)}%
        <div style={{ background: '#eee', borderRadius: 4, height: 10, width: 120, marginTop: 4 }}>
          <div style={{ background: hasHiddenContent ? '#388e3c' : '#d32f2f', width: `${Math.round(confidence * 100)}%`, height: '100%', borderRadius: 4 }} />
        </div>
      </div>
      <details style={{ marginTop: 10 }}>
        <summary style={{ cursor: 'pointer', color: '#888' }}>Show Model Details</summary>
        <pre style={{ fontSize: 12, color: '#555', background: '#f7f7f7', padding: 8, borderRadius: 4 }}>
{`Model: FakeNet-v1 (Simulated CNN)
Input: 128x128x3 image
Layers: Conv2D -> ReLU -> MaxPool -> Dense -> Softmax
Output: Stego/Not Stego (binary)`}
        </pre>
      </details>
      <p style={{ color: '#888', fontSize: 12, marginTop: 10 }}>
        (This is a dummy result. No real ML model is used.)
      </p>
    </div>
  );
};

export default MLDetectionResult;
