import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import Card from '../../ui/Card';

interface DetectionResultProps {
  result: {
    hasHiddenContent: boolean;
    confidence: number;
  } | null;
  isLoading: boolean;
}

const DetectionResult: React.FC<DetectionResultProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="mt-8">
        <div className="flex flex-col items-center py-6">
          <div className="w-16 h-16 border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <h3 className="mt-4 text-lg font-medium text-white">Analyzing file</h3>
          <p className="text-gray-400 mt-2">Our AI is scanning for hidden content...</p>
        </div>
      </Card>
    );
  }

  if (!result) return null;

  const { hasHiddenContent, confidence } = result;
  const confidencePercent = Math.round(confidence * 100);

  return (
    <Card
      className={`mt-8 overflow-hidden ${
        hasHiddenContent ? 'border-amber-500/50' : 'border-green-500/50'
      }`}
    >
      <div className="flex flex-col items-center">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
            hasHiddenContent ? 'bg-amber-500/20' : 'bg-green-500/20'
          }`}
        >
          {hasHiddenContent ? (
            <AlertTriangle className="h-10 w-10 text-amber-500" />
          ) : (
            <Shield className="h-10 w-10 text-green-500" />
          )}
        </div>
        
        <h3 className={`text-xl font-medium ${hasHiddenContent ? 'text-amber-400' : 'text-green-400'}`}>
          {hasHiddenContent ? 'Hidden Content Detected' : 'No Hidden Content Detected'}
        </h3>
        
        <p className="text-gray-400 mt-2 text-center max-w-md">
          {hasHiddenContent
            ? 'Our AI has detected that this file likely contains hidden information.'
            : 'Our AI analysis suggests this file does not contain hidden information.'}
        </p>
        
        <div className="w-full mt-6 mb-2">
          <div className="flex justify-between mb-1">
            <span className="text-sm text-gray-400">Confidence level</span>
            <span className="text-sm font-medium text-white">{confidencePercent}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${
                hasHiddenContent ? 'bg-amber-500' : 'bg-green-500'
              }`}
              style={{ width: `${confidencePercent}%` }}
            ></div>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-4 text-center">
          Note: AI detection is not 100% accurate and should be used as a guide only.
        </p>
      </div>
    </Card>
  );
};

export default DetectionResult;